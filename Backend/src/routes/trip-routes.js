const express = require('express');
const tripController = require('../controllers/tripController');
const router = express.Router();

router.get('/', tripController.getAllTrips);
router.post('/', tripController.createTrip);

module.exports = router;
