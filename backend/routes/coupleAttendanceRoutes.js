const express = require("express");

const {
  createCoupleAttendance,
  getCoupleAttendances,
  getCoupleAttendanceById,
  getAttendanceByCouple,
  updateCoupleAttendance,
  deleteCoupleAttendance,
} = require("../controllers/CoupleAttendanceController");

const router = express.Router();


// Add attendance
router.post("/", createCoupleAttendance);


// All attendance
router.get("/", getCoupleAttendances);


// Attendance of one couple
router.get(
  "/couple/:coupleId",
  getAttendanceByCouple
);


// Single attendance
router.get(
  "/:id",
  getCoupleAttendanceById
);


// Update
router.put(
  "/:id",
  updateCoupleAttendance
);


// Delete
router.delete(
  "/:id",
  deleteCoupleAttendance
);


module.exports = router;