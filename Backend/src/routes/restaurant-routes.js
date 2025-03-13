const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

router.post("/", restaurantController.createRestaurant);
router.get("/checkpoint/:checkpointId", restaurantController.getRestaurantsByCheckpointId);

module.exports = router;
