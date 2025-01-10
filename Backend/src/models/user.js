const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User_Schema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['customer', 'tripPlanner'], required: true }, // Role-based user types
    preferences: {
        // Preferences applicable only to customers
        transportMode: { type: String, enum: ['car', 'bike', 'public'], default: 'car' },
        hotelType: { type: String, enum: ['budget', '3-star', 'luxury'], default: 'budget' },
        foodPreference: { type: String, enum: ['vegetarian', 'vegan', 'non-vegetarian'], default: 'vegetarian' },
        maxBudget: { type: Number }
    },
    expertise: {
        // Expertise applicable only to trip planners
        specialties: [{ type: String }], //  trekking, cultural tours, etc.
        regionsCovered: [{ type: String }], //  specific regions in Uttarakhand
        yearsOfExperience: { type: Number }
    },
    phone_no: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10,15}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    gender: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },
    reset_password_token: {
        type: String,
    },
    reset_password_token_expire: {
        type: Date,
    },
    confirm_password: {
        type: String,
        validate: {
            validator: (function (val) {
                return val === this.password;
            }
            ),
            message: "done",
        }

    }

}, { timestamp: true })

User_Schema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    this.confirm_password = undefined;
    next();
})


// Add role-based validation
userSchema.pre('save', function (next) {
    if (this.role === 'customer' && !this.preferences.maxBudget) {
        return next(new Error('Max budget is required for customers.'));
    }
    if (this.role === 'tripPlanner' && !this.expertise.yearsOfExperience) {
        return next(new Error('Years of experience is required for trip planners.'));
    }
    next();
});

const User = mongoose.model("User", User_Schema);
module.exports = User;