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
    const [isCheckpoint, setIsCheckpoint] = useState<boolean>(false);

    // Function to update state from local storage
    const updateFromLocalStorage = () => {
        const storedLocation = localStorage.getItem("userLocation");
        const storedTripId = localStorage.getItem("tripId");
        const storedCheckpoint = localStorage.getItem("isCheckpoint");

        setLocation(storedLocation ? JSON.parse(storedLocation) : null);
        setTripId(storedTripId || null);
        setIsCheckpoint(storedCheckpoint === "true");
    };

    // Load from local storage on mount & listen for changes
    useEffect(() => {
        updateFromLocalStorage();

        const handleStorageChange = () => updateFromLocalStorage();

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const saveLocation = (newLocation: Location) => {
        localStorage.setItem("userLocation", JSON.stringify(newLocation));
        setLocation(newLocation);
        window.dispatchEvent(new Event("storage")); 
    };

    const saveTripId = (id: string) => {
        localStorage.setItem("tripId", id);
        setTripId(id);
        window.dispatchEvent(new Event("storage"));
    };

    const toggleCheckpoint = () => {
        const newState = !isCheckpoint;
        localStorage.setItem("isCheckpoint", newState.toString());
        setIsCheckpoint(newState);
        window.dispatchEvent(new Event("storage"));
    };

    return { location, saveLocation, tripId, saveTripId, isCheckpoint, toggleCheckpoint };
};

export default useLocation;
