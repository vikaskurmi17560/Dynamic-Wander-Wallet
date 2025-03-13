const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotel-controller");

router.post("/", hotelController.createHotel);
router.get("/checkpoint/:checkpointId", hotelController.getHotelsByCheckpointId);
router.delete("/:id", hotelController.deleteHotel);

module.exports = router;
