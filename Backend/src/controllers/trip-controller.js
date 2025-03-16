const Trip = require('../models/trip');

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const savedTrip = await Trip.create(req.body); // Using Model.create()
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

    res.status(200).json(trips);
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

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// // Update checkpoint status
// exports.updateCheckpointStatus = async (req, res) => {
//   try {
//     const trip = await Trip.findById(req.params.tripId);
//     if (!trip) return res.status(404).json({ error: 'Trip not found' });

//     const checkpoint = trip.checkpoints.id(req.params.checkpointId);
//     if (!checkpoint) return res.status(404).json({ error: 'Checkpoint not found' });

//     checkpoint.visited = req.body.visited;
//     await trip.save();

//     res.status(200).json({ message: 'Checkpoint updated successfully', trip });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Update trip budget
// exports.updateTripBudget = async (req, res) => {
//   try {
//     const trip = await Trip.findById(req.params.id);
//     if (!trip) return res.status(404).json({ error: 'Trip not found' });

//     if (req.body.spent !== undefined) {
//       trip.budget.spent = req.body.spent;
//       trip.budget.remaining = Math.max(trip.budget.total - trip.budget.spent, 0);
//     }

//     await trip.save();
//     res.status(200).json({ message: 'Budget updated successfully', trip });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Update trip status
// exports.updateTripStatus = async (req, res) => {
//   try {
//     const trip = await Trip.findById(req.params.id);
//     if (!trip) return res.status(404).json({ error: 'Trip not found' });

//     if (!['active', 'completed', 'cancelled'].includes(req.body.status)) {
//       return res.status(400).json({ error: 'Invalid status value' });
//     }

//     trip.status = req.body.status;
//     await trip.save();

//     res.status(200).json({ message: 'Trip status updated successfully', trip });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
