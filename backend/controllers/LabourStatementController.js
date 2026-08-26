const Labour = require("../models/Labour");
const Attendance = require("../models/Attendance");
const LabourAdvance = require("../models/LabourAdvance");

// ==========================================
// GET COMPLETE LABOUR STATEMENT
// ==========================================

const getLabourStatement = async (
  req,
  res
) => {
  try {
    const { labourId } = req.params;

    // ------------------------------------------
    // LABOUR
    // ------------------------------------------

    const labour =
      await Labour.findById(labourId)
        .populate(
          "currentSite",
          "siteName location"
        );

    if (!labour) {
      return res.status(404).json({
        success: false,
        message: "Labour not found.",
      });
    }

    // ------------------------------------------
    // OPTIONAL DATE FILTER
    // ------------------------------------------

    const {
      fromDate,
      toDate,
    } = req.query;

    const attendanceFilter = {
      labour: labourId,
    };

    const advanceFilter = {
      labour: labourId,
    };

    if (fromDate || toDate) {
      if (fromDate && toDate) {
        const start = new Date(fromDate);
        const end = new Date(toDate);

        end.setHours(
          23,
          59,
          59,
          999
        );

        attendanceFilter.attendanceDate = {
          $gte: start,
          $lte: end,
        };

        advanceFilter.advanceDate = {
          $gte: start,
          $lte: end,
        };
      } else if (fromDate) {
        const start = new Date(fromDate);

        attendanceFilter.attendanceDate = {
          $gte: start,
        };

        advanceFilter.advanceDate = {
          $gte: start,
        };
      } else if (toDate) {
        const end = new Date(toDate);

        end.setHours(
          23,
          59,
          59,
          999
        );

        attendanceFilter.attendanceDate = {
          $lte: end,
        };

        advanceFilter.advanceDate = {
          $lte: end,
        };
      }
    }

    // ------------------------------------------
    // ATTENDANCE
    // ------------------------------------------

    const attendance =
      await Attendance.find(
        attendanceFilter
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
          attendanceDate: 1,
        });

    // ------------------------------------------
    // ADVANCES
    // ------------------------------------------

    const advances =
      await LabourAdvance.find(
        advanceFilter
      )
        .populate(
          "site",
          "siteName location"
        )
        .sort({
          advanceDate: 1,
        });

    // ------------------------------------------
    // CALCULATE ATTENDANCE
    // ------------------------------------------

    let totalDays = 0;
    let presentDays = 0;
    let halfDays = 0;
    let absentDays = 0;
    let leaveDays = 0;

    let regularEarning = 0;
    let overtimeHours = 0;
    let overtimeAmount = 0;

    const attendanceDetails =
      attendance.map(
        (record) => {
          const dayValue =
            Number(
              record.dayValue || 0
            );

          const dailyRate =
            Number(
              labour.dailyRate || 0
            );

          const dayAmount =
            dayValue * dailyRate;

          const otHours =
            Number(
              record.overtimeHours || 0
            );

          const otAmount =
            Number(
              record.overtimeAmount || 0
            );

          totalDays += dayValue;

          if (
            record.status ===
            "Present"
          ) {
            presentDays++;
          }

          if (
            record.status ===
            "Half Day"
          ) {
            halfDays++;
          }

          if (
            record.status ===
            "Absent"
          ) {
            absentDays++;
          }

          if (
            record.status ===
            "Leave"
          ) {
            leaveDays++;
          }

          regularEarning += dayAmount;

          overtimeHours += otHours;

          overtimeAmount += otAmount;

          return {
            _id: record._id,

            date:
              record.attendanceDate,

            status:
              record.status,

            dayValue,

            dailyRate,

            dayAmount,

            overtimeHours:
              otHours,

            overtimeAmount:
              otAmount,

            totalAmount:
              dayAmount +
              otAmount,

            site:
              record.site || null,

            team:
              record.team || null,

            attendanceUnit:
              record.attendanceUnit,

            notes:
              record.notes || "",
          };
        }
      );

    // ------------------------------------------
    // ADVANCE CALCULATION
    // ------------------------------------------

    let totalAdvance = 0;

    const advanceDetails =
      advances.map(
        (advance) => {
          const amount =
            Number(
              advance.amount || 0
            );

          if (
            advance.status !==
            "Cancelled"
          ) {
            totalAdvance += amount;
          }

          return {
            _id: advance._id,

            date:
              advance.advanceDate,

            amount,

            paymentMode:
              advance.paymentMode,

            referenceNumber:
              advance.referenceNumber,

            reason:
              advance.reason,

            notes:
              advance.notes,

            status:
              advance.status,

            site:
              advance.site || null,
          };
        }
      );

    // ------------------------------------------
    // TOTAL EARNING
    // ------------------------------------------

    const totalEarning =
      regularEarning +
      overtimeAmount;

    // ------------------------------------------
    // BALANCE
    // ------------------------------------------

    const balance =
      totalEarning -
      totalAdvance;

    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    res.json({
      success: true,

      data: {
        labour: {
          _id: labour._id,
          name: labour.name,
          mobile: labour.mobile,
          labourType:
            labour.labourType,
          memberCount:
            labour.memberCount,
          dailyRate:
            Number(
              labour.dailyRate || 0
            ),
          overtimeRate:
            Number(
              labour.overtimeRate || 0
            ),
          paymentType:
            labour.paymentType,
          status:
            labour.status,
          joiningDate:
            labour.joiningDate,
          currentSite:
            labour.currentSite || null,
        },

        summary: {
          totalAttendanceDays:
            totalDays,

          presentDays,

          halfDays,

          absentDays,

          leaveDays,

          regularEarning,

          overtimeHours,

          overtimeAmount,

          totalEarning,

          totalAdvance,

          balance,
        },

        attendance:
          attendanceDetails,

        advances:
          advanceDetails,
      },
    });
  } catch (error) {
    console.error(
      "Get Labour Statement Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET LABOUR SUMMARY ONLY
// ==========================================

const getLabourStatementSummary =
  async (req, res) => {
    try {
      const { labourId } =
        req.params;

      const labour =
        await Labour.findById(
          labourId
        );

      if (!labour) {
        return res.status(404).json({
          success: false,
          message:
            "Labour not found.",
        });
      }

      const attendance =
        await Attendance.find({
          labour: labourId,
        });

      const advances =
        await LabourAdvance.find({
          labour: labourId,
          status: {
            $ne: "Cancelled",
          },
        });

      let totalDays = 0;
      let totalOvertime = 0;

      attendance.forEach(
        (record) => {
          totalDays += Number(
            record.dayValue || 0
          );

          totalOvertime += Number(
            record.overtimeAmount || 0
          );
        }
      );

      const regularEarning =
        totalDays *
        Number(
          labour.dailyRate || 0
        );

      const totalEarning =
        regularEarning +
        totalOvertime;

      const totalAdvance =
        advances.reduce(
          (total, advance) =>
            total +
            Number(
              advance.amount || 0
            ),
          0
        );

      const balance =
        totalEarning -
        totalAdvance;

      res.json({
        success: true,

        data: {
          labour: {
            _id: labour._id,
            name: labour.name,
            mobile: labour.mobile,
            labourType:
              labour.labourType,
          },

          totalDays,

          regularEarning,

          overtimeAmount:
            totalOvertime,

          totalEarning,

          totalAdvance,

          balance,
        },
      });
    } catch (error) {
      console.error(
        "Get Labour Statement Summary Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ==========================================
// SEARCH LABOUR FOR STATEMENT
// ==========================================

const searchLabourForStatement =
  async (req, res) => {
    try {
      const search =
        String(
          req.query.search || ""
        ).trim();

      if (!search) {
        return res.json({
          success: true,
          count: 0,
          data: [],
        });
      }

      const labours =
        await Labour.find({
          $or: [
            {
              name: {
                $regex: search,
                $options: "i",
              },
            },
            {
              mobile: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        })
          .select(
            "name mobile labourType memberCount dailyRate status"
          )
          .sort({
            name: 1,
          })
          .limit(20);

      res.json({
        success: true,
        count: labours.length,
        data: labours,
      });
    } catch (error) {
      console.error(
        "Search Labour Statement Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  getLabourStatement,
  getLabourStatementSummary,
  searchLabourForStatement,
};