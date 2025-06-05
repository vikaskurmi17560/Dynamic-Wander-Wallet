import { useRouter } from 'next/router';
import MapNavigator from './MapNavigator';

const MapRoutePage = () => {
    const router = useRouter();

    // Retrieve query parameters (source and destination coordinates)
    const { sourceLat, sourceLng, destLat, destLng } = router.query;

    // Check if the query parameters are available, otherwise show a loading state
    if (!sourceLat || !sourceLng || !destLat || !destLng) {
        return <p>Loading map...</p>;
    }

    // Convert the query parameters to float values (coordinates)
    const source = [parseFloat(sourceLat as string), parseFloat(sourceLng as string)];
    const destination = [parseFloat(destLat as string), parseFloat(destLng as string)];

    return (
        <div>
            <h1>Map Route</h1>
            <MapNavigator
                source={source}
                destination={destination}
                onClose={() => router.push('/')} // Close the map and go back to the home page
            />
        </div>
    );
};

export default MapRoutePage;
