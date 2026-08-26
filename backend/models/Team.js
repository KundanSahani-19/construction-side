const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      trim: true,
    },

    teamType: {
      type: String,
      enum: [
        "Plaster",
        "Civil",
        "Masonry",
        "Painting",
        "General",
        "Other",
      ],
      default: "General",
    },

    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },

    members: [
      {
        labour: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Labour",
          required: true,
        },

        role: {
          type: String,
          enum: [
            "Mistri",
            "Helper",
            "Plaster Labour",
            "Ladies Helper",
            "Couple / Jodi",
            "Other",
          ],
          required: true,
        },

        isLeader: {
          type: Boolean,
          default: false,
        },
      },
    ],

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
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

module.exports = mongoose.model("Team", teamSchema);