const mongoose = require('mongoose');
const config = require('../config');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: config.USER_MODEL_NAME,
  },
});

module.exports = mongoose.model(config.EVENT_MODEL_NAME, eventSchema);
