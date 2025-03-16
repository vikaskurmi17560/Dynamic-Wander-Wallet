const Checkpoints = require("../models/checkpoints");

exports.createCheckpoint = async (req, res) => {
    try {
        const checkpoint = new Checkpoints(req.body);
        await checkpoint.save();
        res.status(201).json(checkpoint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCheckpointsByTrip = async (req, res) => {
    try {
        const checkpoints = await Checkpoints.find({ trip_id: req.params.tripId });
        res.status(200).json(checkpoints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
