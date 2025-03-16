const express = require('express');
const checkpointController = require('../controllers/checkpoint-controller');
const router = express.Router();

router.get('/getall', checkpointController.getAllCheckpoints);
router.post('/create', checkpointController.createCheckpoint);

module.exports = router;
