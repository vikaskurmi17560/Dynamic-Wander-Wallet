const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like-controller');


router.post("/create", likeController.addLike);
router.get("/getalldata", likeController.getLikesForPost);

module.exports = router;
