"use client";

import { useState, useEffect } from "react";

interface Location {
    lat: number;
    lng: number;
    name: string;
}

const useLocation = () => {
    const [location, setLocation] = useState<Location | null>(null);
    const [tripId, setTripId] = useState<string | null>(null);

    useEffect(() => {
        const storedLocation = localStorage.getItem("userLocation");
        if (storedLocation) {
            setLocation(JSON.parse(storedLocation));
        }

        const storedTripId = localStorage.getItem("tripId");
        if (storedTripId) {
            setTripId(storedTripId);
        }
    }, []);

    const saveLocation = (newLocation: Location) => {
        setLocation(newLocation);
        localStorage.setItem("userLocation", JSON.stringify(newLocation));
        console.log(location)
    };

    const saveTripId = (id: string) => {
        setTripId(id);
        localStorage.setItem("tripId", id);
    };

    return { location, saveLocation, tripId, saveTripId };
};

export default useLocation;
