const Checkpoints = require('../models/checkpoints');
const Trip = require('../models/trip');
const User = require('../models/user');
const { uploadSingleImage, uploadMultipleImages } = require("../services/cloudinary");

exports.createTrip = async (req, res) => {
  try {
    const savedTrip = await Trip.create(req.body);
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getTripsByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const trips = await Trip.find({ userId }).lean();
    res.status(200).json({
      success: true,
      message: "Trips fetched successfully",
      trips
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTripsByid = async (req, res) => {
  try {
    const { trip_id } = req.query;
    if (!trip_id) {
      return res.status(400).json({ error: "Trip ID is required" });
    }

    const trip = await Trip.findOne({ _id: trip_id });
    res.status(200).json({
      success: true,
      message: "Trip fetched successfully",
      trip
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.deleteTrip = async (req, res) => {
  try {
    const { trip_id } = req.query;
    const { userId } = req.body;

    if (!trip_id || !userId) {
      return res.status(400).json({ error: "Trip ID and User ID are required" });
    }

    const deletedTrip = await Trip.findByIdAndDelete(trip_id);
    await User.findByIdAndUpdate(userId, { $inc: { total_trip: -1 } });
    await User.findByIdAndUpdate(userId, { $inc: { badge_point: 5000 } });

    if (!deletedTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getTripId = async (req, res) => {
  try {
    const { _id } = req.body;
    const trip = await Trip.findById(_id);

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ error: "Error fetching trip" });
  }
};


exports.getAllTrip = async (req, res) => {
  try {
    const trips = await Trip.find();

    if (!trips || trips.length === 0) {
      return res.status(404).json({ error: "No trips found" });
    }

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ error: "Error fetching all trips" });
  }
};


exports.uploadImagesByTripId = async (req, res) => {
  try {
    const { trip_id } = req.query;
    let updated_object = {};

    if (req.files) {
      if (req.files.cover_image) {
        const uploadedCoverImage = await uploadSingleImage(req.files.cover_image[0].path);
        if (uploadedCoverImage) {
          updated_object.cover_image = uploadedCoverImage.secure_url;
        }
      }

      if (req.files.image && req.files.image.length > 0) {
        const uploadedImages = await uploadMultipleImages(
          req.files.image.map(file => file.path)
        );
        if (uploadedImages.length > 0) {
          updated_object.image = uploadedImages.map(img => img.secure_url);
        }
      }
    }

    const updatedTrip = await Trip.findByIdAndUpdate(trip_id, updated_object, {
      new: true,
      runValidators: true
    });

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    return res.status(200).json({
      message: "Trip updated successfully!",
      updatedTrip
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.tripBudget = async (req, res) => {
  try {
    const { trip_id } = req.query;
    const { userId } = req.body;

    console.log("Trip ID:", trip_id);
    console.log("User ID:", userId);

    if (!trip_id || !userId) {
      return res.status(400).json({ message: "trip_id or userId is missing" });
    }

    const TripCheckpointData = await Checkpoints.find({ trip_id });
    console.log("Checkpoints found:", TripCheckpointData.length);

    const trip_budget = TripCheckpointData.reduce(
      (sum, item) => sum + (item.Total_checkpointBudget || 0),
      0
    );

    console.log("Calculated Budget:", trip_budget);

    const updatedTrip = await Trip.findByIdAndUpdate(
      trip_id,
      { TotalBudget: trip_budget },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    await User.findByIdAndUpdate(userId, { $inc: { total_trip: 1 } });
    await User.findByIdAndUpdate(userId, { $inc: { badge_point: 5000 } });

    return res.status(200).json({
      success: true,
      message: "Total trip budget created successfully",
      data: updatedTrip
    });
  } catch (error) {
    console.error("🔥 tripBudget error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.followTrip = async (req, res) => {
  try {
    const { tripId, userId } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    
    if (trip.followedby.includes(userId)) {
      return res.status(400).json({ error: "User already follows this trip" });
    }

    
    trip.followedby.push(userId);
    await trip.save();

    return res.status(200).json({ success: true, message: "Trip followed successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

