const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User_Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    Address: {
        address: {
            type: String,
            required: true,
        },
        road: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        pin_code: {
            type: Number,
            required: true,
        }
    },
    role: {
        type: String,
        enum: ['Customer', 'Trip Planner'],
        default: 'Customer'
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

const User = mongoose.model("User", User_Schema);
module.exports = User;