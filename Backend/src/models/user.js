const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User_Schema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    
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
        type: String
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

    },
    bio: {
        type: String,
        maxlength: 150, // Optional field for user bio
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post", // Reference to posts created by the user
        },
    ],

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