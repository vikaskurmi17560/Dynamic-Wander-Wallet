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
    const [isCheckpoint, setIsCheckpoint] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("isCheckpoint") || "false");
        }
        return false;
    });

    useEffect(() => {
        const storedLocation = localStorage.getItem("userLocation");
        if (storedLocation) {
            try {
                const parsedLocation = JSON.parse(storedLocation);
                setLocation({
                    name: parsedLocation.name,
                    lat: Number(parsedLocation.lat), // Ensure it's a number
                    lng: Number(parsedLocation.lng), // Ensure it's a number
                });
            } catch (error) {
                console.error("Error parsing stored location:", error);
            }
        }

        const storedTripId = localStorage.getItem("tripId");
        if (storedTripId) setTripId(storedTripId);
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            setTimeout(() => {
                const newState = JSON.parse(localStorage.getItem("isCheckpoint") || "false");
                setIsCheckpoint(newState);
            }, 0);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const saveLocation = (newLocation: Location) => {
        const formattedLocation = {
            name: newLocation.name,
            lat: Number(newLocation.lat), // Ensure number format
            lng: Number(newLocation.lng), // Ensure number format
        };

        setLocation(formattedLocation);
        localStorage.setItem("userLocation", JSON.stringify(formattedLocation));
    };

    const saveTripId = (id: string) => {
        setTripId(id);
        localStorage.setItem("tripId", id);
    };

    const toggleCheckpoint = () => {
        setIsCheckpoint((prev) => {
            const newState = !prev;
            localStorage.setItem("isCheckpoint", JSON.stringify(newState));
            window.dispatchEvent(new Event("storage"));
            return newState;
        });
    };

    return { location, saveLocation, tripId, saveTripId, isCheckpoint, toggleCheckpoint };
};

export default useLocation;
