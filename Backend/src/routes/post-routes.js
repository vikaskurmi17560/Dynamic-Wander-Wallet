const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');
const upload = require("../services/multer");

router.post('/create', upload.single("image"),postController.createPost);
router.get('/getbyid', postController.getPostById);
router.get('/getbyuserid', postController.getPostByUserId);
router.post('/update', postController.updatePostById);
router.delete('/delete', postController.deletePostById);
// router.post('/posts/:id/like', postController.likePost);
// router.post('/posts/:id/unlike', postController.unlikePost);
// router.post('/posts/:id/comment', postController.addComment);
// router.delete('/posts/:postId/comment/:commentId', postController.removeComment);

module.exports = router;
