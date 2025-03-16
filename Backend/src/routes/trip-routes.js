const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip-controller');

router.post('/create', tripController.createTrip);
router.get('/getall', tripController.getTripsByUser);
router.delete('/delete',tripController.deleteTrip);

module.exports = router;
