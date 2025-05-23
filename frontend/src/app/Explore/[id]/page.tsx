"use client";

import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import style from "./style.module.css";
import Feedback from "./Feedback";
import TripImage from "../Components/TripImage";
import Gallery from "../Components/Gallery";
import CheckpointCard from "../Components/CheckpointCard";
import HotelAndRestaurantDetails from "../Components/HotelAndRestaurantDetails";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
    location: { name: string };
    prices: { meal_type: string; meal_price: number }[];
    description?: string;
    contact?: string;
}

const sourceIcon = new L.Icon({
    iconUrl: "/images/Trip/start_location.png",
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
});

const destinationIcon = new L.Icon({
    iconUrl: "/images/Trip/destination.png",
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
});

const Page = () => {
    const params = useParams();
    const tripId = params?.id as string;
    const router = useRouter();

    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCheckpoint, setActiveCheckpoint] = useState<Checkpoint | null>(null);
    const [isHotel, setIsHotel] = useState<Hotel[] | null>(null);
    const [isRestaurant, setIsRestaurant] = useState<Restaurant[] | null>(null);
    const [uploadedData, setUploadedData] = useState<{ cover_image?: string; image?: string[] }>({});
    const [isUrl, setIsUrl] = useState<string>("");
    const [route, setRoute] = useState<[number, number][]>([]);

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
        if (!tripId) return;

        const fetchTripData = async () => {
            try {
                const response = await axios.post("http://localhost:7050/api/v1/trip/fetch", { _id: tripId });
                const trip = response.data;
                if (!trip) return alert("Trip data not found!");

                setUploadedData({
                    cover_image: trip.cover_image || "",
                    image: trip.image || [],
                });

                if (trip.image?.length > 0) {
                    setIsUrl(trip.image[0]);
                }
            } catch (error: any) {
                console.error("Failed to fetch trip data:", error.message);
                alert("Failed to fetch trip data.");
            }
        };

        fetchTripData();
    }, [tripId]);

    const fetchRoute = async (checkpoint: Checkpoint) => {
        const API_KEY = "5b3ce3597851110001cf62487496be7882cc4062b2b2824819721e94";
        const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;

        try {
            const response = await axios.post(
                url,
                {
                    coordinates: [
                        [checkpoint.source.longitude, checkpoint.source.latitude],
                        [checkpoint.destination.longitude, checkpoint.destination.latitude],
                    ],
                },
                {
                    headers: {
                        Authorization: API_KEY,
                        "Content-Type": "application/json",
                    },
                }
            );

            const coordinates = response.data.features[0].geometry.coordinates.map(
                (coord: [number, number]) => [coord[1], coord[0]]
            );
            setRoute(coordinates);
        } catch (error) {
            console.error("Error fetching route:", error);
            setError("Failed to load route data.");
        }
    };

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
            } catch (err: any) {
                console.error("Error fetching hotel/restaurant data:", err);
            }
        };

        fetchHotelsAndRestaurants();
        fetchRoute(activeCheckpoint);
    }, [activeCheckpoint]);

    return (
        <div className={style.container}>
            <TripImage />
            {loading && <p className={style.loading}>Loading checkpoints...</p>}
            {error && <p className={style.error}>{error}</p>}

            <Gallery uploadedData={uploadedData} setIsUrl={setIsUrl} isUrl={isUrl} />

            <div className={style.timeline_feedback}>
                <div className={style.timeline}>
                    {checkpoints.map((checkpoint, index) => (
                        <CheckpointCard
                            key={checkpoint._id}
                            checkpoint={checkpoint}
                            index={index}
                            onViewDetails={(checkpoint) => setActiveCheckpoint(checkpoint)}
                        />
                    ))}
                </div>
                <Feedback tripId={tripId} />
            </div>

            {activeCheckpoint && (
                <div className={style.modalOverlay}>
                    <div className={style.map_container}>
                        {/* <h2 className={style.map_heading}>Map View</h2> */}
                        <div className={style.map_div}>
                            <MapContainer
                                center={[activeCheckpoint.source.latitude, activeCheckpoint.source.longitude]}
                                zoom={9}
                                className={style.map}

                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[activeCheckpoint.source.latitude, activeCheckpoint.source.longitude]} icon={sourceIcon}>
                                    <Popup><strong>Source:</strong> {activeCheckpoint.source.name}</Popup>
                                </Marker>
                                <Marker position={[activeCheckpoint.destination.latitude, activeCheckpoint.destination.longitude]} icon={destinationIcon}>
                                    <Popup><strong>Destination:</strong> {activeCheckpoint.destination.name}</Popup>
                                </Marker>
                                {route.length > 0 && <Polyline positions={route} color="blue" weight={4} />}
                            </MapContainer>
                        </div>
                    </div>

                    <div className={style.modal}>
                        <h2 className={style.modal_heading}>Checkpoint Details</h2>
                        <div><strong className={style.modal_name}>Source</strong><p className={style.modal_value}>{activeCheckpoint.source.name}</p></div>
                        <div><strong className={style.modal_name}>Destination</strong><p className={style.modal_value}>{activeCheckpoint.destination.name}</p></div>
                        <div><strong className={style.modal_name}>Description:</strong><p className={style.modal_value}>{activeCheckpoint.description || "No description available"}</p></div>

                        <strong className={style.modal_name}>Hotel</strong>
                        <HotelAndRestaurantDetails
                            isHotel={isHotel}
                            isRestaurant={isRestaurant}
                        />

                        <p className={style.modal_name}>Transport Budget</p>
                        <ul>
                            {activeCheckpoint.transport_budget.map((transport, idx) => (
                                <li key={idx} className={style.modal_transport}>
                                    <div className={style.div}><p className={style.transportname}>Category</p><p className={style.modal_values}>{transport.category}</p></div>
                                    <div className={style.div}><p className={style.transportname}>Type</p><p className={style.modal_values}>{transport.transport_type}</p></div>
                                    <div className={style.div}><p className={style.transportname}>Price</p><p className={style.modal_values}>₹{transport.transport_price}</p></div>
                                </li>
                            ))}
                        </ul>

                        <div className={style.modalButtons}>
                            <button
                                className={style.btn_checkpoint}
                                onClick={() => {
                                    const { source, destination } = activeCheckpoint;
                                    router.push(
                                        `/explore/${tripId}/NavigationMap?srcLat=${source.latitude}&srcLng=${source.longitude}&destLat=${destination.latitude}&destLng=${destination.longitude}`
                                    );
                                }}
                            >
                                Navigate
                            </button>
                            <button className={style.completeButton}>✅ Complete</button>
                            <button className={style.closeButton} onClick={() => setActiveCheckpoint(null)}>❌ Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
