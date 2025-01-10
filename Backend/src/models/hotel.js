const mongoose = require("mongoose");
const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    rating: { type: Number, default: 3.0 },
    type: { type: String, enum: ['budget', '3-star', 'luxury'], required: true },
    pricePerNight: { type: Number, required: true },
    amenities: [{ type: String }],
    availableRooms: { type: Number, default: 0 },
    contact: { type: String }
  });
  
  module.exports = mongoose.model('Hotel', hotelSchema);
  