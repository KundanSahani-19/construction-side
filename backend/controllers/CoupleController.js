const Couple = require("../models/Couple");


// =========================
// CREATE COUPLE
// =========================

const createCouple = async (req, res) => {
  try {

    const data = {
      ...req.body,

      member1: {
        ...req.body.member1,
        dailyRate: Number(
          req.body.member1?.dailyRate || 0
        ),
      },

      member2: {
        ...req.body.member2,
        dailyRate: Number(
          req.body.member2?.dailyRate || 0
        ),
      },
    };

    const couple = await Couple.create(data);

    const populatedCouple =
      await Couple.findById(couple._id)
        .populate(
          "currentSite",
          "siteName location"
        );

    res.status(201).json({
      success: true,
      message: "Couple added successfully",
      data: populatedCouple,
    });

  } catch (error) {

    console.error(
      "Create couple error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// GET ALL COUPLES
// =========================

const getCouples = async (req, res) => {
  try {

    const couples =
      await Couple.find()
        .populate(
          "currentSite",
          "siteName location"
        )
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      count: couples.length,
      data: couples,
    });

  } catch (error) {

    console.error(
      "Get couples error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// GET SINGLE COUPLE
// =========================

const getCoupleById = async (req, res) => {
  try {

    const couple =
      await Couple.findById(
        req.params.id
      ).populate(
        "currentSite",
        "siteName location"
      );

    if (!couple) {

      return res.status(404).json({
        success: false,
        message: "Couple not found",
      });

    }

    res.json({
      success: true,
      data: couple,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// UPDATE COUPLE
// =========================

const updateCouple = async (req, res) => {
  try {

    const data = {
      ...req.body,

      ...(req.body.member1 && {
        member1: {
          ...req.body.member1,
          dailyRate: Number(
            req.body.member1.dailyRate || 0
          ),
        },
      }),

      ...(req.body.member2 && {
        member2: {
          ...req.body.member2,
          dailyRate: Number(
            req.body.member2.dailyRate || 0
          ),
        },
      }),
    };

    const couple =
      await Couple.findByIdAndUpdate(
        req.params.id,
        data,
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "currentSite",
        "siteName location"
      );

    if (!couple) {

      return res.status(404).json({
        success: false,
        message: "Couple not found",
      });

    }

    res.json({
      success: true,
      message: "Couple updated successfully",
      data: couple,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// DELETE COUPLE
// =========================

const deleteCouple = async (req, res) => {
  try {

    const couple =
      await Couple.findByIdAndDelete(
        req.params.id
      );

    if (!couple) {

      return res.status(404).json({
        success: false,
        message: "Couple not found",
      });

    }

    res.json({
      success: true,
      message: "Couple deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


module.exports = {
  createCouple,
  getCouples,
  getCoupleById,
  updateCouple,
  deleteCouple,
};