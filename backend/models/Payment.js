const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // Labour jisko payment diya gaya
    labour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Labour",
      default: null,
    },

    // Kis construction site ka payment hai
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },

    // Payment amount
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Payment ki date
    paymentDate: {
      type: Date,
      required: true,
    },

    // Payment kis type ka hai
    paymentType: {
      type: String,
      enum: [
        "Advance",
        "Salary",
        "Wages",
        "Overtime",
        "Final Payment",
        "Other",
      ],
      default: "Advance",
    },

    // Payment ka reason
    reason: {
      type: String,
      trim: true,
      default: "",
    },

    // Payment kaise diya
    paymentMode: {
      type: String,
      enum: [
        "Cash",
        "Bank Transfer",
        "UPI",
        "Cheque",
        "Other",
      ],
      default: "Cash",
    },

    // Reference number agar ho
    referenceNumber: {
      type: String,
      trim: true,
      default: "",
    },

    // Extra notes
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);