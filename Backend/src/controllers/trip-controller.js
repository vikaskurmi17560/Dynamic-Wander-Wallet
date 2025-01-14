const Trip = require('../models/trip');

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const trip = new Trip(req.body);
    const savedTrip = await trip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all trips for a user
exports.getTripsByUser = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single trip by ID
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a trip by ID
exports.updateTrip = async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a trip by ID
exports.deleteTrip = async (req, res) => {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
    if (!deletedTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update checkpoint status
exports.updateCheckpointStatus = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const checkpoint = trip.checkpoints.id(req.params.checkpointId);
    if (!checkpoint) {
      return res.status(404).json({ error: 'Checkpoint not found' });
    }

    checkpoint.visited = req.body.visited;
    await trip.save();

    res.status(200).json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update trip budget
exports.updateTripBudget = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (req.body.spent !== undefined) {
      trip.budget.spent = req.body.spent;
      trip.budget.remaining = trip.budget.total - trip.budget.spent;
    }

    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
