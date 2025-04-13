const Hotel = require('../models/hotel');
const Checkpoints = require("../models/checkpoints");
const Trip = require("../models/trip");

exports.createHotel = async (req, res) => {
  try {
    console.log("Received Body:", req.body);

    const { trip_id, checkpoint_id, Earnbadge_point, Earnbudget_point, ...hotelData } = req.body;

    // Add required fields back to the hotel data
    hotelData.trip_id = trip_id;
    hotelData.checkpoint_id = checkpoint_id;

    if (Earnbadge_point !== undefined && Earnbadge_point !== null) {
      hotelData.Earnbadge_point = Earnbadge_point;
    }

    if (Earnbudget_point !== undefined && Earnbudget_point !== null) {
      hotelData.Earnbudget_point = Earnbudget_point;
    }

    const hotel = await Hotel.create(hotelData);

    // Update Checkpoint badge points
    if (checkpoint_id && Earnbadge_point) {
      await Checkpoints.findByIdAndUpdate(
        checkpoint_id,
        { $inc: { Earnbadge_point: Earnbadge_point } }
      );
    }

    // Update Trip badge points
    if (trip_id && Earnbadge_point) {
      await Trip.findByIdAndUpdate(
        trip_id,
        { $inc: { Earnbadge_point: Earnbadge_point } }
      );
    }

    res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      hotel
    });
  } catch (error) {
    console.error("Error in createHotel:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getHotelsByCheckpointId = async (req, res) => {
  try {
    const { checkpointId } = req.query;
    const hotels = await Hotel.find({ checkpoint_id: checkpointId });
    res.status(200).json({
      success: true,
      message: "Get Hotel Data Successfully",
      hotels
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const { hotelId } = req.query;
    const { userId } = req.body;
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    if (!deletedHotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }


    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

