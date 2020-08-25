const mongoose = require('mongoose');
const { EVENT_MODEL_NAME, USER_MODEL_NAME } = require('./constants');

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
  date: {
    type: Date,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_MODEL_NAME,
  },
});

module.exports = mongoose.Model(EVENT_MODEL_NAME, eventSchema);
