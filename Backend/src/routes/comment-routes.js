const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment-controller');

router.post('/comments', commentController.addComment); // Add a comment
router.delete('/comments/:commentId', commentController.deleteComment); // Delete a comment
router.get('/comments/:postId', commentController.getCommentsForPost); // Get all comments for a specific post

module.exports = router;
