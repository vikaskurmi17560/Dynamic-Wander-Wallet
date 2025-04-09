const Restaurants = require("../models/restaurants");
const User = require ('../models/user');

exports.createRestaurant = async (req, res) => {
    try {
        const {userId}=req.query;
        const restaurant = await Restaurants.create(req.body);
        
        await User.findByIdAndUpdate(userId, { $inc: { badge_point: 100 } });
        res.status(201).json({
            success: true,
            message: "Create Restaurant SuccessFully ",
            restaurant
        });
    } catch (error) {
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
        const {userId}=req.body;
        if (!checkpoint_id) {
            return res.status(404).json({ message: "CheckpointID is Not Here" });
        }
        const restaurants = await Restaurants.findByIdAndDelete({ checkpoint_id });
        if (!restaurants) {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        
        await User.findByIdAndUpdate(userId, { $inc: { badge_point: -100 } });
        res.status(200).json({ message: "Delete Restaurant Successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
