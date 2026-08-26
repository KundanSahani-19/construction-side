const express = require("express");

const {
  createAttendance,
  getAttendances,
  getAttendanceByDate,
  getSiteAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/AttendanceController");

const router = express.Router();

router.post("/", createAttendance);

router.get("/", getAttendances);

router.get("/date/:date", getAttendanceByDate);

router.get("/site/:siteId", getSiteAttendance);

router.put("/:id", updateAttendance);

router.delete("/:id", deleteAttendance);

module.exports = router;