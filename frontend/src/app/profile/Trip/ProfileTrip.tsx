import { useEffect, useState } from "react";
import axios from "axios";
import style from "./ProfileTrip.module.css";
import useData from "@/hook/useData";
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

const ProfileTrip = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useData();
    const router = useRouter();
    const [isGallery, setIsGallery] = useState<boolean>(false);
    const [isUrl, setIsUrl] = useState<string>("");
    const [uploadedData, setUploadedData] = useState<{
        cover_image?: string;
        image?: string[];
    }>({});

    useEffect(() => {
        if (!userId) return;

        const fetchTrips = async () => {
            try {
                const response = await axios.get("http://localhost:7050/api/v1/trip/getbyuserid", {
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
        document.body.style.overflow = isGallery ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isGallery]);

    const openGallery = (trip: Trip) => {
        const validImages = trip.image?.filter(img => img && img.trim() !== "") || [];

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

    if (loading) return <div>Loading trips...</div>;

    return (
        <div className={style.main}>
            <div className={style.container}>
                {trips.map((trip) => (
                    <div key={trip._id} className={style.tripCard}>
                        <div className={style.imageWrapper}>
                            <img
                                src={trip.cover_image || "/images/RedBackground.webp"}
                                alt="Cover"
                                className={style.image}
                            />
                        </div>
                        <div className={style.card_info}>
                            <h3 className={style.h3}>{trip.tripName}</h3>
                            <div className={style.info_box}><p className={style.name}>City</p> <span className={style.value}>{trip.city}</span></div>
                            <div className={style.info_box}><p className={style.name}>State</p><span className={style.value}>{trip.state}</span></div>
                            <div className={style.info_box}><p className={style.name}>Budget</p><span className={style.value}>₹{trip.TotalBudget ?? 'N/A'}</span> </div>
                            <div className={style.buttonGroup}>
                                <button className={style.button} onClick={() => router.push(`/dashboard/trips/${trip._id}`)}>About</button>
                                <button className={style.button} onClick={() => openGallery(trip)}>Gallery</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isGallery && (
                <div className={style.modalBackdrop}>
                    <div className={style.photo_div}>
                        <img
                            src={isUrl || "/images/RedBackground.webp"}
                            alt="Selected"
                            className={style.image_show}
                        />
                        <div className={style.small_image_div}>
                            {uploadedData.image && uploadedData.image.length > 0 && (
                                <div className={style.thumbnail_wrapper}>
                                    {uploadedData.image.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url}
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
                    <FontAwesomeIcon
                        icon={faTimes}
                        className={style.cross_icon}
                        onClick={closeGallery}
                    />
                </div>
            )}
        </div>
    );
};

export default ProfileTrip;
