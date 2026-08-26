const express = require("express");

const {
  assignLabour,
  getAssignments,
  getLabourHistory,
} = require("../controllers/LabourAssignmentController");

const router = express.Router();

router.post("/", assignLabour);

router.get("/", getAssignments);

router.get(
  "/labour/:labourId",
  getLabourHistory
);

module.exports = router;