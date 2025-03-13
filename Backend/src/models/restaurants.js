const mongoose = require("mongoose");
const RestaurantsSchema = new mongoose.Schema({
    trip_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },
    checkpoint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Checkpoints",
        required: true
    },
    name: { type: String, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    rating: { type: Number, default: 3.0 },
    // meal_type: { type: String, enum: ['BreakFast', 'Brunch', 'Lunch', 'Snacks', 'Dinner', 'Post-Dinner'], required: true },
    prices: [{
        meal_type: { type: String, enum: ['BreakFast', 'Brunch', 'Lunch', 'Snacks', 'Dinner', 'Post-Dinner'], required: true },
        meal_price: { type: Number, required: true }
    }],
    contact: { type: String }

})

module.exports = mongoose.model("Restaurants", RestaurantsSchema);