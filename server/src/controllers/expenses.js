const { pool } = require("../config/db");
const { validateExpense } = require("../validators/expense");

function mapExpense(row) {
  return {
    id: row.id,
    merchant: row.merchant,
    category: row.category,
    amount: Number(row.amount),
    date: row.spent_on,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

async function listExpenses(req, res, next) {
  try {
    const values = [];
    const conditions = [];
    if (req.query.category && req.query.category !== "All categories") {
      values.push(req.query.category);
      conditions.push(`category = $${values.length}`);
    }
    const sortMap = {
      oldest: "spent_on ASC, id ASC",
      highest: "amount DESC, id DESC",
      lowest: "amount ASC, id ASC",
      newest: "spent_on DESC, id DESC",
    };
    const order = sortMap[req.query.sort] || sortMap.newest;
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const result = await pool.query(`SELECT * FROM expenses ${where} ORDER BY ${order}`, values);
    res.json({ success: true, data: result.rows.map(mapExpense) });
  } catch (error) {
    next(error);
  }
}

async function getExpense(req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM expenses WHERE id = $1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: "Expense not found" });
    res.json({ success: true, data: mapExpense(result.rows[0]) });
  } catch (error) {
    next(error);
  }
}

async function createExpense(req, res, next) {
  try {
    const { errors, value } = validateExpense(req.body || {});
    if (errors.length) return res.status(400).json({ success: false, errors });
    const result = await pool.query(
      "INSERT INTO expenses (merchant, category, amount, spent_on, notes) VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), $5) RETURNING *",
      [value.merchant, value.category, value.amount, value.spentOn || null, value.notes || null],
    );
    res.status(201).json({ success: true, data: mapExpense(result.rows[0]) });
  } catch (error) {
    next(error);
  }
}

async function updateExpense(req, res, next) {
  try {
    const { errors, value } = validateExpense(req.body || {}, true);
    if (errors.length) return res.status(400).json({ success: false, errors });
    const fields = { merchant: "merchant", category: "category", amount: "amount", spentOn: "spent_on", notes: "notes" };
    const updates = Object.keys(value).map((key, index) => `${fields[key]} = $${index + 1}`);
    if (!updates.length) return res.status(400).json({ success: false, message: "No fields to update" });
    const result = await pool.query(`UPDATE expenses SET ${updates.join(", ")} WHERE id = $${updates.length + 1} RETURNING *`, [...Object.values(value), req.params.id]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: "Expense not found" });
    res.json({ success: true, data: mapExpense(result.rows[0]) });
  } catch (error) {
    next(error);
  }
}

async function deleteExpense(req, res, next) {
  try {
    const result = await pool.query("DELETE FROM expenses WHERE id = $1 RETURNING id", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: "Expense not found" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { listExpenses, getExpense, createExpense, updateExpense, deleteExpense };
