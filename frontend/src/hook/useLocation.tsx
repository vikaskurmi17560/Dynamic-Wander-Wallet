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
  const [isTripEnd, setIsTripEnd] = useState<boolean>(false);

  const updateFromLocalStorage = () => {
    const storedLocation = localStorage.getItem("userLocation");
    const storedTripId = localStorage.getItem("tripId");
    const storedCheckpoint = localStorage.getItem("isCheckpoint");
    const storedTripEnd = localStorage.getItem("isTripEnd");

    setLocation(storedLocation ? JSON.parse(storedLocation) : null);
    setTripId(storedTripId || null);
    setIsCheckpoint(storedCheckpoint === "true");
    setIsTripEnd(storedTripEnd === "true"); 
  };

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

  const toggleTripEnd = () => {
    const newState = !isTripEnd;
    localStorage.setItem("isTripEnd", newState.toString()); 
    setIsTripEnd(newState);
    window.dispatchEvent(new Event("storage"));
  };

  return { 
    location, 
    saveLocation, 
    tripId, 
    saveTripId, 
    isCheckpoint, 
    isTripEnd, 
    toggleCheckpoint, 
    toggleTripEnd 
  };
};

export default useLocation;
