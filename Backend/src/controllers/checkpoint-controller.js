const Checkpoints = require("../models/checkpoints");

exports.createCheckpoint = async (req, res) => {
    try {
        const checkpoint = await Checkpoints.create(req.body);
        res.status(201).json({
                success:true,
                message:"Creation on Checkpoint is Done",
                checkpoint
              });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCheckpointsByTrip = async (req, res) => {
    try {
        const { tripId } = req.query; 

        if (!tripId) {
            return res.status(400).json({ error: "Trip ID is required" });
        }

        const checkpoints = await Checkpoints.find({ trip_id: tripId });

        res.status(200).json({
            success:true,
            message:"Get Checkpoint data Successfully",
            checkpoints
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getcheckpointById = async (req, res) => {
  try {
    const { _id } = req.query;
    const checkpoint = await Checkpoints.findById(_id);

    if (!checkpoint) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json({
        success:true,
        message:"get checkpoint by checkpoint id",
        checkpoint
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching trip" });
  }
}

exports.deleteCheckpointByTrip= async (req,res)=>{
    try {
        const { tripId } = req.query; 

        if (!tripId) {
            return res.status(400).json({ error: "Trip ID is required" });
        }

        const checkpoints = await Checkpoints.findByIdAndDelete({ trip_id: tripId });

        if (!checkpoints) {
            return res.status(404).json({ error: "checkpoint not found" });
          }

        res.status(200).json({
            success:true,
            message:"Delete Checkpoint Successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

