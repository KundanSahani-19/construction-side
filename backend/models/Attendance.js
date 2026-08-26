const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    labour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Labour",
      required: true,
    },

    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    attendanceDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Half Day", "Absent", "Leave"],
      required: true,
      default: "Present",
    },

    // 1 = full day, 0.5 = half day, 0 = absent/leave
    dayValue: {
      type: Number,
      enum: [0, 0.5, 1],
      default: 1,
    },

    overtimeHours: {
      type: Number,
      default: 0,
      min: 0,
    },

    overtimeAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Couple/Jodi ke liye
    attendanceUnit: {
      type: String,
      enum: ["Individual", "Couple Together"],
      default: "Individual",
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

// Same labour ko same site par same date me duplicate attendance
// se bachane ke liye
attendanceSchema.index(
  {
    labour: 1,
    attendanceDate: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);