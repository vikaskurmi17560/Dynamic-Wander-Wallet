const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
    {
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the user who liked the post
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post", // Reference to the post that was liked
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
