const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

async function testDatabaseConnection() {
  const result = await pool.query("SELECT NOW()");
  return result.rows[0];
}

module.exports = {
  pool,
  testDatabaseConnection,
};