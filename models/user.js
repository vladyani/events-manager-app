const mongoose = require('mongoose');
const config = require('../config');

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
      ref: config.EVENT_MODEL_NAME,
    },
  ],
});

module.exports = mongoose.model(config.USER_MODEL_NAME, userSchema);
