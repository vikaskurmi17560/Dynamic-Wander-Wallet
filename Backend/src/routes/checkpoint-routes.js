const express = require('express');
const checkpointController = require('../controllers/checkpointController');
const router = express.Router();

router.get('/getall', checkpointController.getAllCheckpoints);
router.post('/create', checkpointController.createCheckpoint);

module.exports = router;
