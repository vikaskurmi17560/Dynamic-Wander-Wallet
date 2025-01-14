const Checkpoint = require('../models/checkpoint');

// Create a new checkpoint
exports.createCheckpoint = async (req, res) => {
  try {
    const checkpoint = new Checkpoint(req.body);
    const savedCheckpoint = await checkpoint.save();
    res.status(201).json(savedCheckpoint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all checkpoints for a trip
exports.getCheckpointsByTripId = async (req, res) => {
  try {
    const checkpoints = await Checkpoint.find({ tripId: req.params.tripId });
    if (!checkpoints || checkpoints.length === 0) {
      return res.status(404).json({ error: 'No checkpoints found for this trip' });
    }
    res.status(200).json(checkpoints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a specific checkpoint by ID
exports.updateCheckpoint = async (req, res) => {
  try {
    const updatedCheckpoint = await Checkpoint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCheckpoint) {
      return res.status(404).json({ error: 'Checkpoint not found' });
    }

    res.status(200).json(updatedCheckpoint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a checkpoint by ID
exports.deleteCheckpoint = async (req, res) => {
  try {
    const deletedCheckpoint = await Checkpoint.findByIdAndDelete(req.params.id);
    if (!deletedCheckpoint) {
      return res.status(404).json({ error: 'Checkpoint not found' });
    }
    res.status(200).json({ message: 'Checkpoint deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
