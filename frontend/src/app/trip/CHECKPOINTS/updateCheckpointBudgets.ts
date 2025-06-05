import axios from "axios";

export const updateCheckpointBudgets = async (tripId: string, userId: string) => {
  try {
    const checkpointRes = await axios.get(`https://dynamic-wander-wallet.onrender.com/api/v1/checkpoint/getbytripid`, {
      params: { tripId },
    });

    const checkpoints = checkpointRes.data?.checkpoints || [];

    const updated: any[] = [];

   
    for (const checkpoint of checkpoints) {
      const res = await axios.post(`https://dynamic-wander-wallet.onrender.com/api/v1/checkpoint/budget`, null, {
        params: { checkpoint_id: checkpoint._id },
      });

      if (res.data?.updatedCheckpoint) {
        updated.push(res.data.updatedCheckpoint);
      }
    }

 
    const earnBadgePoint = Math.floor(Math.random() * (100 - 60 + 1)) + 60;

    const tripRes = await axios.post(`https://dynamic-wander-wallet.onrender.com/api/v1/trip/createBudget`, {
      userId,
      Earnbadge_point: earnBadgePoint,
    }, {
      params: { trip_id: tripId },
    });

    const updatedTrip = tripRes.data?.data;

    return {
      success: true,
      updatedCheckpoints: updated,
      tripBudget: updatedTrip?.TotalBudget || 0,
      earnedPoints: earnBadgePoint,
    };
  } catch (err: any) {
    console.error("Error updating budgets:", err.message);
    return { success: false, error: err.message };
  }
};
