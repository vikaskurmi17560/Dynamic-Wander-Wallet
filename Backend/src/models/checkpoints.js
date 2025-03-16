const mongoose = require("mongoose");

const CheckPointsSchema = new mongoose.Schema({
    trip_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },
    Destination: {
        name: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    Source: {
        name: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    Transport_Price: [{
        type: Number,
        required: true
    }],
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    time: {
        type: String,
        default: function () {
            return new Date().toLocaleTimeString("en-US", { hour12: false });
        },
        required: true
    }
});

module.exports = mongoose.model('Checkpoints', CheckPointsSchema);
