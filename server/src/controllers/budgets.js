const { pool } = require("../config/db");

async function listBudgets(req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM budgets ORDER BY category");
    res.json({ success: true, data: result.rows.map((row) => ({ id: row.id, category: row.category, amount: Number(row.amount) })) });
  } catch (error) {
    next(error);
  }
}

async function saveBudget(req, res, next) {
  try {
    const category = typeof req.body?.category === "string" ? req.body.category.trim() : "";
    const amount = Number(req.body?.amount);
    if (!category || category.length > 40) return res.status(400).json({ success: false, message: "category is required" });
    if (!Number.isFinite(amount) || amount < 0) return res.status(400).json({ success: false, message: "amount must be zero or greater" });
    const result = await pool.query(
      "INSERT INTO budgets (category, amount) VALUES ($1, $2) ON CONFLICT (category) DO UPDATE SET amount = EXCLUDED.amount, updated_at = NOW() RETURNING *",
      [category, amount],
    );
    res.status(200).json({ success: true, data: { id: result.rows[0].id, category: result.rows[0].category, amount: Number(result.rows[0].amount) } });
  } catch (error) {
    next(error);
  }
}

async function deleteBudget(req, res, next) {
  try {
    const result = await pool.query("DELETE FROM budgets WHERE category = $1 RETURNING id", [req.params.category]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: "Budget not found" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { listBudgets, saveBudget, deleteBudget };
