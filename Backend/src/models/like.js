const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
    {
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true,
            unique: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post", 
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Like = mongoose.model("Like", LikeSchema);
module.exports = Like;
