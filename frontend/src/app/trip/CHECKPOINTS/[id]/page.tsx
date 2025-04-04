"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import style from "./style.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

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

const CheckpointDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const [checkpoint, setCheckpoint] = useState<any>(null);
    const [route, setRoute] = useState<[number, number][]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isHotel, setIsHotel] = useState<any>(null);
    const [isHotelDetail, setIsHotelDetail] = useState<any>(null);
    const [isRestaurant, setIsRestaurant] = useState<any>(null);
    const [isRestaurantDetail, setIsRestaurantDetail] = useState<any>(null);


    useEffect(() => {
        if (!params || !params.id) return;

        async function fetchCheckpointDetails() {
            try {
                const response = await axios.get("http://localhost:7050/api/v1/checkpoint/getbyid", {
                    params: { _id: params.id },
                });

                const hotel_res = await axios.get("http://localhost:7050/api/v1/hotel/getbycheckpointid", {
                    params: { checkpointId: params.id },
                });

                const restaurant_res = await axios.get("http://localhost:7050/api/v1/restaurant/getcheckpoint", {
                    params: { checkpoint_id: params.id },
                });
                setIsHotel(hotel_res.data.hotels);
                setIsRestaurant(restaurant_res.data.restaurants)
                console.log(restaurant_res.data.restaurants);
                console.log("Hotels Array:", hotel_res.data.hotels);

                if (response.data?.checkpoint) {
                    setCheckpoint(response.data.checkpoint);
                    fetchRoute(response.data.checkpoint.source, response.data.checkpoint.destination);
                } else {
                    setError("No checkpoint data found.");
                }
            } catch (error: any) {
                console.error("Error fetching checkpoint details:", error);
                setError(error.response?.data?.error || "Checkpoint not found");
            } finally {
                setLoading(false);
            }
        }

        fetchCheckpointDetails();
    }, [params]);

    async function fetchRoute(source: any, destination: any) {
        const API_KEY = "5b3ce3597851110001cf62487496be7882cc4062b2b2824819721e94";
        const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;

        try {
            const response = await axios.post(
                url,
                {
                    coordinates: [
                        [source.longitude, source.latitude],
                        [destination.longitude, destination.latitude],
                    ],
                },
                {
                    headers: {
                        "Authorization": API_KEY,
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
    }

    if (loading) return <p>Loading checkpoint details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!checkpoint) return <p className="text-gray-500">No checkpoint data available.</p>;

    const { source, destination } = checkpoint;

    return (
        <div className={style.main}>
            <div className={style.image_div}>
                <Image src="/images/Trip/CheckpointData.jpg" alt="Loading..." height={3000} width={3000} className={style.image} priority />
                <div className={style.heading_div}>
                    <p className={style.heading}>Checkpoint Details</p>
                </div>
                <div className={style.btn_div}>
                    <button onClick={() => router.back()}>Back to Checkpoint</button>
                </div>
            </div>
            <div className={style.map_container}>
                <h2 className={style.map_heading}>Map View</h2>
                <div className={style.map_div}>
                    <MapContainer center={[source.latitude, source.longitude]} zoom={8} className={style.map}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[source.latitude, source.longitude]} icon={sourceIcon}>
                            <Popup><strong>Source:</strong> {source.name}</Popup>
                        </Marker>
                        <Marker position={[destination.latitude, destination.longitude]} icon={destinationIcon}>
                            <Popup><strong>Destination:</strong> {destination.name}</Popup>
                        </Marker>
                        {route.length > 0 && <Polyline positions={route} color="blue" weight={4} />}
                    </MapContainer>
                </div>
            </div>
            <div className={style.about_container}>
                <div className={style.about_box}>
                    <div >
                        <h2 className={style.about_heading}>Checkpoint Details</h2>
                    </div>
                    <div className={style.div}>
                        <div>
                            <strong className={style.name}>Source</strong>
                            <p className={style.input}> {checkpoint.source?.name || "N/A"}</p>
                        </div>
                        <div>
                            <strong className={style.name}>Latitude</strong>
                            <p className={style.input}> {checkpoint.source?.latitude || "N/A"}</p>
                        </div>
                        <div>
                            <strong className={style.name}>Longitude</strong>
                            <p className={style.input}> {checkpoint.source?.longitude || "N/A"}</p>
                        </div>
                    </div>
                    <div className={style.div}>
                        <div>
                            <strong className={style.name}>Destination</strong>
                            <p className={style.input}> {checkpoint.destination?.name || "N/A"}</p>
                        </div>
                        <div>
                            <strong className={style.name}>Latitude</strong>
                            <p className={style.input}> {checkpoint.destination?.latitude || "N/A"}</p>
                        </div>
                        <div>
                            <strong className={style.name}>Longitude</strong>
                            <p className={style.input}> {checkpoint.destination?.longitude || "N/A"}</p>
                        </div>
                    </div>
                    <div>
                        <strong className={style.name}>Description</strong>
                        <p className={style.input}> {checkpoint.description || "N/A"}</p>
                    </div>
                    <div>
                        <strong className={style.name}>Hotel Details</strong>
                        <div className={style.hotel_div}>
                            {isHotel?.map((hotel, id : number) => (
                                <div
                                    className={style.uiverse}
                                    key={id}
                                    onClick={() => setIsHotelDetail(hotel)}
                                >
                                    <span className={style.tooltip}>Click for details</span>
                                    <span>Hotel</span>
                                </div>
                            ))}
                        </div>
                    </div>


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

                    <div>
                        <strong className={style.name}>Restaurant Details</strong>
                        <div className={style.hotel_div}>
                            {isRestaurant?.map((restaurant, id : number) => (
                                <div
                                    className={style.uiverse}
                                    key={id}
                                    onClick={() => setIsRestaurantDetail(restaurant)}
                                >
                                    <span className={style.tooltip}>Click for details</span>
                                    <span>Restaurant</span>
                                </div>
                            ))}
                        </div>
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
                    <div className={style.transport}>
                        <p className={style.name}>Transport</p>
                        <div className={style.transport_div}>
                            <div>
                                <strong className={style.transportname}>Category </strong>
                                <p className={style.transportvalue}> {checkpoint.transport_budget?.[0]?.category || "N/A"}</p>
                            </div>
                            <div>
                                <strong className={style.transportname}>Type</strong>
                                <p className={style.transportvalue}> {checkpoint.transport_budget?.[0]?.transport_type || "N/A"}</p>
                            </div>
                            <div>
                                <strong className={style.transportname}>Price</strong>
                                <p className={style.transportvalue}> ₹{checkpoint.transport_budget?.[0]?.transport_price || "0"}</p>
                            </div>
                            <div>
                                <strong className={style.transportname}>Extra Info</strong>
                                <p className={style.transportvalue}> {checkpoint.transport_budget?.[0]?.extra_info || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                    <div className={style.date_div}>
                        <div>
                            <strong className={style.name}>Created At</strong>
                            <p>{new Date(checkpoint?.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <strong className={style.name}>Updated At</strong>
                            <p>{new Date(checkpoint?.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckpointDetailsPage;
