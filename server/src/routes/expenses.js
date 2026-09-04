const express = require("express");
const controller = require("../controllers/expenses");

const router = express.Router();
router.get("/", controller.listExpenses);
router.get("/:id", controller.getExpense);
router.post("/", controller.createExpense);
router.put("/:id", controller.updateExpense);
router.delete("/:id", controller.deleteExpense);

module.exports = router;
