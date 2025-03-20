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
            minlength: 10,
            maxlength: 500,
            default: "No description provided.",
        },
        transport_budget: [
            {
                category: {
                    type: String,
                    enum: ["Vehicle", "Walk"], 
                    required: true,
                },
                transport: {
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
                },
            },
        ],
    },
    { timestamps: true }
);

const categoryVehicleMapping = new Map([
    ["Vehicle", ["State Bus", "Electric Scooter", "Motorcycle", "Electric Auto", "Public Bus", "City Bus", "Vikram Auto", "Train", "Ola Auto", "Car", "Rapido", "Public Bus AC", "Red Bus", "Uber", "Booking Car", "Luxury Car"]],
    ["Walk", ["By Walk"]],
]);



CheckPointsSchema.pre("save", function (next) {
    for (const entry of this.transport_budget) {
        if (!categoryVehicleMapping.has(entry.category)) {
            return next(new Error(`Invalid category: "${entry.category}". Allowed categories: Vehicle, Walk.`));
        }

        if (!categoryVehicleMapping.get(entry.category).includes(entry.transport.transport_type)) {
            return next(
                new Error(
                    `Transport type "${entry.transport.transport_type}" is not allowed for category "${entry.category}". Allowed types: ${categoryVehicleMapping
                        .get(entry.category)
                        .join(", ")}.`
                )
            );
        }
    }
    next();
});

module.exports = mongoose.model("Checkpoints", CheckPointsSchema);
