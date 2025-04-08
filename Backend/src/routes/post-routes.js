const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');
const upload = require("../services/multer");

router.post('/create', upload.single("image"),postController.createPost);
router.get('/getbyid', postController.getPostById);
router.get('/getbyuserid', postController.getPostByUserId);
router.post('/update', postController.updatePostById);
router.delete('/delete', postController.deletePostById);
router.get("/getallpost", postController.getAllPosts);
router.post("/like/create", postController.addLike);
router.get("/like/getalldata", postController.getLikesForPost);
router.post('/comment/create', postController.addComment); 
router.get('/comment/getbypost', postController.getCommentsByPostId); 
router.get('/comment/getbyuser', postController.getCommentsByUserId);
router.delete('/comment/delete', postController.deleteCommentById);

module.exports = router;
