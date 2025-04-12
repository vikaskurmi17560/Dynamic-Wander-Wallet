const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User_Schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        profile: { type: String, required: false },
        email: { type: String, required: true, unique: true },

        phone_no: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (v) {
                    return /^\d{10,15}$/.test(v);
                },
                message: (props) => `${props.value} is not a valid phone number!`,
            },
        },
        gender: {
            type: String,
            required: false,
        },
        banner:{
            type: String,
            required: false,
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
        bio: {
            type: String,
            required: false,
            maxlength: 150, 
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post", 
            },
        ],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", 
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", 
            },
        ],
        badge_point: {
            type: Number,
            default: 0,
        },
        badge_usage_history: [
            {
              product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product", // or another collection
                required: true
              },
              used_points: {
                type: Number,
                required: true
              },
              used_at: {
                type: Date,
                default: Date.now
              }
            }
          ],
        total_trip: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true } 
);


User_Schema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

User_Schema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", User_Schema);
module.exports = User;
