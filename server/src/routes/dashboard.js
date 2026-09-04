const express = require("express");
const { getSummary } = require("../controllers/dashboard");

const router = express.Router();
router.get("/summary", getSummary);

module.exports = router;
