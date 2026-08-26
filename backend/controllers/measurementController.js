const mongoose = require("mongoose");
const Measurement = require("../models/Measurement");


// ======================================================
// HELPER - CALCULATE QUANTITY
// ======================================================

const calculateQuantity = (
  length = 0,
  width = 0,
  height = 0,
  unit = "sq.ft"
) => {

  const l = Number(length) || 0;
  const w = Number(width) || 0;
  const h = Number(height) || 0;

  switch (unit) {

    case "sq.ft":
    case "sq.m":
      return l * w;

    case "cu.ft":
    case "cu.m":
      return l * w * h;

    case "running.ft":
      return l;

    case "piece":
      return l;

    default:
      return 0;
  }
};


// ======================================================
// CREATE
// ======================================================

const createMeasurement = async (req, res) => {

  try {

    const {
      site,
      workType,
      length,
      width,
      height,
      unit,
      rate,
      measurementDate,
      photoUrl,
      aiAnalysis,
      notes,
      status,
    } = req.body;


    if (!site) {

      return res.status(400).json({
        success: false,
        message: "Construction site is required",
      });

    }


    if (!workType) {

      return res.status(400).json({
        success: false,
        message: "Work type is required",
      });

    }


    if (
      !mongoose.Types.ObjectId.isValid(site)
    ) {

      return res.status(400).json({
        success: false,
        message: "Invalid site ID",
      });

    }


    const l = Number(length) || 0;
    const w = Number(width) || 0;
    const h = Number(height) || 0;
    const r = Number(rate) || 0;


    const quantity = calculateQuantity(
      l,
      w,
      h,
      unit
    );


    const totalAmount =
      quantity * r;


    const measurement =
      await Measurement.create({

        site,

        workType,

        length: l,

        width: w,

        height: h,

        unit: unit || "sq.ft",

        quantity: Number(
          quantity.toFixed(2)
        ),

        rate: r,

        totalAmount: Number(
          totalAmount.toFixed(2)
        ),

        measurementDate:
          measurementDate || new Date(),

        photoUrl:
          photoUrl || "",

        aiAnalysis:
          aiAnalysis || "",

        notes:
          notes || "",

        status:
          status || "Calculated",
      });


    const result =
      await Measurement.findById(
        measurement._id
      ).populate(
        "site",
        "siteName location pendingAmount"
      );


    return res.status(201).json({

      success: true,

      message:
        "Measurement saved successfully",

      data: result,

    });

  } catch (error) {

    console.error(
      "Create measurement error:",
      error
    );

    return res.status(400).json({

      success: false,

      message:
        error.message,

    });

  }
};


// ======================================================
// GET ALL
// ======================================================

const getMeasurements = async (
  req,
  res
) => {

  try {

    const measurements =
      await Measurement.find()

        .populate(
          "site",
          "siteName location pendingAmount"
        )

        .sort({
          measurementDate: -1,
          createdAt: -1,
        });


    return res.json({

      success: true,

      count:
        measurements.length,

      data:
        measurements,

    });

  } catch (error) {

    console.error(
      "Get measurements error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }
};


// ======================================================
// GET ONE
// ======================================================

const getMeasurementById =
  async (req, res) => {

    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {

        return res.status(400).json({
          success: false,
          message: "Invalid measurement ID",
        });

      }


      const measurement =
        await Measurement.findById(
          req.params.id
        ).populate(
          "site",
          "siteName location pendingAmount"
        );


      if (!measurement) {

        return res.status(404).json({

          success: false,

          message:
            "Measurement not found",

        });

      }


      return res.json({

        success: true,

        data:
          measurement,

      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }
  };


// ======================================================
// GET SITE MEASUREMENTS
// ======================================================

const getSiteMeasurements =
  async (req, res) => {

    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.siteId
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid site ID",

        });

      }


      const measurements =
        await Measurement.find({

          site:
            req.params.siteId,

        })

          .populate(
            "site",
            "siteName location pendingAmount"
          )

          .sort({
            measurementDate: -1,
            createdAt: -1,
          });


      return res.json({

        success: true,

        count:
          measurements.length,

        data:
          measurements,

      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }
  };


// ======================================================
// UPDATE
// ======================================================

const updateMeasurement =
  async (req, res) => {

    try {

      const {
        site,
        workType,
        length,
        width,
        height,
        unit,
        rate,
        measurementDate,
        photoUrl,
        aiAnalysis,
        notes,
        status,
      } = req.body;


      const measurement =
        await Measurement.findById(
          req.params.id
        );


      if (!measurement) {

        return res.status(404).json({

          success: false,

          message:
            "Measurement not found",

        });

      }


      const selectedUnit =
        unit || measurement.unit;


      const l =
        Number(
          length ??
          measurement.length ??
          0
        );


      const w =
        Number(
          width ??
          measurement.width ??
          0
        );


      const h =
        Number(
          height ??
          measurement.height ??
          0
        );


      const r =
        Number(
          rate ??
          measurement.rate ??
          0
        );


      const quantity =
        calculateQuantity(
          l,
          w,
          h,
          selectedUnit
        );


      const totalAmount =
        quantity * r;


      if (site !== undefined) {
        measurement.site = site;
      }


      if (workType !== undefined) {
        measurement.workType =
          workType;
      }


      measurement.length = l;

      measurement.width = w;

      measurement.height = h;

      measurement.unit =
        selectedUnit;

      measurement.quantity =
        Number(
          quantity.toFixed(2)
        );

      measurement.rate = r;

      measurement.totalAmount =
        Number(
          totalAmount.toFixed(2)
        );


      if (
        measurementDate !==
        undefined
      ) {

        measurement.measurementDate =
          measurementDate;

      }


      if (
        photoUrl !==
        undefined
      ) {

        measurement.photoUrl =
          photoUrl;

      }


      if (
        aiAnalysis !==
        undefined
      ) {

        measurement.aiAnalysis =
          aiAnalysis;

      }


      if (
        notes !==
        undefined
      ) {

        measurement.notes =
          notes;

      }


      if (
        status !==
        undefined
      ) {

        measurement.status =
          status;

      }


      await measurement.save();


      const result =
        await Measurement.findById(
          measurement._id
        ).populate(
          "site",
          "siteName location pendingAmount"
        );


      return res.json({

        success: true,

        message:
          "Measurement updated successfully",

        data:
          result,

      });

    } catch (error) {

      console.error(
        "Update measurement error:",
        error
      );

      return res.status(400).json({

        success: false,

        message:
          error.message,

      });

    }
  };


// ======================================================
// DELETE
// ======================================================

const deleteMeasurement =
  async (req, res) => {

    try {

      const measurement =
        await Measurement.findByIdAndDelete(
          req.params.id
        );


      if (!measurement) {

        return res.status(404).json({

          success: false,

          message:
            "Measurement not found",

        });

      }


      return res.json({

        success: true,

        message:
          "Measurement deleted successfully",

      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }
  };


module.exports = {

  createMeasurement,

  getMeasurements,

  getMeasurementById,

  getSiteMeasurements,

  updateMeasurement,

  deleteMeasurement,

};