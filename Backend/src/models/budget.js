const mongoose = require("mongoose");

const budgetBreakdownSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    budgetDetails: [{
        category: {
            type: String,
            enum: ['transport', 'hotel', 'food'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        description: {
            type: String
        }
    }],
    description: {
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 500,
        default: "No description provided."
    },
    hotelBudgets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel'
    }],
    foodBudgets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurants'
    }],
    transportBudgets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checkpoints'
    }],
    totalBudget: {
        type: Number,
        required: true
    }
},{ timestamps: true });

budgetBreakdownSchema.pre('save', function (next) {
    this.totalBudget = this.budgetDetails.reduce((sum, item) => sum + item.amount, 0);
    next();
});

module.exports = mongoose.model('Budget', budgetBreakdownSchema);
