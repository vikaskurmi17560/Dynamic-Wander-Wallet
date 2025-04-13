const Hotel = require('../models/hotel');
const Checkpoints = require("../models/checkpoints");
const Trip = require("../models/trip");

exports.createHotel = async (req, res) => {
  try {

    const { trip_id, checkpoint_id, Earnbudget_point, ...hoteldata } = req.body;


    if (Earnbudget_point !== undefined && Earnbudget_point !== null) {
      hoteldata.Earnbadge_point = Earnbudget_point;
    }


    const hotel = await Hotel.create(hoteldata);


    if (checkpoint_id && Earnbudget_point) {
      await Checkpoints.findByIdAndUpdate(
        checkpoint_id,
        { $inc: { Earnbadge_point: Earnbudget_point } }
      );
    }


    if (trip_id && Earnbudget_point) {
      await Trip.findByIdAndUpdate(
        trip_id,
        { $inc: { Earnbadge_point: Earnbudget_point } }
      );
    }

    res.status(201).json({
      success: true,
      message: "Hotel creation done successfully",
      hotel
    });
  } catch (error) {
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

