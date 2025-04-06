const Checkpoints = require("../models/checkpoints");
const Restaurant = require("../models/restaurants");
const Hotel = require("../models/hotel");

exports.createCheckpoint = async (req, res) => {
    try {
        const checkpoint = await Checkpoints.create(req.body);
        res.status(201).json({
            success: true,
            message: "Creation on Checkpoint is Done",
            checkpoint
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCheckpointsByTrip = async (req, res) => {
    try {
        const { tripId } = req.query;

        if (!tripId) {
            return res.status(400).json({ error: "Trip ID is required" });
        }

        const checkpoints = await Checkpoints.find({ trip_id: tripId }).sort("createdAt");

        res.status(200).json({
            success: true,
            message: "Get Checkpoint data Successfully",
            checkpoints
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getcheckpointById = async (req, res) => {
    try {
        const { _id } = req.query;
        const checkpoint = await Checkpoints.findById(_id);

        if (!checkpoint) {
            return res.status(404).json({ error: "Trip not found" });
        }

        res.status(200).json({
            success: true,
            message: "get checkpoint by checkpoint id",
            checkpoint
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching trip" });
    }
}

exports.deleteCheckpointByTrip = async (req, res) => {
    try {
        const { tripId } = req.query;

        if (!tripId) {
            return res.status(400).json({ error: "Trip ID is required" });
        }

        const checkpoints = await Checkpoints.findByIdAndDelete({ trip_id: tripId });

        if (!checkpoints) {
            return res.status(404).json({ error: "checkpoint not found" });
        }

        res.status(200).json({
            success: true,
            message: "Delete Checkpoint Successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.CreateBudgetOnCheckpoint = async (req, res) => {
  try {
    const { checkpoint_id } = req.query;

    if (!checkpoint_id) {
      return res.status(400).json({ success: false, message: "Checkpoint ID is required" });
    }

    const checkpointBudget = await Checkpoints.findById(checkpoint_id);
    if (!checkpointBudget) {
      return res.status(404).json({ success: false, message: "Checkpoint not found" });
    }


    const checkpoint_budget = checkpointBudget.transport_budget?.reduce(
      (sum, item) => sum + (item.transport_price || 0),
      0
    ) || 0;

    const hotelList = await Hotel.find({ checkpoint_id });
    const hotel_budget = hotelList.reduce((sum, hotel) => {
      const totalPerHotel = hotel.pricePerNight.reduce((hotelSum, entry) => hotelSum + (entry.price || 0), 0);
      return sum + totalPerHotel;
    }, 0);

    const restaurantList = await Restaurant.find({ checkpoint_id });
  
    const restaurant_budget = restaurantList.reduce((total, restaurant) => {
        const restaurantTotal = restaurant.prices.reduce((sum, meal) => sum + (meal.meal_price || 0), 0);
        return total + restaurantTotal;
      }, 0);
  

    const total_budget = hotel_budget + restaurant_budget + checkpoint_budget;

    
    const updateObject = {
      hotel_Budget: hotel_budget,
      restaurant_Budget: restaurant_budget,
      Total_checkpointBudget: total_budget,
    };

    const updatedCheckpoint = await Checkpoints.findByIdAndUpdate(
      checkpoint_id,
      updateObject,
      { new: true, runValidators: true }
    );

    if (!updatedCheckpoint) {
      return res.status(400).json({
        success: false,
        message: "Failed to update checkpoint budget",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Checkpoint budget updated successfully",
      updatedCheckpoint
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
