"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import style from "./restaurant.module.css";
import useData from "@/hook/useData";
import Image from "next/image";

const Restaurant = () => {
    const searchParams = useSearchParams();
    const tripId = searchParams.get("tripId");
    const checkpointId = searchParams.get("checkpointId");
    const router = useRouter();
    const { userId } = useData();
    const [showReward, setShowReward] = useState(false);
    const [earnBadgePoint, setEarnBadgePoint] = useState(0);

    type Location = {
        latitude: number | null;
        longitude: number | null;
        placeName: string;
    };

    const [location, setLocation] = useState<Location>({
        latitude: null,
        longitude: null,
        placeName: "Fetching address...",
    });


    const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            return response.data.display_name || "Unknown Address";
        } catch (error) {
            console.error("Error fetching address:", error);
            return "Address not found";
        }
    };

    useEffect(() => {
        if ("geolocation" in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const placeName = await getAddressFromCoordinates(latitude, longitude);
                    setLocation({ latitude, longitude, placeName });
                },
                (error) => console.error("Error getting location:", error),
                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    const [formData, setFormData] = useState({
        trip_id: tripId,
        checkpoint_id: checkpointId,
        restaurant_name: "",
        location: { latitude: 0, longitude: 0, name: "" },
        rating: 3.0,
        mealType: "",
        description: "",
        prices: [{ meal_type: "", meal_price: 0 }],
        contact: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            prices: [{ ...prev.prices[0], [name]: value }],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const earnBadgePoint = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
        setEarnBadgePoint(earnBadgePoint);
        setShowReward(true);
        if (!tripId || !checkpointId) {
            console.error("Error: trip_id or checkpoint_id is missing!");
            return;
        }

        const updatedFormData = {
            ...formData,
            trip_id: tripId,
            checkpoint_id: checkpointId,
            location: {
                latitude: location.latitude ?? 0,
                longitude: location.longitude ?? 0,
                name: location.placeName || "Unknown Address",
            },
            prices: [{ meal_type: formData.mealType, meal_price: formData.prices[0].meal_price }],
            Earnbadge_point: earnBadgePoint,
        };

        console.log("Submitting Data:", updatedFormData);

        try {
            const response = await axios.post(
                `http://localhost:7050/api/v1/restaurant/create`,
                updatedFormData,
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Response:", response.data);
            setTimeout(() => {
                setShowReward(false);
                router.back();
            }, 2000);
        } catch (error: any) {
            console.error("Error submitting form:", error.response?.data || error.message);
        }
    };



    return (
        <div className={style.main}>
            <div className={style.form_div}>
                <h2 className={style.form_heading}>Restaurant Checkpoint</h2>
                <form onSubmit={handleSubmit} className={style.form}>
                    <div className={style.box}>
                        <label className={style.label}>
                            <p className={style.content}>Latitude</p>
                            <input type="text" value={location?.latitude || ""} className={style.input} readOnly />
                        </label>

                        <label className={style.label}>
                            <p className={style.content}>Longitude</p>
                            <input type="text" value={location?.longitude || ""} className={style.input} readOnly />
                        </label>

                        <label className={style.label}>
                            <p className={style.content}>Address</p>
                            <input type="text" value={location?.placeName || ""} className={style.input} readOnly />
                        </label>
                    </div>

                    <label className={style.label}>
                        <p className={style.content}>Restaurant Name*</p>
                        <input type="text" name="restaurant_name" value={formData.restaurant_name} onChange={handleChange} className={style.input} placeholder="Enter the Restaurant / Cafe name" required />
                    </label>

                    <div className={style.box}>
                        <label className={style.label}>
                            <p className={style.content}>Rating</p>
                            <input type="number" name="rating" value={formData.rating === 3.0 ? "" : formData.rating} onChange={handleChange} className={style.input} placeholder="Enter the Rating btw (0-5)" />
                        </label>

                        <label className={style.label}>
                            <p className={style.content}>Meal Type*</p>
                            <select name="mealType" value={formData.mealType} onChange={handleChange} className={style.input} required>
                                <option value="">Select the Meal</option>
                                <option value="BreakFast">BreakFast</option>
                                <option value="Brunch">Brunch</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Supper">Supper</option>
                            </select>
                        </label>

                        <label className={style.label}>
                            <p className={style.content}>Meal Price*</p>
                            <input type="number" name="meal_price" value={formData.prices[0].meal_price === 0 ? "" : formData.prices[0].meal_price} onChange={handlePriceChange} className={style.input} min="0" placeholder="Enter the Price of meal" required />
                        </label>
                    </div>

                    <div className={style.textarea_div}>
                        <label className={style.labels}>
                            <p className={style.content}>Description</p>
                            <textarea name="description" value={formData.description} onChange={handleChange} className={style.textarea} maxLength={500} placeholder="Enter some Extra Info"></textarea>
                        </label>

                        <label className={style.labels}>
                            <p className={style.content}>Contact</p>
                            <textarea name="contact" value={formData.contact} onChange={handleChange} className={style.textarea} maxLength={500} placeholder="How to communicate with them"></textarea>
                        </label>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={() => router.back()}>
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            {showReward && (
                <div className={style.reward_div}>
                    <div className={style.reward_popup}>
                        <div className={style.reward_container}>
                            <div className={style.coin_graphic}>
                                <Image
                                    src="/images/Trip/give_coin.png"
                                    alt="Coin"
                                    width={80}
                                    height={80}
                                    className={style.coin_img}
                                />
                            </div>
                            <div className={style.reward_text}>
                                <span className={style.plus_text}>+{earnBadgePoint}</span> Coins Earned!
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Restaurant;
