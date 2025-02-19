const express = require('express');
const likeController = require('../controllers/like-controller');

const router = express.Router();

router.post('/likes', likeController.addLike); // Add a like to a post
router.delete('/likes', likeController.removeLike); // Remove a like from a post
router.get('/likes/:postId', likeController.getLikesForPost); // Get all likes for a specific post

module.exports = router;
