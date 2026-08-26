const Labour = require("../models/Labour");

const populateLabour = (query) =>
  query.populate("currentSite", "siteName location");

const normalizeLabourData = (body) => {
  const data = { ...body };

  if (data.labourType === "Couple / Jodi") {
    data.memberCount = 2;

    if (!Array.isArray(data.members) || data.members.length !== 2) {
      throw new Error(
        "Couple / Jodi ke liye 2 members ki details required hain."
      );
    }
  } else {
    data.memberCount = 1;
    data.members = [];
  }

  if (data.dailyRate !== undefined) data.dailyRate = Number(data.dailyRate) || 0;
  if (data.overtimeRate !== undefined) {
    data.overtimeRate = Number(data.overtimeRate) || 0;
  }

  return data;
};

const createLabour = async (req, res) => {
  try {
    const data = normalizeLabourData(req.body);
    const labour = await Labour.create(data);
    const result = await populateLabour(Labour.findById(labour._id));

    res.status(201).json({
      success: true,
      message: "Labour added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create Labour Error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getLabours = async (req, res) => {
  try {
    const labours = await populateLabour(
      Labour.find().sort({ createdAt: -1 })
    );

    res.json({
      success: true,
      count: labours.length,
      data: labours,
    });
  } catch (error) {
    console.error("Get Labours Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLabourById = async (req, res) => {
  try {
    const labour = await populateLabour(
      Labour.findById(req.params.id)
    );

    if (!labour) {
      return res.status(404).json({
        success: false,
        message: "Labour not found",
      });
    }

    res.json({
      success: true,
      data: labour,
    });
  } catch (error) {
    console.error("Get Labour Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateLabour = async (req, res) => {
  try {
    const data = normalizeLabourData(req.body);

    const labour = await populateLabour(
      Labour.findByIdAndUpdate(
        req.params.id,
        data,
        {
          new: true,
          runValidators: true,
        }
      )
    );

    if (!labour) {
      return res.status(404).json({
        success: false,
        message: "Labour not found",
      });
    }

    res.json({
      success: true,
      message: "Labour updated successfully",
      data: labour,
    });
  } catch (error) {
    console.error("Update Labour Error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteLabour = async (req, res) => {
  try {
    const labour = await Labour.findByIdAndDelete(req.params.id);

    if (!labour) {
      return res.status(404).json({
        success: false,
        message: "Labour not found",
      });
    }

    res.json({
      success: true,
      message: "Labour deleted successfully",
    });
  } catch (error) {
    console.error("Delete Labour Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createLabour,
  getLabours,
  getLabourById,
  updateLabour,
  deleteLabour,
};