const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment-controller');

router.post('/create', commentController.addComment); 
router.get('/getbypost', commentController.getCommentsByPostId); 
router.get('/getbyuser', commentController.getCommentsByUserId);
router.delete('/delete', commentController.deleteCommentById);

module.exports = router;
