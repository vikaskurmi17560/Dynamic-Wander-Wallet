const Checkpoints = require("../models/checkpoints");

exports.createCheckpoint = async (req, res) => {
    try {
        const checkpoint = Checkpoints.create(req.body);
        res.status(201).json(checkpoint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCheckpointsByTrip = async (req, res) => {
    try {
        const { tripId } = req.params; // Extract tripId from URL params

        if (!tripId) {
            return res.status(400).json({ error: "Trip ID is required" });
        }

        const checkpoints = await Checkpoint.find({ trip_id: tripId });

        res.status(200).json(checkpoints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

