"use client";

import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import style from "./Starttrips.module.css";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import UploadImages from "../../UploadImages";

interface TransportBudget {
    category: string;
    transport_type: string;
    transport_price: number;
}

interface Location {
    name: string;
    latitude: number;
    longitude: number;
}

interface Checkpoint {
    _id: string;
    source: Location;
    destination: Location;
    description: string;
    transport_budget: TransportBudget[];
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


const Trips = () => {
    const params = useParams() as { id: string };
    const tripId = params.id;

    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [completedCheckpoints, setCompletedCheckpoints] = useState<string[]>([]);
    const [activeCheckpoint, setActiveCheckpoint] = useState<Checkpoint | null>(null);

    const [isHotel, setIsHotel] = useState<Hotel[] | null>(null);
    const [isHotelDetail, setIsHotelDetail] = useState<Hotel | null>(null);
    const [isRestaurant, setIsRestaurant] = useState<Restaurant[] | null>(null);
    const [isRestaurantDetail, setIsRestaurantDetail] = useState<Restaurant | null>(null);


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
        const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
            `${checkpoint.source.latitude},${checkpoint.source.longitude}`
        )}&destination=${encodeURIComponent(
            `${checkpoint.destination.latitude},${checkpoint.destination.longitude}`
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
            <div className={style.images_div}>
                <UploadImages tripId = {tripId} />
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
                            <strong className={style.modal_name}>Description</strong>
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
                        <div>
                            <strong className={style.modal_name}>Transport Budget</strong>
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
                        </div>

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
