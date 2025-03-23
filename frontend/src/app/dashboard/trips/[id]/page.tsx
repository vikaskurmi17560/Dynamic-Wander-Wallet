"use client";
import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import style from "./Starttrips.module.css";
import Image from "next/image";
import Link from "next/link";

interface Checkpoint {
    _id: string;
    source: { name: string; latitude: number; longitude: number };
    destination: { name: string; latitude: number; longitude: number };
    description: string;
    transport_budget: { category: string; transport_type: string; transport_price: number }[];
}

const Trips = () => {
    const params = useParams();
    const tripId = params?.id as string;

    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [completedCheckpoints, setCompletedCheckpoints] = useState<string[]>([]);
    const [activeCheckpoint, setActiveCheckpoint] = useState<Checkpoint | null>(null);

    useEffect(() => {
        if (!tripId) {
            setError("Invalid Trip ID.");
            return;
        }

        const fetchCheckpoints = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:7050/api/v1/checkpoint/getbytripid", {
                    params: { tripId },
                });

                setCheckpoints(res.data.checkpoints || []);
            } catch (err: any) {
                console.error("Error fetching checkpoints:", err);
                setError(err.response?.data?.error || "Failed to load checkpoints.");
            } finally {
                setLoading(false);
            }
        };

        fetchCheckpoints();
    }, [tripId]);

    const handleNavigate = (checkpoint: Checkpoint) => {
        if (!checkpoint.source || !checkpoint.destination) {
            console.error("Missing source or destination data.");
            return;
        }
    
        const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
            checkpoint.source.latitude + "," + checkpoint.source.longitude
        )}&destination=${encodeURIComponent(
            checkpoint.destination.latitude + "," + checkpoint.destination.longitude
        )}`;
    
        window.open(url, "_blank");
    };
    

    const handleComplete = (checkpoint: Checkpoint) => {
        setCompletedCheckpoints((prev) => [...prev, checkpoint._id]);
        setActiveCheckpoint(null);
    };

    return (
        <div className={style.container}>
            <div className={style.img_div}>
                <Image src="/images/Daskboard/Trip.jpg" alt="Trip Image" height={2000} width={2000} className={style.img} />
                <p className={style.heading}>Trip Checkpoints</p>
                <div className={style.btn_div}>
                    <div className={style.btn_box}>
                        <Link href="/dashboard" className={style.btn}>Dashboard</Link>
                    </div>
                </div>
            </div>

            {loading && <p className={style.loading}>Loading checkpoints...</p>}
            {error && <p className={style.error}>{error}</p>}

            <div className={style.timeline}>
                {checkpoints.map((checkpoint, index) => {
                    const isCompleted = completedCheckpoints.includes(checkpoint._id);
                    const showLine = completedCheckpoints.length > index;

                    return (
                        <div key={checkpoint._id} className={style.timelineItem}>
                            {index > 0 && <div className={`${style.progressLine} ${showLine ? style.activeLine : ""}`}></div>}
                            <div className={`${style.card} ${isCompleted ? style.completed : ""}`}>
                                <div className={style.checkpoint}>Checkpoint {index + 1}</div>
                                <div className={style.locationbox}>
                                    <Image src="/images/Daskboard/checkpoint.png" alt="Checkpoint" height={1000} width={1000} className={style.logo} />
                                    <p className={style.data}>{checkpoint.source.name}</p>
                                </div>
                                <div className={style.locationbox}>
                                    <Image src="/images/Daskboard/start_location.png" alt="Start Location" height={1000} width={1000} className={style.logo} />
                                    <p className={style.data}>{checkpoint.destination.name}</p>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveCheckpoint(checkpoint)}
                                        title="Click to view full details"
                                        className={style.btn_checkpoint}>
                                        About
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {activeCheckpoint && (
                <div className={style.modalOverlay}>
                    <div className={style.modal}>
                        <h2 className={style.modal_heading}>Checkpoint Details</h2>
                        <div>
                            <strong className={style.modal_name}>Source</strong>
                            <p className={style.modal_value}>{activeCheckpoint.source.name}</p>
                        </div>
                        <div>
                            <strong className={style.modal_name}>Destination</strong>
                            <p className={style.modal_value}>{activeCheckpoint.destination.name}</p>
                        </div>
                        <div>
                            <strong className={style.modal_name}>Description:</strong>
                            <p className={style.modal_value}>{activeCheckpoint.description || "No description available"}</p>
                        </div>
                        <p className={style.modal_name}>Transport Budget</p>
                        <ul>
                            {activeCheckpoint.transport_budget.map((transport, idx) => (
                                <li key={idx} className={style.modal_transport}>
                                    <div className={style.div}>
                                        <p className={style.transportname}>Category</p>
                                        <p className={style.modal_values}>{transport.category}</p>
                                    </div>
                                    <div className={style.div}>
                                        <p className={style.transportname}>Type</p>
                                        <p className={style.modal_values}>{transport.transport_type}</p>
                                    </div>
                                    <div className={style.div}>
                                        <p className={style.transportname}>Price</p>
                                        <p className={style.modal_values}>₹{transport.transport_price}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className={style.modalButtons}>
                            <button className={style.navigateButton} onClick={() => handleNavigate(activeCheckpoint)}>
                                Navigate
                            </button>
                            <button className={style.completeButton} onClick={() => handleComplete(activeCheckpoint)}>
                                ✅ Complete
                            </button>
                            <button className={style.closeButton} onClick={() => setActiveCheckpoint(null)}>
                                ❌ Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trips;
