const mongoose = require("mongoose");

const coupleAttendanceSchema = new mongoose.Schema(
  {
    couple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Couple",
      required: true,
    },

    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    member1: {
      status: {
        type: String,
        enum: ["Present", "Absent", "Half Day"],
        default: "Absent",
      },

      amount: {
        type: Number,
        default: 0,
        min: 0,
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

      notes: {
        type: String,
        trim: true,
      },
    },

    member2: {
      status: {
        type: String,
        enum: ["Present", "Absent", "Half Day"],
        default: "Absent",
      },

      amount: {
        type: Number,
        default: 0,
        min: 0,
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

      notes: {
        type: String,
        trim: true,
      },
    },

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
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


// Ek couple ki same date par duplicate attendance nahi hogi
coupleAttendanceSchema.index(
  {
    couple: 1,
    date: 1,
  },
  {
    unique: true,
  }
);


module.exports = mongoose.model(
  "CoupleAttendance",
  coupleAttendanceSchema
);