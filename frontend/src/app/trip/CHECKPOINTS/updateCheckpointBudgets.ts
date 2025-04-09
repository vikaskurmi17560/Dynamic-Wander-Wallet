import axios from "axios";

export const updateCheckpointBudgets = async (tripId: string, userId: string) => {
  try {
    // Step 1: Get all checkpoints
    const checkpointRes = await axios.get(`http://localhost:7050/api/v1/checkpoint/getbytripid`, {
      params: { tripId },
    });

    const checkpoints = checkpointRes.data?.checkpoints || [];

    // Step 2: Update each checkpoint budget
    const updated: any[] = [];

    for (const checkpoint of checkpoints) {
      const res = await axios.post(`http://localhost:7050/api/v1/checkpoint/budget`, null, {
        params: { checkpoint_id: checkpoint._id },
      });

      if (res.data?.updatedCheckpoint) {
        updated.push(res.data.updatedCheckpoint);
      }
    }

    // Step 3: Create trip budget by combining checkpoint budgets
    const tripRes = await axios.post(`http://localhost:7050/api/v1/trip/createBudget`, { userId }, {
      params: { trip_id: tripId },
    });

    const updatedTrip = tripRes.data?.data;

    return {
      success: true,
      updatedCheckpoints: updated,
      tripBudget: updatedTrip?.TripBudget || 0,
    };
  } catch (err: any) {
    console.error("Error updating budgets:", err.message);
    return { success: false, error: err.message };
  }
};
