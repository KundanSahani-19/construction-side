const express = require("express");

const {
  createLabourAdvance,
  getLabourAdvances,
  getLabourAdvanceById,
  getLabourAdvancesByLabour,
  getLabourAdvancesBySite,
  updateLabourAdvance,
  deleteLabourAdvance,
} = require("../controllers/LabourAdvanceController");

const router = express.Router();

// ==========================================
// CREATE
// ==========================================

router.post(
  "/",
  createLabourAdvance
);

// ==========================================
// GET ALL
// ==========================================

router.get(
  "/",
  getLabourAdvances
);

// ==========================================
// GET BY LABOUR
// IMPORTANT:
// Ye route /:id se pehle hona chahiye.
// ==========================================

router.get(
  "/labour/:labourId",
  getLabourAdvancesByLabour
);

// ==========================================
// GET BY SITE
// ==========================================

router.get(
  "/site/:siteId",
  getLabourAdvancesBySite
);

// ==========================================
// GET SINGLE
// ==========================================

router.get(
  "/:id",
  getLabourAdvanceById
);

// ==========================================
// UPDATE
// ==========================================

router.put(
  "/:id",
  updateLabourAdvance
);

// ==========================================
// DELETE
// ==========================================

router.delete(
  "/:id",
  deleteLabourAdvance
);

module.exports = router;