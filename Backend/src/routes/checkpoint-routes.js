const express = require('express');
const checkpointController = require('../controllers/checkpointController');
const router = express.Router();

router.get('/', checkpointController.getAllCheckpoints);
router.post('/', checkpointController.createCheckpoint);

module.exports = router;
