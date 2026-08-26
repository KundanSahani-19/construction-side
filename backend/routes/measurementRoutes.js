const express = require("express");

const {
  createMeasurement,
  getMeasurements,
  getMeasurementById,
  getSiteMeasurements,
  updateMeasurement,
  deleteMeasurement,
} = require("../controllers/measurementController");

const router = express.Router();


// ======================================================
// CREATE
// ======================================================

router.post(
  "/",
  createMeasurement
);


// ======================================================
// GET ALL
// ======================================================

router.get(
  "/",
  getMeasurements
);


// ======================================================
// GET SITE MEASUREMENTS
// ======================================================

router.get(
  "/site/:siteId",
  getSiteMeasurements
);


// ======================================================
// GET ONE
// ======================================================

router.get(
  "/:id",
  getMeasurementById
);


// ======================================================
// UPDATE
// ======================================================

router.put(
  "/:id",
  updateMeasurement
);


// ======================================================
// DELETE
// ======================================================

router.delete(
  "/:id",
  deleteMeasurement
);


module.exports = router;