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
  numberMembers: {
    type: Number,
    default: 1,
  },
  Earnbadge_point: {
    type: Number,
    default: 0
  },
  rating: [{
    type: Number,
    min: 0,
    max: 5
  }],
  review: [{
    reviewBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    comment: {
      type: String,
      maxlength: 500
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
