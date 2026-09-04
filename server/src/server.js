const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { pool, testDatabaseConnection } = require("./config/db");
const expenseRoutes = require("./routes/expenses");
const budgetRoutes = require("./routes/budgets");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check — confirms server AND database both work
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ success: true, message: "Server and database are running" });
  } catch (err) {
    console.error(err);
    res.status(503).json({ success: false, message: "Database connection failed" });
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await testDatabaseConnection();
    console.log("PostgreSQL database connected");
  } catch (error) {
    console.error("PostgreSQL connection failed:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

