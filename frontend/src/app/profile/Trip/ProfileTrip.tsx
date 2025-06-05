import { useEffect, useState } from "react";
import axios from "axios";
import style from "./ProfileTrip.module.css";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface Trip {
    _id: string;
    tripName: string;
    source: string;
    destination: string;
    state: string;
    city: string;
    tripDate?: string;
    TotalBudget?: number;
    description?: string;
    category?: string;
    days?: number;
    cover_image?: string;
    image?: string[];
}

interface ProfileTripProps {
    isDisabled: boolean;
    userId: string;
}

const ProfileTrip: React.FC<ProfileTripProps> = ({ isDisabled, userId }) => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [isGallery, setIsGallery] = useState(false);
    const [isUrl, setIsUrl] = useState("");
    const [uploadedData, setUploadedData] = useState<{
        cover_image?: string;
        image?: string[];
    }>({});
    const [isSetting, setIsSetting] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchTrips = async () => {
            try {
                const response = await axios.get("https://dynamic-wander-wallet.onrender.com/api/v1/trip/getbyuserid", {
                    params: { userId },
                });
                setTrips(response.data.trips || []);
            } catch (error) {
                console.error("Error fetching trips:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [userId]);

    useEffect(() => {
        if (typeof document !== "undefined") {
            document.body.style.overflow = isGallery ? "hidden" : "auto";
            return () => {
                document.body.style.overflow = "auto";
            };
        }
    }, [isGallery]);

    const openGallery = (trip: Trip) => {
        const validImages = trip.image?.filter((img) => img?.trim() !== "") || [];

        if (validImages.length === 0) {
            alert("No valid photos found.");
            return;
        }

        setUploadedData({
            cover_image: trip.cover_image,
            image: validImages,
        });
        setIsUrl(validImages[0]);
        setIsGallery(true);
    };

    const closeGallery = () => {
        setIsGallery(false);
        setIsUrl("");
        setUploadedData({});
    };

    const handleDeletePost = async () => {
        if (!selectedTripId || !userId) return;

        try {
            const res = await axios.delete("https://dynamic-wander-wallet.onrender.com/api/v1/trip/delete", {
                params: { trip_id: selectedTripId },
                data: { userId },
            });

            if (res.data.success) {
                setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== selectedTripId));
            } else {
                alert("Failed to delete trip.");
            }
        } catch (error) {
            console.error("Error deleting trip:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsDelete(false);
            setSelectedTripId(null);
        }
    };

    if (loading) return <div>Loading trips...</div>;

    return (
        <div className={style.main}>
            <div className={style.container}>
                {trips.map((trip) => (
                    <div key={trip._id} className={style.tripCard}>
                        <div className={style.imageWrapper}>
                            <img
                                src={trip.cover_image || "/images/RedBackground.webp"}
                                onError={(e) => (e.currentTarget.src = "/images/RedBackground.webp")}
                                alt="Cover"
                                className={style.image}
                            />
                        </div>
                        <div className={style.card_info}>
                            <h3 className={style.h3}>{trip.tripName}</h3>
                            <div className={style.info_box}>
                                <p className={style.name}>City</p>
                                <span className={style.value}>{trip.city}</span>
                            </div>
                            <div className={style.info_box}>
                                <p className={style.name}>State</p>
                                <span className={style.value}>{trip.state}</span>
                            </div>
                            <div className={style.info_box}>
                                <p className={style.name}>Budget</p>
                                <span className={style.value}>₹{trip.TotalBudget ?? "N/A"}</span>
                            </div>
                            <div className={style.buttonGroup}>
                                <button className={style.button} onClick={() => router.push(`/dashboard/trips/${trip._id}`)}>About</button>
                                <button className={style.button} onClick={() => openGallery(trip)}>Gallery</button>
                                {!isDisabled && (
                                    <button
                                        className={style.button}
                                        onClick={() => {
                                            setSelectedTripId(trip._id);
                                            setIsSetting(true);
                                        }}
                                        disabled={isDisabled}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isSetting && (
                <div className={style.setting_div}>
                    <div className={style.setting_container}>
                        <div className={style.setting_box} style={{ color: "red" }} onClick={() => {
                            setIsDelete(true);
                            setIsSetting(false);
                        }}>
                            Delete
                        </div>
                        <div className={style.setting_box}>Edit</div>
                        <div className={style.setting_box}>Hide rating count to others</div>
                        <div className={style.setting_box}>Share to..</div>
                        <div className={style.setting_box}>Go to Trip</div>
                        <div className={style.setting_box}>About this Account</div>
                        <div className={style.setting_box} onClick={() => setIsSetting(false)}>Cancel</div>
                    </div>
                </div>
            )}

            {isDelete && selectedTripId && (
                <div className={style.setting_div}>
                    <div className={style.delete_div}>
                        <div className={style.delete_heading}>
                            <p className={style.heading_h1}>Delete post?</p>
                            <p className={style.heading_p}>Are you sure you want to delete this post?</p>
                        </div>
                        <div className={style.setting_box} style={{ color: "red" }} onClick={handleDeletePost}>Delete</div>
                        <div className={style.setting_box} onClick={() => setIsDelete(false)}>Cancel</div>
                    </div>
                </div>
            )}

            {isGallery && (
                <div className={style.modalBackdrop}>
                    <div className={style.photo_div}>
                        <img
                            src={isUrl || "/images/RedBackground.webp"}
                            onError={(e) => (e.currentTarget.src = "/images/RedBackground.webp")}
                            alt="Selected"
                            className={style.image_show}
                        />
                        <div className={style.small_image_div}>
                            {uploadedData.image?.length > 0 && (
                                <div className={style.thumbnail_wrapper}>
                                    {uploadedData.image.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url}
                                            onError={(e) => (e.currentTarget.src = "/images/RedBackground.webp")}
                                            alt={`Gallery ${idx + 1}`}
                                            style={{
                                                width: 150,
                                                height: 100,
                                                objectFit: "cover",
                                                borderRadius: 6,
                                                flexShrink: 0,
                                                cursor: "pointer",
                                                border: url === isUrl ? "4px solid white" : "none",
                                                boxShadow: url === isUrl ? "0 0 8px rgba(255,255,255,0.8)" : "none",
                                            }}
                                            onClick={() => setIsUrl(url)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <FontAwesomeIcon icon={faTimes} className={style.cross_icon} onClick={closeGallery} />
                </div>
            )}
        </div>
    );
};

export default ProfileTrip;
