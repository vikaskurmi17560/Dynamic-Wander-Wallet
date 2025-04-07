const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            maxlength: 500,
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        visibility: {
            type: String,
            default: "public",
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                text: { type: String, required: true, trim: true },
                commentedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
