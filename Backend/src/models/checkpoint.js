const mongoose = require("mongoose");
const checkpointSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['attraction', 'hotel', 'food'], required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    description: { type: String },
    visited: { type: Boolean, default: false },
    addedBy: { type: String, enum: ['system', 'user'], default: 'system' }
  });
  
  module.exports = mongoose.model('Checkpoint', checkpointSchema);
  