const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cover_image: {
    type: String,
    required: false
  },
  image: [{
    type: String,
    required: false
  }],
  tripName: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  TotalBudget: {
    type: Number,
    required: false
  },
  followedby: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  Earnbadge_point: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
