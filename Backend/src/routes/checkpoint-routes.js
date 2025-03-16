const express = require('express');
<<<<<<< HEAD
const checkpointController = require('../controllers/checkpoint-controller');
=======
>>>>>>> 97bece0af3ff99faf669a190bc7513055bf27fae
const router = express.Router();
const checkpointController = require('../controllers/checkpoint-controller');

router.get('/getall', checkpointController.getCheckpointsByTrip);
router.post('/create', checkpointController.createCheckpoint);

module.exports = router;
