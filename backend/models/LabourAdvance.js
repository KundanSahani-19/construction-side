const mongoose = require("mongoose");

const labourAdvanceSchema = new mongoose.Schema(
  {
    labour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Labour",
      required: true,
    },

    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    advanceDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    paymentMode: {
      type: String,
      enum: [
        "Cash",
        "UPI",
        "Bank Transfer",
        "Cheque",
        "Other",
      ],
      default: "Cash",
    },

    referenceNumber: {
      type: String,
      trim: true,
      default: "",
    },

    reason: {
      type: String,
      trim: true,
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
        "Paid",
        "Pending",
        "Cancelled",
      ],
      default: "Paid",
    },
  },
  {
    timestamps: true,
  }
);

labourAdvanceSchema.index({
  labour: 1,
  advanceDate: -1,
});

labourAdvanceSchema.index({
  site: 1,
  advanceDate: -1,
});

module.exports = mongoose.model(
  "LabourAdvance",
  labourAdvanceSchema
);