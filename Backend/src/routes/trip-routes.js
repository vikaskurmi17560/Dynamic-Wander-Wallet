const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip-controller');
const upload = require("../services/multer"); 

router.post('/create', tripController.createTrip);
router.get('/getbyuserid', tripController.getTripsByUser);
router.get('/getbyid', tripController.getTripsByid);
router.delete('/delete', tripController.deleteTrip);
router.post("/fetch", tripController.getTripId);
router.get("/alltrip", tripController.getAllTrip);
router.post("/update-trip",upload.fields([{ name: "cover_image", maxCount: 1 }, { name: "image", maxCount: 10 }]),tripController.uploadImagesByTripId);
router.post("/createBudget",tripController.tripBudget);
router.post("/follow",tripController.followTrip);
router.post("/updateData",tripController.updatedata);

module.exports = router;
