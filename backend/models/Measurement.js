const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },

    workType: {
      type: String,
      enum: [
        "Plaster",
        "Brick Work",
        "Concrete",
        "Flooring",
        "Painting",
        "Tiles",
        "Shuttering",
        "Excavation",
        "Other",
      ],
      required: true,
    },

    length: {
      type: Number,
      default: 0,
      min: 0,
    },

    width: {
      type: Number,
      default: 0,
      min: 0,
    },

    height: {
      type: Number,
      default: 0,
      min: 0,
    },

    unit: {
      type: String,
      enum: [
        "sq.ft",
        "sq.m",
        "cu.ft",
        "cu.m",
        "running.ft",
        "piece",
      ],
      default: "sq.ft",
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    rate: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    measurementDate: {
      type: Date,
      default: Date.now,
    },

    photoUrl: {
      type: String,
      default: "",
    },

    aiAnalysis: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Calculated",
        "Completed",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Measurement",
  measurementSchema
);