const mongoose = require("mongoose");

const CheckPointsSchema = new mongoose.Schema({
    trip_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },
    destination: {
        name: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    source: {
        name: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    description: {
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 500,
        default: "No description provided."
    },
    transport_budget: [{
        category: { type: String, enum: ['Economy', 'Standard', 'Luxury'], required: true },
        transport: {
            transport_type: { 
                type: String, 
                enum: ['Car', 'Bus', 'Motorcycle', 'Scooter', 'Electric Scooter', 'Train', 'Helicopter', 'Airplane', 'Boat'], 
                required: true 
            },
            transport_price: { type: Number, required: true, min: 0 }, // Ensure non-negative values
            extra_info: { type: String, trim: true } // Optional additional details
        }
    }]
}, { timestamps: true });

// Pre-save validation to enforce category-based vehicle options
CheckPointsSchema.pre('save', function(next) {
    const categoryVehicleMapping = {
        Economy: ['Bus', 'Motorcycle', 'Scooter', 'Electric Scooter', 'Train'],
        Standard: ['Car', 'Bus', 'Train', 'Boat'],
        Luxury: ['Car', 'Helicopter', 'Airplane', 'Boat']
    };

    this.transport_budget.forEach(entry => {
        if (!categoryVehicleMapping[entry.category].includes(entry.transport.transport_type)) {
            return next(new Error(`Transport type "${entry.transport.transport_type}" is not allowed for category "${entry.category}"`));
        }
    });

    next();
});

module.exports = mongoose.model('Checkpoints', CheckPointsSchema);
