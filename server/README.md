# Spendly API

## Setup

1. Create a PostgreSQL database named `spendly`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` to the database connection string.
3. Install dependencies with `npm install`.
4. Start the API with `npm run dev` or `npm start`.

The server creates the `expenses` and `budgets` tables on startup.

## Endpoints

- `GET /api/health`
- `GET /api/expenses?category=Food&sort=newest`
- `GET /api/expenses/:id`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`
- `GET /api/budgets`
- `POST /api/budgets`
- `PUT /api/budgets/:category`
- `DELETE /api/budgets/:category`
- `GET /api/dashboard/summary`

Expense request example:

```json
{
  "merchant": "Amazon",
  "category": "Shopping",
  "amount": 1499,
  "date": "2026-09-04",
  "notes": "Household supplies"
}
```
