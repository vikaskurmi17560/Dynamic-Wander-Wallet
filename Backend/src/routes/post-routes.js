const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');

router.post('/posts', postController.createPost);
router.get('/posts', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);
router.patch('/posts/:id', postController.updatePost);
router.delete('/posts/:id', postController.deletePost);
router.post('/posts/:id/like', postController.likePost);
router.post('/posts/:id/unlike', postController.unlikePost);
router.post('/posts/:id/comment', postController.addComment);
router.delete('/posts/:postId/comment/:commentId', postController.removeComment);

module.exports = router;
