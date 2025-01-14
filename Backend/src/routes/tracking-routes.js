const express = require('express');
const trackingController = require('../controllers/trackingController');
const router = express.Router();

router.get('/', trackingController.getAllTrackingData);
router.post('/', trackingController.createTrackingData);

module.exports = router;
