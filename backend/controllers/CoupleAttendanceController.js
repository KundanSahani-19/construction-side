const CoupleAttendance = require("../models/CoupleAttendance");
const Couple = require("../models/Couple");


// =========================
// CREATE ATTENDANCE
// =========================

const createCoupleAttendance = async (req, res) => {
  try {

    const {
      couple,
      site,
      date,
      member1,
      member2,
      notes,
    } = req.body;


    const coupleData =
      await Couple.findById(couple);

    if (!coupleData) {

      return res.status(404).json({
        success: false,
        message: "Couple not found",
      });

    }


    const member1Amount =
      Number(member1?.amount || 0);

    const member1Overtime =
      Number(member1?.overtimeAmount || 0);

    const member2Amount =
      Number(member2?.amount || 0);

    const member2Overtime =
      Number(member2?.overtimeAmount || 0);


    const totalAmount =
      member1Amount +
      member1Overtime +
      member2Amount +
      member2Overtime;


    const attendance =
      await CoupleAttendance.create({

        couple,

        site,

        date,

        member1: {
          status:
            member1?.status || "Absent",

          amount:
            member1Amount,

          overtimeHours:
            Number(
              member1?.overtimeHours || 0
            ),

          overtimeAmount:
            member1Overtime,

          notes:
            member1?.notes || "",
        },

        member2: {
          status:
            member2?.status || "Absent",

          amount:
            member2Amount,

          overtimeHours:
            Number(
              member2?.overtimeHours || 0
            ),

          overtimeAmount:
            member2Overtime,

          notes:
            member2?.notes || "",
        },

        totalAmount,

        notes:
          notes || "",
      });


    const result =
      await CoupleAttendance
        .findById(attendance._id)
        .populate(
          "couple",
          "coupleName member1 member2 paymentType"
        )
        .populate(
          "site",
          "siteName location"
        );


    res.status(201).json({
      success: true,
      message:
        "Couple attendance saved successfully",
      data: result,
    });

  } catch (error) {

    if (error.code === 11000) {

      return res.status(400).json({
        success: false,
        message:
          "Is couple ki is date ki attendance already added hai.",
      });

    }

    console.error(
      "Create couple attendance error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// GET ALL ATTENDANCE
// =========================

const getCoupleAttendances = async (req, res) => {
  try {

    const attendance =
      await CoupleAttendance
        .find()
        .populate(
          "couple",
          "coupleName member1 member2 paymentType"
        )
        .populate(
          "site",
          "siteName location"
        )
        .sort({
          date: -1,
          createdAt: -1,
        });


    res.json({
      success: true,
      count: attendance.length,
      data: attendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// GET BY ID
// =========================

const getCoupleAttendanceById = async (req, res) => {
  try {

    const attendance =
      await CoupleAttendance
        .findById(req.params.id)
        .populate(
          "couple",
          "coupleName member1 member2 paymentType"
        )
        .populate(
          "site",
          "siteName location"
        );


    if (!attendance) {

      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });

    }


    res.json({
      success: true,
      data: attendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// GET BY COUPLE
// =========================

const getAttendanceByCouple = async (req, res) => {
  try {

    const attendance =
      await CoupleAttendance
        .find({
          couple: req.params.coupleId,
        })
        .populate(
          "couple",
          "coupleName member1 member2 paymentType"
        )
        .populate(
          "site",
          "siteName location"
        )
        .sort({
          date: -1,
        });


    res.json({
      success: true,
      count: attendance.length,
      data: attendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// UPDATE ATTENDANCE
// =========================

const updateCoupleAttendance = async (req, res) => {
  try {

    const {
      date,
      site,
      member1,
      member2,
      notes,
    } = req.body;


    const member1Amount =
      Number(member1?.amount || 0);

    const member1Overtime =
      Number(member1?.overtimeAmount || 0);

    const member2Amount =
      Number(member2?.amount || 0);

    const member2Overtime =
      Number(member2?.overtimeAmount || 0);


    const totalAmount =
      member1Amount +
      member1Overtime +
      member2Amount +
      member2Overtime;


    const attendance =
      await CoupleAttendance.findByIdAndUpdate(
        req.params.id,
        {
          date,
          site,

          member1: {
            status:
              member1?.status || "Absent",

            amount:
              member1Amount,

            overtimeHours:
              Number(
                member1?.overtimeHours || 0
              ),

            overtimeAmount:
              member1Overtime,

            notes:
              member1?.notes || "",
          },

          member2: {
            status:
              member2?.status || "Absent",

            amount:
              member2Amount,

            overtimeHours:
              Number(
                member2?.overtimeHours || 0
              ),

            overtimeAmount:
              member2Overtime,

            notes:
              member2?.notes || "",
          },

          totalAmount,

          notes:
            notes || "",
        },
        {
          new: true,
          runValidators: true,
        }
      );


    if (!attendance) {

      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });

    }


    const result =
      await CoupleAttendance
        .findById(attendance._id)
        .populate(
          "couple",
          "coupleName member1 member2 paymentType"
        )
        .populate(
          "site",
          "siteName location"
        );


    res.json({
      success: true,
      message:
        "Attendance updated successfully",
      data: result,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// DELETE ATTENDANCE
// =========================

const deleteCoupleAttendance = async (req, res) => {
  try {

    const attendance =
      await CoupleAttendance.findByIdAndDelete(
        req.params.id
      );


    if (!attendance) {

      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });

    }


    res.json({
      success: true,
      message:
        "Attendance deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


module.exports = {

  createCoupleAttendance,

  getCoupleAttendances,

  getCoupleAttendanceById,

  getAttendanceByCouple,

  updateCoupleAttendance,

  deleteCoupleAttendance,

};