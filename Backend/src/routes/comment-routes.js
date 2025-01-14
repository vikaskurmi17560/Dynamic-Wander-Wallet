const express = require('express');
const commentController = require('../controllers/commentController');

const router = express.Router();

router.post('/comments', commentController.addComment); // Add a comment
router.delete('/comments/:commentId', commentController.deleteComment); // Delete a comment
router.get('/comments/:postId', commentController.getCommentsForPost); // Get all comments for a specific post

module.exports = router;
