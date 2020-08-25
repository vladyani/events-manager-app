const mongoose = require('mongoose');
const { USER_MODEL_NAME, EVENT_MODEL_NAME } = require('./constants');

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
      ref: EVENT_MODEL_NAME,
    },
  ],
});

module.exports = mongoose.Model(USER_MODEL_NAME, userSchema);
