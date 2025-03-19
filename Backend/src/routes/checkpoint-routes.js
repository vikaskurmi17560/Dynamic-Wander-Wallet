const express = require('express');
const router = express.Router();
const checkpointController = require('../controllers/checkpoint-controller');

router.post('/create', checkpointController.createCheckpoint);
router.get('/getbytripid', checkpointController.getCheckpointsByTrip);
router.get('/getbyid',checkpointController.getcheckpointById);
router.delete('/delete',checkpointController.deleteCheckpointByTrip);

module.exports = router;
