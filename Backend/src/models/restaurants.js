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
    restaurant_name: {
        type: String,
        required: true,
    },
    location: {
        name: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    rating: { type: Number, default: 3.0 },
    description: {
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 500,
        default: "No description provided."
    },
    prices: [{
        meal_type: { type: String, required: true },
        meal_price: { type: Number, required: true }
    }],
    contact: { type: String }
}, { timestamps: true })

module.exports = mongoose.model("Restaurants", RestaurantsSchema);