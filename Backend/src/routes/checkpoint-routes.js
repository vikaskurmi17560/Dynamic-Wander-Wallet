const express = require('express');
const router = express.Router();
const checkpointController = require('../controllers/checkpoint-controller');

router.get('/getall', checkpointController.getCheckpointsByTrip);
router.post('/create', checkpointController.createCheckpoint);

module.exports = router;
