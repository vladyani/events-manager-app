const mongoose = require('mongoose');
const config = require('../config');

const bookingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: config.EVENT_MODEL_NAME,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: config.USER_MODEL_NAME,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(config.BOOKING_MODEL_NAME, bookingSchema);
