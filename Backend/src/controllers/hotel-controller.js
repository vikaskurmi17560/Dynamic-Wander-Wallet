const Hotel = require('../models/hotel');
const User = require('../models/user');

exports.createHotel = async (req, res) => {
  try {
    const { userId } = req.query;
    const hotel = await Hotel.create(req.body);
    hotel.Earnbadge_point.push({
      hotel: hotel._id, 
      value: 50
    });

    await hotel.save();

    res.status(201).json({
      success: true,
      message: "hotel Creation done Successfully",
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

