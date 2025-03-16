const Hotel = require('../models/hotel');


exports.createHotel = async (req, res) => {
    try {
        const hotel = await Hotel.create(req.body); 
        res.status(201).json({
          success:true,
          message:"hotel Creation done Successfully",
          hotel
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHotelsByCheckpointId = async (req, res) => {
    try {
      const  {checkpointId}=req.query;
        const hotels = await Hotel.find({ checkpoint_id: checkpointId });
        res.status(200).json({
          success:true,
          message:"Get Hotel Data Successfully",
          hotels
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHotel = async (req, res) => {
  try {
    const {hotelId}=req.query;
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    if (!deletedHotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
