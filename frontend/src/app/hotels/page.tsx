"use client";

import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useSearchParams } from "next/navigation";
import style from "./hotels.module.css";
import Link from "next/link";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const libraries: ("places")[] = ["places"];
const mapContainerStyle = { width: "100%", height: "500px" };

export default function Hotels() {
    const searchParams = useSearchParams();
    const tripId = searchParams.get("tripId");
    const checkpointId = searchParams.get("checkpointId");

    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [hotels, setHotels] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<any>(null);
    const [formData, setFormData] = useState({
        trip_id: tripId,
        checkpoint_id: checkpointId,
        name: selectedHotel,
        location: { latitude: 0, longitude: 0 },
        rating: 3.0,
        description: "",
        pricePerNight: [{ hotel_type: "", price: 0 }],
        contact: "",
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [ratingFilter, setRatingFilter] = useState(0);
    const [distanceFilter, setDistanceFilter] = useState(3000);

    const { isLoaded } = useJsApiLoader({ googleMapsApiKey: API_KEY || "", libraries });

    useEffect(() => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
            },
            (error) => console.error("Error getting location", error)
        );
    }, []);

    useEffect(() => {
        if (!isLoaded || !location) return;
        fetchHotels(location.lat, location.lng, distanceFilter);
    }, [isLoaded, location, distanceFilter]);

    const fetchHotels = (lat: number, lng: number, radius: number) => {
        if (!window.google?.maps?.places) return;
        const service = new window.google.maps.places.PlacesService(document.createElement("div"));
        const request = { location: new window.google.maps.LatLng(lat, lng), radius, type: "lodging" };
        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setHotels(results || []);
            } else {
                console.error("Failed to fetch hotels", status);
            }
        });
    };

    const filteredHotels = hotels.filter(
        (hotel) =>
            hotel.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
            hotel.rating >= ratingFilter
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedFormData = {
            ...formData,
            trip_id: tripId,
            checkpoint_id: checkpointId,
            name: selectedHotel,
            location: location ? { latitude: location.lat, longitude: location.lng } : { latitude: 0, longitude: 0 },
        };

        console.log("Submitting Form Data:", updatedFormData);

        try {
            const response = await axios.post(
                "http://localhost:7050/api/v1/hotel/create",
                updatedFormData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                console.log("Hotel saved successfully:", response.data);
            } else {
                console.error("Unexpected response status:", response.status, response.data);
            }
        } catch (error) {
            console.error("Error submitting form:", error.response?.data || error.message);
        }

        setShowForm(false);
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            trip_id: tripId,
            checkpoint_id: checkpointId,
            name: selectedHotel,
        }));
    }, [tripId, checkpointId, selectedHotel]);



    if (!isLoaded) return <p>Loading map...</p>;

    return (
        <div className={style.main}>
            <h1 className={style.heading}>Discover Nearby Stays</h1>

            {/* Google Map */}
            <GoogleMap center={location || { lat: 0, lng: 0 }} zoom={13} mapContainerStyle={mapContainerStyle}>
                {location && (
                    <Marker
                        position={location}
                        title="Your Location"
                        icon={{
                            url: "/images/Hotel/mylocation.png",
                            scaledSize: new (window.google?.maps?.Size || class {
                                constructor() { }
                            })(50, 50),
                        }}
                    />
                )}
                {filteredHotels.map((hotel) => (
                    <Marker
                        key={hotel.place_id}
                        position={{
                            lat: hotel.geometry.location.lat(),
                            lng: hotel.geometry.location.lng(),
                        }}
                        title={hotel.name}
                        icon={{
                            url: "/images/Hotel/Marker.png",
                            scaledSize: new (window.google?.maps?.Size || class {
                                constructor() { }
                            })(40, 40),
                        }}
                    />
                ))}
            </GoogleMap>

            {/* Search and Filters */}
            <div className={style.container}>
                <div className={style.search_box}>
                    <input
                        type="text"
                        placeholder="Enter Hotel Name"
                        className={style.input}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select className={style.filter} onChange={(e) => setRatingFilter(Number(e.target.value))}>
                        <option value={0}>All Ratings</option>
                        <option value={3}>3+ Stars</option>
                        <option value={4}>4+ Stars</option>
                    </select>
                    <select className={style.filter} onChange={(e) => setDistanceFilter(Number(e.target.value))}>
                        <option value={3000}>Within 3 km</option>
                        <option value={5000}>Within 5 km</option>
                        <option value={10000}>Within 10 km</option>
                    </select>
                    <p className={style.hotels_size}>{filteredHotels.length} hotels</p>
                </div>
            </div>

            {/* Hotel List */}
            <div className={style.hotels_div}>
                <div className={style.hotels_boxes}>
                    {filteredHotels.map((hotel) => (
                        <div key={hotel.place_id} className={style.hotel_box}>
                            <h2 className={style.hotel_name}>{hotel.name}</h2>
                            <p className={style.hotel_map}>🗺️ {hotel.vicinity}</p>
                            <p className={style.hotel_rating}>⭐ {hotel.rating || "No Rating"}</p>
                            <div className={style.hotel_button}>
                                <Link
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${hotel.geometry.location.lat()},${hotel.geometry.location.lng()}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Get Directions
                                </Link>
                                <Link
                                    href={`https://www.google.com/maps/place/?q=place_id:${hotel.place_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    View Website
                                </Link>
                            </div>
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setSelectedHotel(hotel.name)
                                }}
                                className="mt-3 w-full bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Open Form
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className={style.form_div}>
                        <h2 className={style.form_heading}>Create Hotel Point</h2>
                        <form onSubmit={handleSubmit} className={style.form}>
                            <label>
                                <p className={style.content}>Hotel Name</p>
                                <input
                                    type="text"
                                    name="name"
                                    value={selectedHotel}
                                    onChange={handleChange}
                                    className={style.input}
                                    readOnly
                                />
                            </label>

                            <label >
                                <p className={style.content}>Rating</p>
                                <input
                                    type="number"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    className={style.input}
                                    min="1"
                                    max="5"
                                    step="0.1"
                                />
                            </label>

                            <label >
                                <p className={style.content}>Description</p>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={style.textarea}
                                ></textarea>
                            </label>

                            <label >
                                <p className={style.content}>Hotel Type</p>
                                <select
                                    name="hotel_type"
                                    value={formData.pricePerNight[0]?.hotel_type || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            pricePerNight: [{ ...prev.pricePerNight[0], hotel_type: e.target.value }],
                                        }))
                                    }
                                    className={style.input}
                                >
                                    <option value="">Select the type</option>
                                    <option value="luxury">Luxury</option>
                                    <option value="3-star">3-star</option>
                                    <option value="1-star">1-star</option>
                                    <option value="dormitory">Dormitory</option>
                                </select>
                            </label>

                            <label >
                                <p className={style.content}>Price (per night)</p>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.pricePerNight[0]?.price || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            pricePerNight: [{ ...prev.pricePerNight[0], price: Number(e.target.value) }],
                                        }))
                                    }
                                    className={style.input}
                                    min="0"
                                />
                            </label>

                            <label >
                                <p className={style.content}>Contact</p>
                                <input
                                    type="text"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    className={style.input}
                                />
                            </label>

                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
