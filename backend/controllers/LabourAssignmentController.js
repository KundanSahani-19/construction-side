const LabourAssignment = require("../models/LabourAssignment");
const Labour = require("../models/Labour");

const assignLabour = async (req, res) => {
  try {
    const { labour, site, startDate, reason } = req.body;

    // Previous active assignment close karo
    await LabourAssignment.updateMany(
      {
        labour,
        status: "Active",
      },
      {
        $set: {
          status: "Completed",
          endDate: startDate,
        },
      }
    );

    const assignment = await LabourAssignment.create({
      labour,
      site,
      startDate,
      reason,
      status: "Active",
    });

    // Labour ka current site update
    await Labour.findByIdAndUpdate(labour, {
      currentSite: site,
    });

    const result = await LabourAssignment.findById(
      assignment._id
    )
      .populate("labour", "name labourType")
      .populate("site", "siteName location");

    res.status(201).json({
      success: true,
      message: "Labour assigned successfully",
      data: result,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const getAssignments = async (req, res) => {
  try {

    const assignments = await LabourAssignment.find()
      .populate("labour", "name labourType")
      .populate("site", "siteName location")
      .sort({ startDate: -1 });

    res.json({
      success: true,
      count: assignments.length,
      data: assignments,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


const getLabourHistory = async (req, res) => {
  try {

    const assignments = await LabourAssignment.find({
      labour: req.params.labourId,
    })
      .populate("site", "siteName location")
      .sort({ startDate: -1 });

    res.json({
      success: true,
      count: assignments.length,
      data: assignments,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


module.exports = {
  assignLabour,
  getAssignments,
  getLabourHistory,
};