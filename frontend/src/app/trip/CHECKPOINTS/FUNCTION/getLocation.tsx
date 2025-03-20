
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

export const getCurrentLocation = (setFormData: Function) => {
    if (navigator.geolocation) {
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

                    setFormData((prev: any) => ({
                        ...prev,
                        destination: {
                            name: locationName,
                            latitude: latitude.toString(),
                            longitude: longitude.toString(),
                        },
                    }));
                } catch (error) {
                    console.error("Error fetching address:", error);
                    alert("Failed to get address. Please try again.");
                }
            },
            (error) => {
                console.error("Error fetching location:", error);
                alert("Unable to fetch location. Please enable GPS.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};
