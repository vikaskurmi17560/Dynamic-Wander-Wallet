const Comment = require('./models/Comment');
const Post = require('./models/Post');

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { text, commentedBy, post } = req.body;

    // Create a new comment
    const newComment = new Comment({ text, commentedBy, post });
    await newComment.save();

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Find and delete the comment
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all comments for a specific post
exports.getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Retrieve all comments for the post
    const comments = await Comment.find({ post: postId }).populate('commentedBy', 'name');

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
