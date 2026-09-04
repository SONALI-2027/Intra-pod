const { pool } = require("../config/db");

async function getSummary(req, res, next) {
  try {
    const [totals, categories, trends] = await Promise.all([
      pool.query("SELECT COALESCE(SUM(amount), 0) AS spent, COUNT(*)::int AS transactions FROM expenses WHERE date_trunc('month', spent_on) = date_trunc('month', CURRENT_DATE)"),
      pool.query("SELECT category, COALESCE(SUM(amount), 0) AS amount FROM expenses WHERE date_trunc('month', spent_on) = date_trunc('month', CURRENT_DATE) GROUP BY category ORDER BY amount DESC"),
      pool.query("SELECT to_char(spent_on, 'Mon') AS month, COALESCE(SUM(amount), 0) AS amount FROM expenses WHERE spent_on >= CURRENT_DATE - INTERVAL '5 months' GROUP BY date_trunc('month', spent_on), to_char(spent_on, 'Mon') ORDER BY date_trunc('month', spent_on)"),
    ]);
    const spent = Number(totals.rows[0].spent);
    const budgetResult = await pool.query("SELECT COALESCE(SUM(amount), 0) AS budget FROM budgets");
    const budget = Number(budgetResult.rows[0].budget);
    res.json({
      success: true,
      data: {
        spent,
        budget,
        remaining: Math.max(budget - spent, 0),
        transactions: totals.rows[0].transactions,
        byCategory: categories.rows.map((row) => ({ category: row.category, amount: Number(row.amount) })),
        trend: trends.rows.map((row) => ({ month: row.month, amount: Number(row.amount) })),
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getSummary };
