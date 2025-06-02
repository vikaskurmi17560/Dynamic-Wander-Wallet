'use client';

import { useState } from 'react';
import style from "./navigationmap.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface NavigationMapProps {
    source?: Coordinates;
    destination: Coordinates;
    setIsOpen: (value: boolean) => void;
}

const NavigationMap = ({ source, destination, setIsOpen }: NavigationMapProps) => {
    const [decisionMade, setDecisionMade] = useState(false);

    const redirectToGoogleMaps = (srcLat: string, srcLng: string) => {
        if (!destination?.latitude || !destination?.longitude) {
            alert('Destination coordinates are missing.');
            return;
        }

        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${srcLat},${srcLng}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
        window.open(mapsUrl, '_blank');
    };

    const handleUseCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toString();
                const lng = position.coords.longitude.toString();
                redirectToGoogleMaps(lat, lng);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Could not access your current location.');
            },
            { enableHighAccuracy: true }
        );
        setDecisionMade(true);
    };

    const handleUseProvidedSource = () => {
        if (source) {
            redirectToGoogleMaps(source.latitude.toString(), source.longitude.toString());
        } else {
            alert('Source coordinates are not provided.');
        }
        setDecisionMade(true);
    };

    return (
        <div className={style.main}>
            <FontAwesomeIcon icon={faTimes} className={style.cross} onClick={() => setIsOpen(false)} />
            <h2 className={style.heading}>Choose source location</h2>
            <div className={style.button}>
                <button
                    onClick={handleUseCurrentLocation}
                    className={style.btn}
                >
                    Use My Current Location
                </button>
                <button
                    onClick={handleUseProvidedSource}
                    className={style.btn}
                >
                    Use Provided Source
                </button>
            </div>
        </div>
    );
};

export default NavigationMap;
