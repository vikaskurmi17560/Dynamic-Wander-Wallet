import { FollowTripURL } from "@/urls/allurls";
import axios from "axios";

export async function FollowTrip(tripId: string | null , userId: string | null){
    if (!tripId || !userId) {
        console.error("Trip ID or User ID is null.");
        return;
      }
    try {
        const response = await axios.post(FollowTripURL,{tripId, userId});
        return response.data;
      } catch (error) {
        console.error("Error in trip Following:", error);
        throw error;
      }
}
