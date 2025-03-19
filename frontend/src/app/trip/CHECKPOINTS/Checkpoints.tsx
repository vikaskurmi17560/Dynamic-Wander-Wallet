import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "./Checkpoints.module.css";
import CheckpointDetail from "./CheckpointDetail";

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
    const [isClicked, setIsClicked] = useState<boolean>(false);

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

    const handleClicked = () => {
        setIsClicked((prev) => !prev);
    };

    return (
        <>
            <div className={styles.heading}>Create Your Trip Checkpoints</div>
            <div className={styles.container}>
                <div className={styles.Direction}>
                    <Image
                        src="/images/Trip/Start.png"
                        height={1000}
                        width={1000}
                        alt="Start your trip"
                        className={styles.image}
                    />
                    <button className={styles.button_82_pushable} role="button" onClick={handleClicked}>
                        <span className={styles.button_82_shadow}></span>
                        <span className={styles.button_82_edge}></span>
                        <span className={styles.button_82_front}>START</span>
                    </button>
                    {isClicked ? (
                        <div className={styles.data_div}>
                            {tripData ? (
                                <div className={styles.content}>
                                    <h2 className={styles.tripheading}>Trip Details</h2>
                                    <p className={styles.about}><span className={styles.strong}>Trip Name</span> <span>{tripData?.tripName}</span></p>
                                    <p className={styles.about}><span className={styles.strong}>State</span> <span>{tripData?.state}</span></p>
                                    <p className={styles.about}><span className={styles.strong}>City</span> <span>{tripData?.city}</span></p>
                                    <p className={styles.about}><span className={styles.strong}>From</span> <span>{tripData?.source}</span></p>
                                    <p className={styles.about}><span className={styles.strong}>To</span> <span>{tripData?.destination}</span></p>
                                </div>
                            ) : (
                                <p>No trip details found.</p>
                            )}
                        </div>
                    ) : (
                        <div className={styles.waiting}>
                            <Image src="/images/Trip/Waiting.gif" alt="Waiting..." height={2500} width={2500} className={styles.wait_img} />
                        </div>
                    )}
                </div>
            </div>
            <CheckpointDetail />
        </>
    );
};

export default Checkpoints;
