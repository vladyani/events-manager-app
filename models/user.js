const mongoose = require('mongoose');
const constants = require('./constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: constants.EVENT_MODEL_NAME,
    },
  ],
});

module.exports = mongoose.model(constants.USER_MODEL_NAME, userSchema);
