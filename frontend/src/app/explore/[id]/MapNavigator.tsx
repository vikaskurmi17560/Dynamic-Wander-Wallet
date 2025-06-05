"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import style from "./MapNavigator.module.css";

interface Props {
  source: LatLngExpression;
  destination: LatLngExpression;
  onClose: () => void;
}

interface LocationUpdaterProps {
  setUserLocation: React.Dispatch<React.SetStateAction<LatLngExpression>>;
}

const LocationUpdater = ({ setUserLocation }: LocationUpdaterProps) => {
  const map = useMap();

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos: LatLngExpression = [latitude, longitude];
        setUserLocation(newPos);
        map.flyTo(newPos, map.getZoom());
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, setUserLocation]);

  return null;
};

const calculateDistance = (pos1: LatLngExpression, pos2: LatLngExpression): number => {
  const [lat1, lon1] = pos1 as [number, number];
  const [lat2, lon2] = pos2 as [number, number];

  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
};

export default function MapNavigator({ source, destination, onClose }: Props) {
  const [userLocation, setUserLocation] = useState<LatLngExpression>(source);
  const distanceToDest = calculateDistance(userLocation, destination);

  return (
    <div className={style.mapOverlay}>
      <div className={style.mapHeader}>
        <h3>Navigation</h3>
        <button className={style.closeBtn} onClick={onClose}>✖</button>
      </div>

      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationUpdater setUserLocation={setUserLocation} />

        <Marker position={userLocation} icon={L.icon({ iconUrl: "/user-icon.png", iconSize: [25, 41], iconAnchor: [12, 41] })} />
        <Marker position={destination} />

        <Polyline positions={[userLocation, destination]} color="red" />
      </MapContainer>

      <p className={style.distance}>
        Distance to Destination: {(distanceToDest / 1000).toFixed(2)} km
      </p>
    </div>
  );
}
