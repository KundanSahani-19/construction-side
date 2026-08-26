const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
      trim: true,
    },

    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    clientMobile: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    workType: {
      type: String,
      trim: true,
    },

    contractAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    startDate: {
      type: Date,
    },

    expectedCompletionDate: {
      type: Date,
    },

    receivedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Running", "Completed", "On Hold"],
      default: "Running",
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

// Pending amount automatically calculate hoga
siteSchema.virtual("pendingAmount").get(function () {
  return Math.max(this.contractAmount - this.receivedAmount, 0);
});

siteSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Site", siteSchema);