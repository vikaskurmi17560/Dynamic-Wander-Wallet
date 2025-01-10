const mongoose = require("mongoose");
const budgetSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    budgetDetails: [{
      category: { type: String, enum: ['transport', 'hotel', 'food'], required: true },
      amount: { type: Number, required: true },
      description: { type: String }
    }],
    totalBudget: { type: Number, required: true },
    totalSpent: { type: Number, default: 0 },
    remainingBudget: { type: Number, default: function () { return this.totalBudget - this.totalSpent; } }
  });
  
  module.exports = mongoose.model('Budget', budgetSchema);
  