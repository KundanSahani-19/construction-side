const express = require("express");

const {
  getLabourStatement,
  getLabourStatementSummary,
  searchLabourForStatement,
} = require(
  "../controllers/LabourStatementController"
);

const router = express.Router();

// ==========================================
// SEARCH LABOUR
// ==========================================

router.get(
  "/search",
  searchLabourForStatement
);

// ==========================================
// COMPLETE LABOUR STATEMENT
// ==========================================

router.get(
  "/:labourId",
  getLabourStatement
);

// ==========================================
// LABOUR SUMMARY
// ==========================================

router.get(
  "/:labourId/summary",
  getLabourStatementSummary
);

module.exports = router;