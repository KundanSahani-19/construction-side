const LabourAdvance = require("../models/LabourAdvance");
const Labour = require("../models/Labour");

// ==========================================
// CREATE LABOUR ADVANCE
// ==========================================

const createLabourAdvance = async (req, res) => {
  try {
    const {
      labour,
      site,
      amount,
      advanceDate,
      paymentMode,
      referenceNumber,
      reason,
      notes,
      status,
    } = req.body;

    if (!labour) {
      return res.status(400).json({
        success: false,
        message: "Labour select karna required hai.",
      });
    }

    if (
      amount === undefined ||
      amount === null ||
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Advance amount valid hona chahiye.",
      });
    }

    const labourData = await Labour.findById(labour);

    if (!labourData) {
      return res.status(404).json({
        success: false,
        message: "Labour not found.",
      });
    }

    const advance = await LabourAdvance.create({
      labour,
      site: site || null,
      amount: Number(amount),
      advanceDate: advanceDate || new Date(),
      paymentMode: paymentMode || "Cash",
      referenceNumber: referenceNumber || "",
      reason: reason || "",
      notes: notes || "",
      status: status || "Paid",
    });

    const result = await LabourAdvance.findById(
      advance._id
    )
      .populate(
        "labour",
        "name mobile labourType dailyRate overtimeRate memberCount"
      )
      .populate(
        "site",
        "siteName location"
      );

    res.status(201).json({
      success: true,
      message: "Labour advance added successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Create Labour Advance Error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL LABOUR ADVANCES
// ==========================================

const getLabourAdvances = async (req, res) => {
  try {
    const advances = await LabourAdvance.find()
      .populate(
        "labour",
        "name mobile labourType dailyRate overtimeRate memberCount"
      )
      .populate(
        "site",
        "siteName location"
      )
      .sort({
        advanceDate: -1,
        createdAt: -1,
      });

    res.json({
      success: true,
      count: advances.length,
      data: advances,
    });
  } catch (error) {
    console.error(
      "Get Labour Advances Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ADVANCE BY ID
// ==========================================

const getLabourAdvanceById = async (
  req,
  res
) => {
  try {
    const advance =
      await LabourAdvance.findById(
        req.params.id
      )
        .populate(
          "labour",
          "name mobile labourType dailyRate overtimeRate memberCount"
        )
        .populate(
          "site",
          "siteName location"
        );

    if (!advance) {
      return res.status(404).json({
        success: false,
        message: "Labour advance not found.",
      });
    }

    res.json({
      success: true,
      data: advance,
    });
  } catch (error) {
    console.error(
      "Get Labour Advance Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ADVANCES BY LABOUR
// ==========================================

const getLabourAdvancesByLabour = async (
  req,
  res
) => {
  try {
    const { labourId } = req.params;

    const labour =
      await Labour.findById(labourId);

    if (!labour) {
      return res.status(404).json({
        success: false,
        message: "Labour not found.",
      });
    }

    const advances =
      await LabourAdvance.find({
        labour: labourId,
      })
        .populate(
          "labour",
          "name mobile labourType dailyRate overtimeRate memberCount"
        )
        .populate(
          "site",
          "siteName location"
        )
        .sort({
          advanceDate: -1,
          createdAt: -1,
        });

    const totalAdvance =
      advances.reduce(
        (total, item) =>
          total + Number(item.amount || 0),
        0
      );

    res.json({
      success: true,
      count: advances.length,
      totalAdvance,
      data: advances,
    });
  } catch (error) {
    console.error(
      "Get Labour Advances By Labour Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ADVANCES BY SITE
// ==========================================

const getLabourAdvancesBySite = async (
  req,
  res
) => {
  try {
    const { siteId } = req.params;

    const advances =
      await LabourAdvance.find({
        site: siteId,
      })
        .populate(
          "labour",
          "name mobile labourType dailyRate overtimeRate memberCount"
        )
        .populate(
          "site",
          "siteName location"
        )
        .sort({
          advanceDate: -1,
        });

    const totalAdvance =
      advances.reduce(
        (total, item) =>
          total + Number(item.amount || 0),
        0
      );

    res.json({
      success: true,
      count: advances.length,
      totalAdvance,
      data: advances,
    });
  } catch (error) {
    console.error(
      "Get Labour Advances By Site Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE LABOUR ADVANCE
// ==========================================

const updateLabourAdvance = async (
  req,
  res
) => {
  try {
    const existing =
      await LabourAdvance.findById(
        req.params.id
      );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Labour advance not found.",
      });
    }

    const {
      labour,
      site,
      amount,
      advanceDate,
      paymentMode,
      referenceNumber,
      reason,
      notes,
      status,
    } = req.body;

    if (
      amount !== undefined &&
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Advance amount valid hona chahiye.",
      });
    }

    if (labour) {
      const labourData =
        await Labour.findById(labour);

      if (!labourData) {
        return res.status(404).json({
          success: false,
          message: "Labour not found.",
        });
      }

      existing.labour = labour;
    }

    if (site !== undefined) {
      existing.site = site || null;
    }

    if (amount !== undefined) {
      existing.amount = Number(amount);
    }

    if (advanceDate !== undefined) {
      existing.advanceDate = advanceDate;
    }

    if (paymentMode !== undefined) {
      existing.paymentMode = paymentMode;
    }

    if (referenceNumber !== undefined) {
      existing.referenceNumber =
        referenceNumber;
    }

    if (reason !== undefined) {
      existing.reason = reason;
    }

    if (notes !== undefined) {
      existing.notes = notes;
    }

    if (status !== undefined) {
      existing.status = status;
    }

    await existing.save();

    const result =
      await LabourAdvance.findById(
        existing._id
      )
        .populate(
          "labour",
          "name mobile labourType dailyRate overtimeRate memberCount"
        )
        .populate(
          "site",
          "siteName location"
        );

    res.json({
      success: true,
      message:
        "Labour advance updated successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Update Labour Advance Error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE LABOUR ADVANCE
// ==========================================

const deleteLabourAdvance = async (
  req,
  res
) => {
  try {
    const advance =
      await LabourAdvance.findByIdAndDelete(
        req.params.id
      );

    if (!advance) {
      return res.status(404).json({
        success: false,
        message: "Labour advance not found.",
      });
    }

    res.json({
      success: true,
      message:
        "Labour advance deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Labour Advance Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createLabourAdvance,
  getLabourAdvances,
  getLabourAdvanceById,
  getLabourAdvancesByLabour,
  getLabourAdvancesBySite,
  updateLabourAdvance,
  deleteLabourAdvance,
};