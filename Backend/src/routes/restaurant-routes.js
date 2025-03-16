const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurant-controller");

router.post("/create", restaurantController.createRestaurant);
router.get("/getcheckpoint", restaurantController.getRestaurantsByCheckpoint);
router.get("/getrestaurant",restaurantController.getRestaurantsById);

module.exports = router;
