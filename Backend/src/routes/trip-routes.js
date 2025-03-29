const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip-controller');

router.post('/create', tripController.createTrip);
router.get('/getbyuserid', tripController.getTripsByUser);
router.get('/getbyid', tripController.getTripsByid);
router.delete('/delete', tripController.deleteTrip);
router.post("/fetch", tripController.getTripId);
router.get("/alltrip",tripController.getAllTrip);
module.exports = router;
