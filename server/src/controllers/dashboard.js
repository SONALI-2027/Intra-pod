const { pool } = require("../config/db");

const DEMO_USER_ID = Number(process.env.DEMO_USER_ID || 1);

async function getSummary(req, res, next) {
  try {
    const [totals, categories, trends, budgetResult] =
      await Promise.all([
        pool.query(
          `
          SELECT
            COALESCE(SUM(amount), 0) AS spent,
            COUNT(*)::int AS transactions
          FROM expenses
          WHERE user_id = $1
            AND date_trunc('month', expense_date)
                = date_trunc('month', CURRENT_DATE)
          `,
          [DEMO_USER_ID]
        ),

        pool.query(
          `
          SELECT
            c.name AS category,
            COALESCE(SUM(e.amount), 0) AS amount
          FROM expenses e
          JOIN categories c
            ON c.id = e.category_id
          WHERE e.user_id = $1
            AND date_trunc('month', e.expense_date)
                = date_trunc('month', CURRENT_DATE)
          GROUP BY c.name
          ORDER BY amount DESC
          `,
          [DEMO_USER_ID]
        ),

        pool.query(
          `
          SELECT
            TO_CHAR(DATE_TRUNC('month', expense_date), 'Mon') AS month,
            COALESCE(SUM(amount), 0) AS amount
          FROM expenses
          WHERE user_id = $1
            AND expense_date >=
                DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
          GROUP BY DATE_TRUNC('month', expense_date)
          ORDER BY DATE_TRUNC('month', expense_date)
          `,
          [DEMO_USER_ID]
        ),

        pool.query(
          `
          SELECT
            COALESCE(SUM(amount), 0) AS budget
          FROM budgets
          WHERE user_id = $1
            AND month = DATE_TRUNC('month', CURRENT_DATE)::date
          `,
          [DEMO_USER_ID]
        ),
      ]);

    const spent = Number(totals.rows[0].spent);
    const budget = Number(budgetResult.rows[0].budget);

    res.json({
      success: true,
      data: {
        spent,
        budget,
        remaining: Math.max(budget - spent, 0),
        transactions: totals.rows[0].transactions,

        byCategory: categories.rows.map((row) => ({
          category: row.category,
          amount: Number(row.amount),
        })),

        trend: trends.rows.map((row) => ({
          month: row.month,
          amount: Number(row.amount),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSummary,
};