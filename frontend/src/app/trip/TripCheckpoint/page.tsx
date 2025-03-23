"use client";

import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import style from "./Checkpoint.module.css";
import useLocation from "../../../hook/useLocation";
import Checkpoints from "../CHECKPOINTS/Checkpoints";

const containerStyle = {
    width: "100%",
    height: "100%",
};

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
const defaultLocation = { lat: 28.7041, lng: 77.1025, name: "Delhi, India" };

const Checkpoint = () => {
    const { location , saveLocation } = useLocation();
    const searchParams = useSearchParams();
    const tripName = searchParams.get("tripName") || "";
    const destination = searchParams.get("destination") || "";
    const [loading, setLoading] = useState(false);
    const [currentLocation, setCurrentLocation] = useState("");
    const [mapLocation, setMapLocation] = useState(defaultLocation);

    const handleFindLocation = async () => {
        setLoading(true);

        if (!("geolocation" in navigator)) {
            alert("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                let locationName = "Live Location";
                try {
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
                    );
                    const data = await response.json();

                    if (data.results.length > 0) {
                        locationName = data.results[0].formatted_address;
                    }
                } catch (error) {
                    console.error("Error fetching location name:", error);
                }

                const newLocation = { lat: latitude, lng: longitude, name: locationName };
                setCurrentLocation(locationName);
                saveLocation(newLocation);
                setMapLocation(newLocation);
                setLoading(false);
            },
            (error) => {
                alert(`Error getting location: ${error.message}`);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <>
            <div className={style.container}>
                <div className={style.image_div}>
                    <Image src="/images/Trip/First.jpg" height={3000} width={3000} alt="Trip Image" className={style.image} />
                    <div className={style.upper_div}>
                        <p className={style.heading}>Your Trip Details</p>
                        <p className={style.desp}>Plan and explore checkpoints</p>
                    </div>
                    <div className={style.box}>
                        <div>
                            <p className={style.name}>Trip Name</p>
                            <input name="tripname" value={tripName} readOnly className={style.input} />
                        </div>
                        <div>
                            <p className={style.name}>Source</p>
                            <input name="destination" value={destination} readOnly className={style.input} />
                        </div>
                        <div>
                            <p className={style.name}>Location</p>
                            <input placeholder="Click 'Find' for location" value={currentLocation || "Click 'Find' for location"} readOnly className={style.input} />
                        </div>
                        <div>
                            <button className={style.btn} onClick={handleFindLocation} disabled={loading}>
                                {loading ? "Finding..." : "Find"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.mapbox}>
                <div className={style.container_map}>
                    <h2 className={style.map_heading}>Your Travel Route</h2>
                    <div className={style.road_container}>
                        <div className={style.road}></div>
                        <div className={style.car}>🚗</div>
                    </div>
                </div>
                <div className={style.map}>
                    <LoadScript googleMapsApiKey={GOOGLE_API_KEY}>
                        <GoogleMap mapContainerStyle={containerStyle} center={{ lat: mapLocation.lat, lng: mapLocation.lng }} zoom={14}>
                            <Marker position={{ lat: mapLocation.lat, lng: mapLocation.lng }} />
                        </GoogleMap>
                    </LoadScript>
                </div>
            </div>
            <Checkpoints />
        </>
    );
};

export default Checkpoint;
