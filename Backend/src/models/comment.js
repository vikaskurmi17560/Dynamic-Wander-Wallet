const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, "Comment text is required"],
            maxlength: 500,
        },
        commentedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
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

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
