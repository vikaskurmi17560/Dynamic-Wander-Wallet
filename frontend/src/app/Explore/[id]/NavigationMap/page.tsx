'use client';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const NavigationMap = () => {
    const searchParams = useSearchParams();
    const mapRef = useRef<L.Map | null>(null);
    const userMarkerRef = useRef<L.Marker | null>(null);
    const polylineRef = useRef<L.Polyline | null>(null);
    const [distance, setDistance] = useState<number>(0);

    const srcLat = parseFloat(searchParams.get('srcLat') || '0');
    const srcLng = parseFloat(searchParams.get('srcLng') || '0');
    const destLat = parseFloat(searchParams.get('destLat') || '0');
    const destLng = parseFloat(searchParams.get('destLng') || '0');

    // Custom icons
    const userIcon = new L.Icon({
        iconUrl: '/start_location.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    });

    const destinationIcon = new L.Icon({
        iconUrl: '/destination_icon.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    });

    // Haversine formula to calculate distance
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        mapRef.current = L.map('map').setView([srcLat, srcLng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapRef.current);

        // Source marker
        L.marker([srcLat, srcLng], { icon: userIcon }).addTo(mapRef.current).bindPopup('Start Point');

        // Destination marker
        L.marker([destLat, destLng], { icon: destinationIcon }).addTo(mapRef.current).bindPopup('Destination');

        // Route line (red)
        const polyline = L.polyline([[srcLat, srcLng], [destLat, destLng]], { color: 'red' }).addTo(mapRef.current);
        polylineRef.current = polyline;

        // Real-time user tracking
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // Update marker or create one
                if (userMarkerRef.current) {
                    userMarkerRef.current.setLatLng([latitude, longitude]);
                } else {
                    userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon }).addTo(mapRef.current!);
                }

                const dist = calculateDistance(latitude, longitude, destLat, destLng);
                setDistance(dist);

                if (dist < 0.2) {
                    alert('You are near your destination!');
                }
            },
            (err) => {
                console.error('Geolocation error:', err);
            },
            {
                enableHighAccuracy: true,
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
            if (mapRef.current) mapRef.current.remove();
        };
    }, [srcLat, srcLng, destLat, destLng]);

    return (
        <div>
            <div id="map" style={{ height: '90vh', width: '100%' }} />
            <div style={{ textAlign: 'center', marginTop: 10 }}>
                <strong>Distance to Destination:</strong> {distance.toFixed(2)} km
            </div>
        </div>
    );
};

export default NavigationMap;
