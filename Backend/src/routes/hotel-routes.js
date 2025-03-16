const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotel-controller");

router.post("/create", hotelController.createHotel);
router.get("/getbycheckpointid", hotelController.getHotelsByCheckpointId);
router.delete("/delete", hotelController.deleteHotel);

module.exports = router;
