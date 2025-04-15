"use client";
import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import style from "./style.module.css";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Feedback from "./Feedback";

interface Checkpoint {
    _id: string;
    source: { name: string; latitude: number; longitude: number };
    destination: { name: string; latitude: number; longitude: number };
    description: string;
    transport_budget: { category: string; transport_type: string; transport_price: number }[];
    Total_checkpointBudget: number;
}
interface Hotel {
    name: string;
    rating: number;
    description: string;
    contact: string;
    pricePerNight: { hotel_type: string; price: number }[];
}

interface Restaurant {
    restaurant_name: string;
    rating: number;
    location: {
        name: string;
    };
    prices: {
        meal_type: string;
        meal_price: number;
    }[];
    description?: string;
    contact?: string;
}


const page = () => {
    const params = useParams();
    const tripId = params?.id as string;

    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [completedCheckpoints, setCompletedCheckpoints] = useState<string[]>([]);
    const [activeCheckpoint, setActiveCheckpoint] = useState<Checkpoint | null>(null);

    const [isHotel, setIsHotel] = useState<Hotel[] | null>(null);
    const [isHotelDetail, setIsHotelDetail] = useState<Hotel | null>(null);
    const [isRestaurant, setIsRestaurant] = useState<Restaurant[] | null>(null);
    const [isRestaurantDetail, setIsRestaurantDetail] = useState<Restaurant | null>(null);
    const [uploadedData, setUploadedData] = useState<{
        cover_image?: string;
        image?: string[];
    }>({});
    const [isGallery, setIsGallery] = useState<boolean>(false);
    const [isUrl, setIsUrl] = useState<string>("");

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

    useEffect(() => {
        if (!activeCheckpoint?._id) return;

        const fetchHotelsAndRestaurants = async () => {
            try {
                const [hotelRes, restaurantRes] = await Promise.all([
                    axios.get("http://localhost:7050/api/v1/hotel/getbycheckpointid", {
                        params: { checkpointId: activeCheckpoint._id },
                    }),
                    axios.get("http://localhost:7050/api/v1/restaurant/getcheckpoint", {
                        params: { checkpoint_id: activeCheckpoint._id },
                    }),
                ]);

                setIsHotel(hotelRes.data.hotels || []);
                setIsRestaurant(restaurantRes.data.restaurants || []);
                console.log("Hotels:", hotelRes.data.hotels);
                console.log("Restaurants:", restaurantRes.data.restaurants);
            } catch (err: any) {
                console.error("Error fetching hotel/restaurant data:", err);
            }
        };

        fetchHotelsAndRestaurants();
    }, [activeCheckpoint]);

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


    useEffect(() => {
        if (tripId) fetchTripData();
    }, [tripId]);
    useEffect(() => {
        if (isGallery) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isGallery]);
    const fetchTripData = async () => {
        try {
            const response = await axios.post("http://localhost:7050/api/v1/trip/fetch", {
                _id: tripId,
            });

            const trip = response.data;
            if (!trip) return alert("Trip data not found!");

            setUploadedData({
                cover_image: trip.cover_image || "",
                image: trip.image || [],
            });

            if (trip.image && trip.image.length > 0) {
                setIsUrl(trip.image[0]);
            }

        } catch (error: any) {
            console.error("Failed to fetch trip data:", error.message);
            alert("Failed to fetch trip data.");
        }
    };

    const handleGallery = () => {
        if (!uploadedData.image || uploadedData.image.length === 0) {
            alert("No photos available.");
            return;
        }

        const validImages = uploadedData.image.filter(img => img && img.trim() !== "");

        if (validImages.length === 0) {
            alert("No valid photos found.");
            return;
        }

        setIsUrl(validImages[0]);
        setIsGallery((prev) => !prev);
    };

    return (
        <div className={style.container}>
            <div className={style.img_div}>
                <Image src="/images/Daskboard/Trip.jpg" alt="Trip Image" height={2000} width={2000} className={style.img} />
                <p className={style.heading}>Trip Checkpoints</p>
                <div className={style.btn_div}>
                    <div className={style.btn_box}>
                        <Link href="/explore" className={style.btn}>Explore</Link>
                    </div>
                </div>
            </div>

            {loading && <p className={style.loading}>Loading checkpoints...</p>}
            {error && <p className={style.error}>{error}</p>}

            <div className={style.gallery}>
                <button className={style.button} onClick={handleGallery}>
                    🖼️ <span>Gallery</span>
                </button>
            </div>

            {isGallery && (
                <div className={style.watch_div}>
                    <div className={style.photo_div}>
                        <img
                            src={isUrl}
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
                        onClick={handleGallery}
                    />
                </div>
            )}
            <div className={style.timeline_feedback}>
                <div className={style.timeline}>
                    {checkpoints.map((checkpoint, index) => {
                        const isCompleted = completedCheckpoints.includes(checkpoint._id);
                        const showLine = completedCheckpoints.length > index;

                        return (
                            <div key={checkpoint._id} className={style.timelineItem}>
                                {index > 0 && (
                                    <div
                                        className={`${style.progressLine} ${showLine ? style.activeLine : ""
                                            }`}
                                    ></div>
                                )}
                                <div
                                    className={`${style.card} ${isCompleted ? style.completed : ""}`}
                                >
                                    <div className={style.header}>
                                        <h3 className={style.h3}>Checkpoint {index + 1}</h3>
                                    </div>

                                    <div className={style.locationbox}>
                                        <Image
                                            src="/images/Daskboard/checkpoint.png"
                                            alt="Checkpoint"
                                            height={24}
                                            width={24}
                                            className={style.logo}
                                        />
                                        <p className={style.locationbox_name}>{checkpoint.source.name}</p>
                                    </div>

                                    <div className={style.locationbox}>
                                        <Image
                                            src="/images/Daskboard/start_location.png"
                                            alt="Destination"
                                            height={24}
                                            width={24}
                                            className={style.logo}
                                        />
                                        <p className={style.locationbox_name}>{checkpoint.destination.name}</p>
                                    </div>

                                    <div className={style.locationbox}>
                                        <Image
                                            src="/images/Daskboard/budget.png"
                                            alt="Budget"
                                            height={24}
                                            width={24}
                                            className={style.logo}
                                        />
                                        <p className={style.locationbox_name}>₹{checkpoint.Total_checkpointBudget}</p>
                                    </div>
                                    <div className={style.buttonWrapper}>
                                        <button
                                            type="button"
                                            onClick={() => setActiveCheckpoint(checkpoint)}
                                            title="Click to view full details"
                                            className={style.btn_checkpoint}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Feedback
                    tripId={tripId} />
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
                        <strong className={style.modal_name}>Hotel</strong>
                        <div className={style.hotel_buttons}>
                            {isHotel?.length ? (
                                isHotel.map((hotel, idx) => (
                                    <p key={idx} className={style.hotel_btn} onClick={() => setIsHotelDetail(hotel)}>
                                        {idx + 1}
                                    </p>
                                ))
                            ) : (
                                <p className={style.modal_value}>No hotels found</p>
                            )}
                        </div>
                        <div>
                            {isHotelDetail && (
                                <div className={style.hotel_details}>
                                    <div className={style.hotel_box}>
                                        <h3 className={style.hotel_heading}>Hotel Detail</h3>
                                        <div className={style.box}>
                                            <span className={style.hotel_name}>Hotel Name</span><span className={style.hotel_value}>{isHotelDetail.name}</span>
                                        </div>
                                        <div className={style.box}>
                                            <span className={style.hotel_name}>Hotel Rating ⭐</span><span className={style.hotel_value}>{isHotelDetail.rating}</span>
                                        </div>
                                        <div className={style.box}>
                                            <span className={style.hotel_name}>Hotel Type</span><span className={style.hotel_value}>{isHotelDetail.pricePerNight[0].hotel_type || "N/A"}</span>
                                        </div>
                                        <div className={style.box}>
                                            <span className={style.hotel_name}>Hotel (one night price)</span><span className={style.hotel_value}>₹{isHotelDetail.pricePerNight[0].price || "N/A"}</span>
                                        </div>
                                        <div className={style.box}>
                                            <span className={style.hotel_name}>Description</span><span className={style.hotel_value}>{isHotelDetail.description || "N/A"}</span>
                                        </div>
                                        <div className={style.box}>
                                            <span className={style.hotel_name}>Contact</span><span className={style.hotel_value}>{isHotelDetail.contact || "N/A"}</span>
                                        </div>
                                        <FontAwesomeIcon icon={faTimes} className={style.cross} onClick={() => setIsHotelDetail(null)} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <strong className={style.modal_name}>Restaurant</strong>
                        <div className={style.hotel_buttons}>
                            {isRestaurant?.length ? (
                                isRestaurant.map((restaurant, idx) => (
                                    <p key={idx} className={style.hotel_btn} onClick={() => setIsRestaurantDetail(restaurant)}>
                                        {idx + 1}
                                    </p>
                                ))
                            ) : (
                                <p className={style.modal_value}>No Restaurant found</p>
                            )}
                        </div>
                        {isRestaurantDetail && (
                            <div className={style.hotel_details}>
                                <div className={style.hotel_box}>
                                    <h3 className={style.hotel_heading}>Restaurant Detail</h3>
                                    <div className={style.box}>
                                        <span className={style.hotel_name}>Restaurant Name</span><span className={style.hotel_value}>{isRestaurantDetail.restaurant_name}</span>
                                    </div>
                                    <div className={style.box}>
                                        <span className={style.hotel_name}>Restaurant Rating ⭐</span><span className={style.hotel_value}>{isRestaurantDetail.rating}</span>
                                    </div>
                                    <div className={style.box}>
                                        <span className={style.hotel_name}>Location</span><span className={style.hotel_value}>{isRestaurantDetail.location.name}</span>
                                    </div>
                                    <div className={style.box}>
                                        <span className={style.hotel_name}>Meal Type</span><span className={style.hotel_value}>{isRestaurantDetail.prices[0].meal_type || "N/A"}</span>
                                    </div>
                                    <div className={style.box}>
                                        <span className={style.hotel_name}>Meal</span><span className={style.hotel_value}>₹{isRestaurantDetail.prices[0].meal_price || "N/A"}</span>
                                    </div>
                                    <div className={style.box}>
                                        <span className={style.hotel_name}>Description</span><span className={style.hotel_value}>{isRestaurantDetail.description || "N/A"}</span>
                                    </div>
                                    <div className={style.box}>
                                        <span className={style.hotel_name}>Contact</span><span className={style.hotel_value}>{isRestaurantDetail.contact || "N/A"}</span>
                                    </div>
                                    <FontAwesomeIcon icon={faTimes} className={style.cross} onClick={() => setIsRestaurantDetail(null)} />
                                </div>
                            </div>
                        )}
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

export default page;
