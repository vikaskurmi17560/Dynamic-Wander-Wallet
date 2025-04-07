const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");


exports.addComment = async (req, res) => {
  try {
    const { user_id, text, post_id } = req.body;


    if (!user_id || !text || !post_id) {
      return res.status(400).json({
        success: false,
        message: "user_id, post_id and comment text are required",
      });
    }

    const userExists = await User.findById(user_id);
    const postExists = await Post.findById(post_id);

    if (!userExists || !postExists) {
      return res.status(404).json({
        success: false,
        message: "User or Post not found",
      });
    }

    const newComment = await Comment.create({
      text: text,
      commentedBy: user_id,
      post: post_id,
    });

    if (!newComment) {
      return res.status(400).json({
        success: false,
        message: "Comment not created",
      });
    }


    await Post.findByIdAndUpdate(post_id, {
      $push: {
        comments: {
          text: text,
          commentedBy: user_id,
          createdAt: newComment.createdAt,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCommentsByPostId = async (req, res) => {
    try {
        const { post_id } = req.query;

        const comments = await Comment.find({ post: post_id })
            .populate('commentedBy', 'name profile') 
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            comments: comments.map(comment => ({
                _id: comment._id,
                text: comment.text,
                createdAt: comment.createdAt,
                user: {
                    _id: comment.commentedBy._id,
                    name: comment.commentedBy.name,
                    profile: comment.commentedBy.profile || '',
                },
            })),
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching comments' });
    }
};


exports.getCommentsByUserId = async (req, res) => {
  try {
    const { user_id } = req.query;

    const comments = await Comment.find({ commentedBy: user_id }).populate("post", "title");

    if (!comments || comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No comments found by this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






exports.deleteCommentById = async (req, res) => {
  try {
    const { comment_id } = req.query;

    const deletedComment = await Comment.findByIdAndDelete(comment_id);

    if (!deletedComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }


    await Post.findByIdAndUpdate(deletedComment.post, {
      $pull: {
        comments: {
          text: deletedComment.text,
          commentedBy: deletedComment.commentedBy,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

