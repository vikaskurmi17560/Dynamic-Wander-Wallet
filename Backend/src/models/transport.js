const mongoose = require("mongoose");
const trackingSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    currentLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    lastUpdated: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Tracking', trackingSchema);
  