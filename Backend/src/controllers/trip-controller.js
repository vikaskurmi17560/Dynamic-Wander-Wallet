const Trip = require('../models/trip');

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const savedTrip = await Trip.create(req.body);
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get all trips for a user
exports.getTripsByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const trips = await Trip.find({ userId }).lean();

    res.status(200).json({
      success: true,
      message: "Get Trip by trip_id successfully",
      trips
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all trips for a user
exports.getTripsByid = async (req, res) => {
  try {
    const { trip_id } = req.query;
    if (!trip_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const trips = await Trip.findOne({ _id: trip_id });

    res.status(200).json({
      success: true,
      message: "Get Trip by trip_id successfully",
      trips
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


// Delete a trip by ID
exports.deleteTrip = async (req, res) => {
  try {
    const { trip_id } = req.query; // Extract trip_id correctly

    if (!trip_id) {
      return res.status(400).json({ error: "Trip ID is required" });
    }

    const deletedTrip = await Trip.findByIdAndDelete(trip_id); // Pass trip_id directly

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

// Fetch the TripData Through Id

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
}