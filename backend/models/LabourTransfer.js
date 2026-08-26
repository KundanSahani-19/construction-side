const mongoose = require('mongoose');

const labourTransferSchema = new mongoose.Schema(
  {
    labour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Labour',
      required: true
    },

    fromSite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Site',
      required: true
    },

    toSite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Site',
      required: true
    },

    transferDate: {
      type: Date,
      required: true
    },

    reason: {
      type: String,
      default: ''
    },

    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'LabourTransfer',
  labourTransferSchema
);