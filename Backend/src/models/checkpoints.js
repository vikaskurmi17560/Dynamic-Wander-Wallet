const mongoose = require("mongoose");

const CheckPointsSchema = new mongoose.Schema(
    {
        trip_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true,
        },
        destination: {
            name: { type: String, required: true },
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
        },
        source: {
            name: { type: String, required: true },
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "No description provided.",
        },
        transport_budget:
            [{
                category: {
                    type: String,
                    required: true,
                },

                transport_type: {
                    type: String,
                    required: true,
                },
                transport_price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                extra_info: {
                    type: String,
                    trim: true,
                    default: "",
                },
            }],
        hotel_Budget: {
            type: Number,
            required: false
        },
        restaurant_Budget: {
            type: Number,
            required: false,
        },
        Total_checkpointBudget: {
            type: Number,
            required: false
        },

        Earnbadge_point: {
            type: Number,
            required: false,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Checkpoints", CheckPointsSchema);
