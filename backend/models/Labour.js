const mongoose = require("mongoose");

const labourMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    mobile: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: [
        "Mistri",
        "Plaster Labour",
        "Helper",
        "Ladies Helper",
        "Other",
      ],
      default: "Other",
    },
  },
  {
    _id: true,
  }
);

const labourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      trim: true,
      default: "",
    },

    labourType: {
      type: String,
      enum: [
        "Mistri",
        "Plaster Labour",
        "Helper",
        "Ladies Helper",
        "Couple / Jodi",
        "Other",
      ],
      required: true,
    },

    memberCount: {
      type: Number,
      default: 1,
      min: 1,
    },

    members: {
      type: [labourMemberSchema],
      default: [],
    },

    dailyRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    overtimeRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentType: {
      type: String,
      enum: ["Daily", "Monthly", "Piece Rate"],
      default: "Daily",
    },

    currentSite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    joiningDate: {
      type: Date,
      default: null,
    },

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

labourSchema.pre("validate", function (next) {
  if (this.labourType === "Couple / Jodi") {
    this.memberCount = 2;

    if (!Array.isArray(this.members) || this.members.length !== 2) {
      return next(
        new Error("Couple / Jodi ke liye exactly 2 members required hain.")
      );
    }
  } else {
    this.memberCount = 1;
    this.members = [];
  }

  next();
});

module.exports = mongoose.model("Labour", labourSchema);