const express = require("express");
const controller = require("../controllers/budgets");

const router = express.Router();
router.get("/", controller.listBudgets);
router.post("/", controller.saveBudget);
router.put("/:category", controller.saveBudget);
router.delete("/:category", controller.deleteBudget);

module.exports = router;
