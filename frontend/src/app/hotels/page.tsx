"use client";

import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useSearchParams } from "next/navigation";
import style from "./hotels.module.css";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [ratingFilter, setRatingFilter] = useState(0);
    const [distanceFilter, setDistanceFilter] = useState(3000);

    const { isLoaded } = useJsApiLoader({ googleMapsApiKey: API_KEY || "", libraries });

    // Effect to get user's location
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

    // Effect to fetch hotels when location changes
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
                {filteredHotels.map((hotel) => (
                    <div key={hotel.place_id} className="border rounded-lg shadow-lg p-4">
                        <h2 className="text-lg font-semibold">{hotel.name}</h2>
                        <p>📍 {hotel.vicinity}</p>
                        <p className="text-yellow-500">⭐ {hotel.rating || "No Rating"}</p>
                        <div className="mt-3 flex justify-between">
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${hotel.geometry.location.lat()},${hotel.geometry.location.lng()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Get Directions
                            </a>
                            <a
                                href={`https://www.google.com/maps/place/?q=place_id:${hotel.place_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                View Website
                            </a>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-3 w-full bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Open Form
                        </button>
                    </div>
                ))}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Fill the Form</h2>
                        <form>
                            <label className="block mb-2">
                                Name:
                                <input type="text" className="w-full border p-2 rounded mt-1" />
                            </label>
                            <label className="block mb-2">
                                Email:
                                <input type="email" className="w-full border p-2 rounded mt-1" />
                            </label>
                            <label className="block mb-2">
                                Phone:
                                <input type="tel" className="w-full border p-2 rounded mt-1" />
                            </label>
                            <div className="flex justify-end mt-4">
                                <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={() => setShowForm(false)}>
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
