const express = require('express');
const trackingController = require('../controllers/tracking-controller');
const router = express.Router();

router.get('/getall', trackingController.getAllTrackingData);
router.post('/create', trackingController.createTrackingData);

module.exports = router;
