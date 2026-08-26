const Attendance = require("../models/Attendance");
const Labour = require("../models/Labour");

// ==========================================
// CREATE ATTENDANCE
// ==========================================

const createAttendance = async (req, res) => {
  try {
    const {
      labour,
      site,
      team,
      attendanceDate,
      status,
      overtimeHours,
      attendanceUnit,
      notes,
    } = req.body;

    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (!labour) {
      return res.status(400).json({
        success: false,
        message: "Labour required",
      });
    }

    if (!site) {
      return res.status(400).json({
        success: false,
        message: "Site required",
      });
    }

    if (!attendanceDate) {
      return res.status(400).json({
        success: false,
        message: "Attendance date required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Attendance status required",
      });
    }

    // ==========================================
    // DAY VALUE
    // ==========================================

    let dayValue = 0;

    if (status === "Present") {
      dayValue = 1;
    } else if (status === "Half Day") {
      dayValue = 0.5;
    } else {
      dayValue = 0;
    }

    // ==========================================
    // FIND LABOUR
    // ==========================================

    const labourData = await Labour.findById(labour);

    if (!labourData) {
      return res.status(404).json({
        success: false,
        message: "Labour not found",
      });
    }

    // ==========================================
    // OVERTIME
    // ==========================================

    const hours = Number(overtimeHours || 0);

    const overtimeRate = Number(
      labourData.overtimeRate || 0
    );

    const overtimeAmount =
      hours * overtimeRate;

    // ==========================================
    // CREATE
    // ==========================================

    const attendance = await Attendance.create({
      labour,
      site,
      team: team || null,

      attendanceDate,

      status,

      dayValue,

      overtimeHours: hours,

      overtimeAmount,

      attendanceUnit:
        attendanceUnit || "Individual",

      notes: notes || "",
    });

    // ==========================================
    // POPULATE RESULT
    // ==========================================

    const result =
      await Attendance.findById(
        attendance._id
      )
        .populate(
          "labour",
          "name mobile labourType dailyRate overtimeRate memberCount"
        )
        .populate(
          "site",
          "siteName location"
        )
        .populate(
          "team",
          "teamName"
        );

    return res.status(201).json({
      success: true,

      message:
        "Attendance marked successfully",

      data: result,
    });

  } catch (error) {

    console.error(
      "Create Attendance Error:",
      error
    );

    // ==========================================
    // DUPLICATE ATTENDANCE
    // ==========================================

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,

        message:
          "Is labour ki attendance is date ke liye already marked hai.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL ATTENDANCE
// ==========================================

const getAttendances = async (req, res) => {
  try {

    const filter = {};

    // -------------------------------
    // DATE FILTER
    // -------------------------------

    if (req.query.date) {
      filter.attendanceDate =
        req.query.date;
    }

    // -------------------------------
    // LABOUR FILTER
    // -------------------------------

    if (req.query.labour) {
      filter.labour =
        req.query.labour;
    }

    // -------------------------------
    // SITE FILTER
    // -------------------------------

    if (req.query.site) {
      filter.site =
        req.query.site;
    }

    // -------------------------------
    // STATUS FILTER
    // -------------------------------

    if (req.query.status) {
      filter.status =
        req.query.status;
    }

    // ==========================================
    // FIND
    // ==========================================

    const attendance =
      await Attendance.find(filter)

        .populate(
          "labour",
          "name mobile labourType dailyRate overtimeRate memberCount"
        )

        .populate(
          "site",
          "siteName location"
        )

        .populate(
          "team",
          "teamName"
        )

        .sort({
          attendanceDate: -1,
          createdAt: -1,
        });

    return res.json({
      success: true,

      count: attendance.length,

      data: attendance,
    });

  } catch (error) {

    console.error(
      "Get Attendance Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ATTENDANCE BY DATE
// ==========================================

const getAttendanceByDate = async (
  req,
  res
) => {

  try {

    const attendance =
      await Attendance.find({
        attendanceDate:
          req.params.date,
      })

        .populate(
          "labour",
          "name mobile labourType dailyRate overtimeRate memberCount"
        )

        .populate(
          "site",
          "siteName location"
        )

        .populate(
          "team",
          "teamName"
        )

        .sort({
          createdAt: 1,
        });

    return res.json({
      success: true,

      count: attendance.length,

      data: attendance,
    });

  } catch (error) {

    console.error(
      "Get Attendance By Date Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET SITE ATTENDANCE
// ==========================================

const getSiteAttendance = async (
  req,
  res
) => {

  try {

    const attendance =
      await Attendance.find({
        site: req.params.siteId,
      })

        .populate(
          "labour",
          "name mobile labourType dailyRate overtimeRate memberCount"
        )

        .populate(
          "site",
          "siteName location"
        )

        .populate(
          "team",
          "teamName"
        )

        .sort({
          attendanceDate: -1,
          createdAt: -1,
        });

    return res.json({
      success: true,

      count: attendance.length,

      data: attendance,
    });

  } catch (error) {

    console.error(
      "Get Site Attendance Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE ATTENDANCE
// ==========================================

const updateAttendance = async (
  req,
  res
) => {

  try {

    const {
      status,
      overtimeHours,
      attendanceUnit,
      notes,
    } = req.body;

    // ==========================================
    // FIND ATTENDANCE
    // ==========================================

    const attendance =
      await Attendance.findById(
        req.params.id
      );

    if (!attendance) {
      return res.status(404).json({
        success: false,

        message:
          "Attendance not found",
      });
    }

    // ==========================================
    // FIND LABOUR
    // ==========================================

    const labour =
      await Labour.findById(
        attendance.labour
      );

    if (!labour) {
      return res.status(404).json({
        success: false,

        message:
          "Labour not found",
      });
    }

    // ==========================================
    // DAY VALUE
    // ==========================================

    let dayValue =
      attendance.dayValue || 0;

    if (status === "Present") {
      dayValue = 1;
    } else if (status === "Half Day") {
      dayValue = 0.5;
    } else if (status === "Absent") {
      dayValue = 0;
    }

    // ==========================================
    // OVERTIME
    // ==========================================

    const hours =
      Number(
        overtimeHours ?? 0
      );

    const overtimeRate =
      Number(
        labour.overtimeRate || 0
      );

    const overtimeAmount =
      hours * overtimeRate;

    // ==========================================
    // UPDATE
    // ==========================================

    if (status) {
      attendance.status =
        status;
    }

    attendance.dayValue =
      dayValue;

    attendance.overtimeHours =
      hours;

    attendance.overtimeAmount =
      overtimeAmount;

    if (attendanceUnit) {
      attendance.attendanceUnit =
        attendanceUnit;
    }

    if (notes !== undefined) {
      attendance.notes =
        notes;
    }

    await attendance.save();

    // ==========================================
    // POPULATE
    // ==========================================

    const result =
      await Attendance.findById(
        attendance._id
      )
        .populate(
          "labour",
          "name mobile labourType dailyRate overtimeRate memberCount"
        )
        .populate(
          "site",
          "siteName location"
        )
        .populate(
          "team",
          "teamName"
        );

    return res.json({
      success: true,

      message:
        "Attendance updated successfully",

      data: result,
    });

  } catch (error) {

    console.error(
      "Update Attendance Error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// DELETE ATTENDANCE
// ==========================================

const deleteAttendance = async (
  req,
  res
) => {

  try {

    const attendance =
      await Attendance.findByIdAndDelete(
        req.params.id
      );

    if (!attendance) {
      return res.status(404).json({
        success: false,

        message:
          "Attendance not found",
      });
    }

    return res.json({
      success: true,

      message:
        "Attendance deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete Attendance Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

  createAttendance,

  getAttendances,

  getAttendanceByDate,

  getSiteAttendance,

  updateAttendance,

  deleteAttendance,

};