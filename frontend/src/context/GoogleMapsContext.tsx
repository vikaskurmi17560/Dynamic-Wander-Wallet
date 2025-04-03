"use client";

import { createContext, useContext, useState } from "react";
import { LoadScript } from "@react-google-maps/api";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

const GoogleMapsContext = createContext({ loaded: false });

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <GoogleMapsContext.Provider value={{ loaded }}>
            <LoadScript googleMapsApiKey={GOOGLE_API_KEY} onLoad={() => setLoaded(true)}>
                {children}
            </LoadScript>
        </GoogleMapsContext.Provider>
    );
}

export function useGoogleMaps() {
    return useContext(GoogleMapsContext);
}
