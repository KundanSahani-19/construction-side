const express = require("express");

const {
  createLabour,
  getLabours,
  getLabourById,
  updateLabour,
  deleteLabour,
} = require("../controllers/LabourController");

const router = express.Router();

router.post("/", createLabour);
router.get("/", getLabours);
router.get("/:id", getLabourById);
router.put("/:id", updateLabour);
router.delete("/:id", deleteLabour);

module.exports = router;