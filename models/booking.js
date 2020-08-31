const mongoose = require('mongoose');
const constants = require('./constants');

const bookingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: constants.EVENT_MODEL_NAME,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: constants.USER_MODEL_NAME,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(constants.BOOKING_MODEL_NAME, bookingSchema);
