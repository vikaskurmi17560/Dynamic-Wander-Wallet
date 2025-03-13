const Restaurants = require("../models/Restaurant");

exports.createRestaurant = async (req, res) => {
    try {
        const restaurant = new Restaurants(req.body);
        await restaurant.save();
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRestaurantsByCheckpoint = async (req, res) => {
    try {
        const {checkpoint_id} = req.query
        const restaurants = await Restaurants.find({ checkpoint_id});
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
