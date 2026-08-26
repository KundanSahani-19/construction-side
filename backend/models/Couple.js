const mongoose = require("mongoose");

const coupleSchema = new mongoose.Schema(
  {
    coupleName: {
      type: String,
      required: true,
      trim: true,
    },

    member1: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      mobile: {
        type: String,
        trim: true,
      },

      dailyRate: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    member2: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      mobile: {
        type: String,
        trim: true,
      },

      dailyRate: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    currentSite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      default: null,
    },

    paymentType: {
      type: String,
      enum: ["Daily", "Monthly", "Piece Rate"],
      default: "Daily",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    joiningDate: {
      type: Date,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Couple", coupleSchema);