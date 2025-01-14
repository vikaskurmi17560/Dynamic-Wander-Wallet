const Tracking = require('../models/tracking');

// Create a new tracking record
exports.createTracking = async (req, res) => {
  try {
    const tracking = new Tracking(req.body);
    const savedTracking = await tracking.save();
    res.status(201).json(savedTracking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get tracking data for a specific trip
exports.getTrackingByTripId = async (req, res) => {
  try {
    const tracking = await Tracking.findOne({ tripId: req.params.tripId });
    if (!tracking) {
      return res.status(404).json({ error: 'Tracking record not found for this trip' });
    }
    res.status(200).json(tracking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tracking data for a specific user
exports.getTrackingByUserId = async (req, res) => {
  try {
    const trackingRecords = await Tracking.find({ userId: req.params.userId });
    res.status(200).json(trackingRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update current location for a tracking record
exports.updateCurrentLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const updatedTracking = await Tracking.findOneAndUpdate(
      { tripId: req.params.tripId },
      {
        currentLocation: { latitude, longitude },
        lastUpdated: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedTracking) {
      return res.status(404).json({ error: 'Tracking record not found for this trip' });
    }

    res.status(200).json(updatedTracking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a tracking record
exports.deleteTracking = async (req, res) => {
  try {
    const deletedTracking = await Tracking.findOneAndDelete({ tripId: req.params.tripId });
    if (!deletedTracking) {
      return res.status(404).json({ error: 'Tracking record not found for this trip' });
    }
    res.status(200).json({ message: 'Tracking record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
