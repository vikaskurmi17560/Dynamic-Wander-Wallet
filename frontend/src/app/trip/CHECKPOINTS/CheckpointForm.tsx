"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import style from "./CheckpointForm.module.css";
import useLocation from "@/hook/useLocation";
import { getCurrentLocation } from "./FUNCTION/getLocation";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useData from "@/hook/useData";
import Image from "next/image";


interface Location {
    name: string;
    latitude: number;
    longitude: number;
}

interface TransportBudget {
    category: string;
    transport_type: string;
    transport_price: number;
    extra_info: string;
}

interface FormData {
    trip_id: string;
    source: Location;
    destination: Location;
    description: string;
    transport_budget: TransportBudget[];
}

const categories = ["Vehicle", "By Walk"];
const transportTypes = {
    Vehicle: ["Train", "State Bus", "City Bus", "Metro", "Ola", "Uber", "Car", "Bike", "Auto"],
    ByWalk: [],
};

interface CheckpointFormProps {
    onCheckpointAdded: (checkpoint: any) => void;
}

const CheckpointForm: React.FC<CheckpointFormProps> = ({ onCheckpointAdded }) => {

    const { userId } = useData();
    const router = useRouter();
    const { tripId, location, toggleCheckpoint, saveLocation, toggleTripEnd } = useLocation();

    const [formData, setFormData] = useState<FormData>({
        trip_id: "",
        source: { name: "", latitude: 0, longitude: 0 },
        destination: { name: "", latitude: 0, longitude: 0 },
        description: "",
        transport_budget: [],
    });

    const [showReward, setShowReward] = useState(false);
    const [earnBadgePoint, setEarnBadgePoint] = useState(0);


    useEffect(() => {
        console.log("Location updated:", location);

        setFormData((prev) => ({
            ...prev,
            trip_id: tripId || "",
            source: location?.name
                ? {
                    name: location.name,
                    latitude: Number(location.lat),
                    longitude: Number(location.lng)
                }
                : prev.source,
        }));
    }, [tripId, location]);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [transportPrice, setTransportPrice] = useState(0);
    const [extraInfo, setExtraInfo] = useState("");

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setSelectedType("");
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(e.target.value);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTransportPrice(Number(e.target.value) || 0);
    };

    const handleExtraInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExtraInfo(e.target.value);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        field: keyof FormData,
        subfield?: keyof Location
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: subfield
                ? {
                    ...(prev[field] as Location),
                    [subfield]: subfield === "latitude" || subfield === "longitude"
                        ? Number(e.target.value) || 0
                        : e.target.value,
                }
                : e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const earnBadgePoint = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
        setEarnBadgePoint(earnBadgePoint);
        setShowReward(true);

        const newCheckpoint = {
            trip_id: formData.trip_id,
            source: { ...formData.source },
            destination: {
                ...formData.destination,
                latitude: Number(formData.destination.latitude),
                longitude: Number(formData.destination.longitude)
            },
            description: formData.description,
            transport_budget: [
                {
                    category: selectedCategory,
                    transport_type: selectedCategory === "Vehicle" ? selectedType : "By Walk",
                    transport_price: selectedCategory === "Vehicle" ? transportPrice : 0,
                    extra_info: selectedCategory === "Vehicle" ? extraInfo : "",
                },
            ],
            Earnbadge_point: earnBadgePoint,
        };

        try {
            const response = await axios.post(
                `http://localhost:7050/api/v1/checkpoint/create?userId=${userId}`,
                newCheckpoint,
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            saveLocation({
                name: newCheckpoint.destination.name,
                lat: Number(newCheckpoint.destination.latitude),
                lng: Number(newCheckpoint.destination.longitude)
            });

            onCheckpointAdded(response.data.checkpoint);
            setTimeout(() => {
                setShowReward(false);
                toggleCheckpoint();
            }, 6000);

        } catch (error: any) {
            console.error("Error creating checkpoint:", error.response?.data || error.message);
            alert("Failed to create checkpoint. Check console for details.");
            setShowReward(false);
        }
    };


    return (
        <div className={style.main}>
            <h2 className={style.heading}>Create a Checkpoint</h2>
            <form onSubmit={handleSubmit} className={style.form}>

                <div className={style.source_dest}>
                    <div>
                        <div className={style.name}>Source*</div>
                        <input type="text" placeholder="Source Name"
                            value={formData.source.name}
                            className={style.input} readOnly required />
                    </div>
                    <div>
                        <div className={style.name}>Latitude*</div>
                        <input type="number" placeholder="Latitude"
                            value={formData.source.latitude}
                            className={style.input} readOnly required />
                    </div>
                    <div>
                        <div className={style.name}>Longitude*</div>
                        <input type="number" placeholder="Longitude"
                            value={formData.source.longitude}
                            className={style.input} readOnly required />
                    </div>
                </div>
                <div className={style.source_dest}>
                    <div>
                        <div className={style.name}>Destination*</div>
                        <input
                            type="text"
                            placeholder="Destination Name"
                            value={formData.destination.name}
                            // value={"Mallital, Nainital, Uttarakhand 263001"}
                            onChange={(e) => handleChange(e, "destination", "name")}
                            required
                            className={style.input}
                        />
                    </div>
                    <div>
                        <div>
                            <div className={style.name}>Latitude*</div>
                            <input
                                type="number"
                                placeholder="Latitude"
                                value={formData.destination.latitude || 0}
                                // value={29.388170}
                                onChange={(e) => handleChange(e, "destination", "latitude")}
                                required
                                className={style.input}
                            />
                        </div>
                    </div>
                    <div>
                        <div className={style.name}>Longitude*</div>
                        <input
                            type="number"
                            placeholder="Longitude"
                            value={formData.destination.longitude || 0}
                            // value={79.460702}
                            onChange={(e) => handleChange(e, "destination", "longitude")}
                            required
                            className={style.input}
                        />
                    </div>
                </div>
                <button type="button" onClick={() => getCurrentLocation(setFormData)} className="mt-2 bg-blue-500 text-white p-2 rounded">
                    Add Stop Point
                </button>
                <div className={style.budget}>
                    <div>
                        <div className={style.sub_name}>Transport Category*</div>
                        <select value={selectedCategory} onChange={handleCategoryChange} className={style.input} required>
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div className={style.sub_name}>Transport Type*</div>
                        <select value={selectedType} onChange={handleTypeChange} className={style.input} disabled={selectedCategory === "By Walk"}>
                            <option value="">Select Transport Type</option>
                            {transportTypes.Vehicle.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div className={style.sub_name}>Transport Price</div>
                        <input type="number" placeholder="Price" value={transportPrice === 0 ? "" : transportPrice} onChange={handlePriceChange} className={style.input} disabled={selectedCategory === "By Walk"} />
                    </div>
                    <div>
                        <div className={style.sub_name}>Extra Info</div>
                        <input type="text" placeholder="Extra Info" value={extraInfo} onChange={handleExtraInfoChange} className={style.input} />
                    </div>
                </div>
                <div>
                    <div className={style.name}>Description</div>
                    <textarea
                        placeholder="Enter Description"
                        value={formData.description}
                        onChange={(e) => handleChange(e, "description")}
                        className={style.textarea}
                    ></textarea>
                </div>

                <div className={style.submit_btn}>
                    <button
                        type="submit"
                        className="mt-2 bg-blue-500 text-white p-2 rounded w-4/5 h-12">
                        Checkpoint Verified
                    </button>
                </div>
            </form>
            <FontAwesomeIcon icon={faTimes} className={style.cross_btn} onClick={() => toggleCheckpoint()} />
            {showReward && (
                <div className={style.coins_popup}>
                    <div className={style.coins_border}>
                        <div className={style.coins_image_div}>
                            <Image
                                src="/images/Trip/give_coin.png"
                                alt="Coin"
                                width={1000}
                                height={1000}
                                className={style.coin_img}
                            />
                        </div>
                        <div className={style.coin_value}>
                            Coins + {earnBadgePoint}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckpointForm;