const { pool } = require("../config/db");

const DEMO_USER_ID = Number(process.env.DEMO_USER_ID || 1);

async function listBudgets(req, res, next) {
  try {
    const result = await pool.query(
      `
      SELECT
        b.id,
        c.name AS category,
        b.amount,
        b.month
      FROM budgets b
      JOIN categories c
        ON c.id = b.category_id
      WHERE b.user_id = $1
        AND b.month = DATE_TRUNC('month', CURRENT_DATE)::date
      ORDER BY c.name
      `,
      [DEMO_USER_ID]
    );

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        id: row.id,
        category: row.category,
        amount: Number(row.amount),
        month: row.month,
      })),
    });
  } catch (error) {
    next(error);
  }
}

async function saveBudget(req, res, next) {
  try {
    const category =
      typeof req.body?.category === "string"
        ? req.body.category.trim()
        : "";

    const amount = Number(req.body?.amount);

    if (!category || category.length > 100) {
      return res.status(400).json({
        success: false,
        message: "category is required",
      });
    }

    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({
        success: false,
        message: "amount must be zero or greater",
      });
    }

    const categoryResult = await pool.query(
      `
      SELECT id
      FROM categories
      WHERE user_id = $1
        AND name = $2
      `,
      [DEMO_USER_ID, category]
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
      INSERT INTO budgets
        (
          user_id,
          category_id,
          month,
          amount
        )
      VALUES
        (
          $1,
          $2,
          DATE_TRUNC('month', CURRENT_DATE)::date,
          $3
        )
      ON CONFLICT (user_id, category_id, month)
      DO UPDATE SET
        amount = EXCLUDED.amount,
        updated_at = NOW()
      RETURNING *
      `,
      [DEMO_USER_ID, categoryId, amount]
    );

    res.status(200).json({
      success: true,
      data: {
        id: result.rows[0].id,
        category,
        amount: Number(result.rows[0].amount),
        month: result.rows[0].month,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function deleteBudget(req, res, next) {
  try {
    const result = await pool.query(
      `
      DELETE FROM budgets b
      USING categories c
      WHERE b.category_id = c.id
        AND b.user_id = $1
        AND c.name = $2
        AND b.month = DATE_TRUNC('month', CURRENT_DATE)::date
      RETURNING b.id
      `,
      [DEMO_USER_ID, req.params.category]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listBudgets,
  saveBudget,
  deleteBudget,
};