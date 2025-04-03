import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "./Checkpoints.module.css";
import CheckpointDetail from "./CheckpointDetail";
import useLocation from "@/hook/useLocation";

interface Trip {
    tripName: string;
    state: string;
    city: string;
    source: string;
    destination: string;
}

const Checkpoints = () => {
    const [tripData, setTripData] = useState<Trip | null>(null);
    const [tripId, setTripId] = useState<string>("");
    const { location } = useLocation();
    
    useEffect(() => {
        const storedTripId = localStorage.getItem("tripId");
        if (storedTripId) {
            setTripId(storedTripId);
            fetchTripDetails(storedTripId);
        } else {
            console.log("No Trip ID Found");
        }
    }, []);

    const fetchTripDetails = async (id: string) => {
        try {
            const response = await axios.post("http://localhost:7050/api/v1/trip/fetch", { _id: id });
            if (response.data) {
                setTripData(response.data);
            } else {
                console.log("No trip details found.");
            }
        } catch (error) {
            console.error("Error fetching trip:", error);
        }
    };

    return (
        <>
            <div className={styles.heading}>Create Your Trip Checkpoints</div>
            <div className={styles.container}>
                <div className={styles.Direction}>
                    <Image
                        src="/images/Trip/Start.png"
                        height={3000}
                        width={4000}
                        alt="Start your trip"
                        className={styles.image}
                    />
                    <div className={styles.data_div}>
                        <h2 className={styles.tripheading}>Trip Details</h2>
                        <div className={styles.content}>
                            <div className={styles.about}><span className={styles.strong}>State</span> <span className={styles.strong_value}>{tripData?.state}</span></div>
                            <div className={styles.about}><span className={styles.strong}>City</span> <span className={styles.strong_value}>{tripData?.city}</span></div>
                            <div className={styles.about}><span className={styles.strong}>From</span> <span className={styles.strong_value}>{tripData?.source}</span></div>
                            <div className={styles.about}><span className={styles.strong}>To</span> <span className={styles.strong_value}>{tripData?.destination}</span></div>
                            <div className={styles.about}><span className={styles.strong}>Location</span > <span className={styles.strong_value}>{location?.name}</span></div>
                            <div className={styles.about}><span className={styles.strong}>Trip Name</span > <span className={styles.strong_value}>{tripData?.tripName}</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <CheckpointDetail />
        </>
    );
};

export default Checkpoints;
