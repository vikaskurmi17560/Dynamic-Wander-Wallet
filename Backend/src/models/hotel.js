const mongoose = require("mongoose");
const hotelSchema = new mongoose.Schema({
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true
  },
  checkpoint_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Checkpoints",
    required: true
  },
  name: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  rating: { type: Number, default: 3.0 },
  description: {
    type: String,
    trim: true,
    minlength: 10,
    maxlength: 500,
    default: "No description provided."
  },
  pricePerNight: [
    {
      hotel_type: { type: String, enum: ['budget', '3-star', 'luxury'], required: true }
      , price: { type: Number, required: true }
    }
  ],
  contact: { type: String }
},{timestamps:true});

module.exports = mongoose.model('Hotel', hotelSchema);
