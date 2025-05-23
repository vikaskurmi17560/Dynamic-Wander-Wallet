const Restaurants = require("../models/restaurants");
const Trip = require('../models/trip');
const Checkpoints = require("../models/checkpoints");


exports.createRestaurant = async (req, res) => {
    try {
        console.log("Received Body:", req.body);

        const { trip_id, checkpoint_id, Earnbadge_point, Earnbudget_point, ...restaurantData } = req.body;

        restaurantData.trip_id = trip_id;
        restaurantData.checkpoint_id = checkpoint_id;

        if (Earnbadge_point !== undefined && Earnbadge_point !== null) {
            restaurantData.Earnbadge_point = Earnbadge_point;
        }

        if (Earnbudget_point !== undefined && Earnbudget_point !== null) {
            restaurantData.Earnbudget_point = Earnbudget_point;
        }

        const restaurant = await Restaurants.create(restaurantData);

        if (checkpoint_id && Earnbadge_point) {
            await Checkpoints.findByIdAndUpdate(
                checkpoint_id,
                { $inc: { Earnbadge_point: Earnbadge_point } }
            );
        }

       
        if (trip_id && Earnbadge_point) {
            await Trip.findByIdAndUpdate(
                trip_id,
                { $inc: { Earnbadge_point: Earnbadge_point } }
            );
        }

        res.status(201).json({
            success: true,
            message: "Create Restaurant Successfully",
            restaurant
        });
    } catch (error) {
        console.error("Error in createRestaurant:", error);
        res.status(500).json({ error: error.message });
    }
};



exports.getRestaurantsByCheckpoint = async (req, res) => {
    try {
        const { checkpoint_id } = req.query;
        if (!checkpoint_id) {
            return res.status(404).json({ message: "CheckpointID is Not Here" });
        }
        const restaurants = await Restaurants.find({ checkpoint_id });
        res.status(200).json({
            success: true,
            message: "Get Data by Checkpoint_ID",
            restaurants
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRestaurantsById = async (req, res) => {
    try {
        const { restaurantid } = req.query;
        if (!restaurantid) {
            return res.status(404).json({ message: "RestaurantID is Not Here" });
        }
        const restaurants = await Restaurants.findOne({ _id: restaurantid });
        res.status(200).json({
            success: true,
            message: "Get Data by Restaurant_ID",
            restaurants
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteRestaurantById = async (req, res) => {
    try {
        const { checkpoint_id } = req.query;
        const { userId } = req.body;
        if (!checkpoint_id) {
            return res.status(404).json({ message: "CheckpointID is Not Here" });
        }
        const restaurants = await Restaurants.findByIdAndDelete({ checkpoint_id });
        if (!restaurants) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        res.status(200).json({ message: "Delete Restaurant Successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
