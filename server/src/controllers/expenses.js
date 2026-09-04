const { pool } = require("../config/db");
const { validateExpense } = require("../validators/expense");

const DEMO_USER_ID = Number(process.env.DEMO_USER_ID || 1);

function mapExpense(row) {
  return {
    id: row.id,
    merchant: row.merchant,
    category: row.category,
    amount: Number(row.amount),
    date: row.expense_date,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

async function listExpenses(req, res, next) {
  try {
    const values = [DEMO_USER_ID];
    const conditions = ["e.user_id = $1"];

    if (
      req.query.category &&
      req.query.category !== "All categories"
    ) {
      values.push(req.query.category);
      conditions.push(`c.name = $${values.length}`);
    }

    const sortMap = {
      oldest: "e.expense_date ASC, e.id ASC",
      highest: "e.amount DESC, e.id DESC",
      lowest: "e.amount ASC, e.id ASC",
      newest: "e.expense_date DESC, e.id DESC",
    };

    const order = sortMap[req.query.sort] || sortMap.newest;

    const result = await pool.query(
      `
      SELECT
        e.id,
        e.merchant,
        c.name AS category,
        e.amount,
        e.expense_date,
        e.notes,
        e.created_at
      FROM expenses e
      JOIN categories c
        ON c.id = e.category_id
      WHERE ${conditions.join(" AND ")}
      ORDER BY ${order}
      `,
      values
    );

    res.json({
      success: true,
      data: result.rows.map(mapExpense),
    });
  } catch (error) {
    next(error);
  }
}

async function getExpense(req, res, next) {
  try {
    const result = await pool.query(
      `
      SELECT
        e.id,
        e.merchant,
        c.name AS category,
        e.amount,
        e.expense_date,
        e.notes,
        e.created_at
      FROM expenses e
      JOIN categories c
        ON c.id = e.category_id
      WHERE e.id = $1
        AND e.user_id = $2
      `,
      [req.params.id, DEMO_USER_ID]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      data: mapExpense(result.rows[0]),
    });
  } catch (error) {
    next(error);
  }
}

async function createExpense(req, res, next) {
  try {
    const { errors, value } = validateExpense(req.body || {});

    if (errors.length) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const categoryResult = await pool.query(
      `
      SELECT id
      FROM categories
      WHERE user_id = $1
        AND name = $2
      `,
      [DEMO_USER_ID, value.category]
    );

    if (!categoryResult.rowCount) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    const categoryId = categoryResult.rows[0].id;

    const result = await pool.query(
      `
      INSERT INTO expenses
        (
          user_id,
          category_id,
          merchant,
          amount,
          expense_date,
          notes
        )
      VALUES
        ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE), $6)
      RETURNING *
      `,
      [
        DEMO_USER_ID,
        categoryId,
        value.merchant,
        value.amount,
        value.spentOn || null,
        value.notes || null,
      ]
    );

    const created = await pool.query(
      `
      SELECT
        e.id,
        e.merchant,
        c.name AS category,
        e.amount,
        e.expense_date,
        e.notes,
        e.created_at
      FROM expenses e
      JOIN categories c
        ON c.id = e.category_id
      WHERE e.id = $1
      `,
      [result.rows[0].id]
    );

    res.status(201).json({
      success: true,
      data: mapExpense(created.rows[0]),
    });
  } catch (error) {
    next(error);
  }
}

async function updateExpense(req, res, next) {
  try {
    const { errors, value } = validateExpense(req.body || {}, true);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const updates = [];
    const values = [];

    if (value.merchant !== undefined) {
      values.push(value.merchant);
      updates.push(`merchant = $${values.length}`);
    }

    if (value.amount !== undefined) {
      values.push(value.amount);
      updates.push(`amount = $${values.length}`);
    }

    if (value.spentOn !== undefined) {
      values.push(value.spentOn);
      updates.push(`expense_date = $${values.length}`);
    }

    if (value.notes !== undefined) {
      values.push(value.notes);
      updates.push(`notes = $${values.length}`);
    }

    if (value.category !== undefined) {
      const categoryResult = await pool.query(
        `
        SELECT id
        FROM categories
        WHERE user_id = $1
          AND name = $2
        `,
        [DEMO_USER_ID, value.category]
      );

      if (!categoryResult.rowCount) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }

      values.push(categoryResult.rows[0].id);
      updates.push(`category_id = $${values.length}`);
    }

    if (!updates.length) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(req.params.id);
    values.push(DEMO_USER_ID);

    const result = await pool.query(
      `
      UPDATE expenses
      SET ${updates.join(", ")}
      WHERE id = $${values.length - 1}
        AND user_id = $${values.length}
      RETURNING *
      `,
      values
    );

    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const updated = await pool.query(
      `
      SELECT
        e.id,
        e.merchant,
        c.name AS category,
        e.amount,
        e.expense_date,
        e.notes,
        e.created_at
      FROM expenses e
      JOIN categories c
        ON c.id = e.category_id
      WHERE e.id = $1
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      data: mapExpense(updated.rows[0]),
    });
  } catch (error) {
    next(error);
  }
}

async function deleteExpense(req, res, next) {
  try {
    const result = await pool.query(
      `
      DELETE FROM expenses
      WHERE id = $1
        AND user_id = $2
      RETURNING id
      `,
      [req.params.id, DEMO_USER_ID]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
};