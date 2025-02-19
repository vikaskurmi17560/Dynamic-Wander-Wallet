const express = require('express');
const tripController = require('../controllers/trip-controller');
const router = express.Router();

router.get('/getall', tripController.getTripsByUser);
router.post('/create', tripController.createTrip);

module.exports = router;
