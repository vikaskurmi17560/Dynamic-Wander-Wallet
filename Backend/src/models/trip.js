const mongoose = require("mongoose");
const tripSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tripName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    source: {
      name: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    destination: {
      name: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    checkpoints: [{
      name: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      visited: { type: Boolean, default: false }
    }],
    budget: {
      total: { type: Number, required: true },
      spent: { type: Number, default: 0 },
      remaining: { type: Number, default: function () { return this.budget.total - this.budget.spent; } }
    },
    transportMode: { type: String, enum: ['car', 'bike', 'public'], default: 'car' },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Trip', tripSchema);
  