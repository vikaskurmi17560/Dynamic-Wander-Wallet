const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            maxlength: 100,
        },
        image: {
            type: String,
            required:true
        },
        description: {
            type: String,
            maxlength: 500,
        },
        tags: {
            type: [String],
            default: [],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Array of user IDs who liked the post
                unique: true
            },
        ],
        comments: [
            {
                text: { type: String, required: true },
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
