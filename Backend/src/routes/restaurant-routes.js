const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurant-controller");

router.post("/", restaurantController.createRestaurant);
router.get("/getcheckpoint", restaurantController.getRestaurantsByCheckpoint);

module.exports = router;
