"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import useLocation from "@/hook/useLocation";
import style from "./CheckpointForm.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { getCurrentLocation } from "./FUNCTION/getLocation";

const categoryVehicleMapping: Record<string, string[]> = {
    Vehicle: [
        "State Bus",
        "Electric Scooter",
        "Motorcycle",
        "Electric Auto",
        "Public Bus",
        "City Bus",
        "Vikram Auto",
        "Train",
        "Ola Auto",
        "Car",
        "Rapido",
        "Public Bus AC",
        "Red Bus",
        "Uber",
        "Booking Car",
        "Luxury Car"
    ],
    Walk: ["By Walk"],
};

const CheckpointForm = () => {
    const { tripId, location } = useLocation();

    const [formData, setFormData] = useState({
        trip_id: tripId || "",
        source: { name: location?.name ?? "", latitude: location?.lat ?? 0, longitude: location?.lng ?? 0 },
        destination: { name: "", latitude: 0, longitude: 0 },
        description: "",
        transport_budget: [{ category: "Walk", transport: { transport_type: "By Walk", transport_price: 0, extra_info: "" } }],
    });

    useEffect(() => {
        if (tripId) {
            setFormData((prev) => ({ ...prev, trip_id: tripId }));
        }
    }, [tripId]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            source: { name: location?.name ?? "", latitude: location?.lat ?? 0, longitude: location?.lng ?? 0 },
        }));
    }, [location]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        field: string,
        subfield?: string,
        index?: number
    ) => {
        setFormData((prev) => {
            if (field === "transport_budget" && index !== undefined) {
                const updatedTransport = [...prev.transport_budget];

                if (subfield === "category") {
                    const selectedCategory = e.target.value;
                    updatedTransport[index] = {
                        ...updatedTransport[index],
                        category: selectedCategory,
                        transport: {
                            ...updatedTransport[index].transport,
                            transport_type: categoryVehicleMapping[selectedCategory]?.[0] || "By Walk", 
                        },
                    };
                } else if (subfield) {
                    updatedTransport[index] = {
                        ...updatedTransport[index],
                        transport: {
                            ...updatedTransport[index].transport,
                            [subfield]: subfield === "transport_price" ? Math.max(0, Number(e.target.value)) : e.target.value,
                        },
                    };
                }

                return { ...prev, transport_budget: updatedTransport };
            }

            return subfield
                ? { ...prev, [field]: { ...prev[field as keyof typeof prev], [subfield]: e.target.value } }
                : { ...prev, [field]: e.target.value };
        });
    };

    const addTransportBudget = () => {
        setFormData((prev) => ({
            ...prev,
            transport_budget: [...prev.transport_budget, { category: "Walk", transport: { transport_type: "By Walk", transport_price: 0, extra_info: "" } }],
        }));
    };

    const removeTransportBudget = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            transport_budget: prev.transport_budget.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.trip_id || !formData.source.name || !formData.destination.name) {
            alert("Trip ID, Source, and Destination are required!");
            return;
        }

        try {
            await axios.post("http://localhost:7050/api/v1/checkpoint/create", formData);
            alert("Checkpoint added successfully!");
        } catch (error) {
            console.error("Error creating checkpoint:", error);
            alert("Failed to create checkpoint.");
        }
    };

    return (
        <div className={style.main}>
            <h2 className={style.heading}>Create a Checkpoint</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <div className={style.name}>Trip Id</div>
                    <input type="text" className={style.input} value={formData.trip_id} readOnly />
                </div>

                {/* Source Section */}
                <div className={style.source_dest}>
                    <input type="text" className={style.input} value={location?.name || ""} readOnly required />
                    <input type="number" className={style.input} value={location?.lat || 0} readOnly required />
                    <input type="number" className={style.input} value={location?.lng || 0} readOnly required />
                </div>

                {/* Destination Section */}
                <div className={style.source_dest}>
                    <input type="text" className={style.input} placeholder="Enter Destination Name" value={formData.destination.name} onChange={(e) => handleChange(e, "destination", "name")} required />
                    <input type="number" className={style.input} placeholder="Enter Latitude" value={formData.destination.latitude} onChange={(e) => handleChange(e, "destination", "latitude")} required />
                    <input type="number" className={style.input} placeholder="Enter Longitude" value={formData.destination.longitude} onChange={(e) => handleChange(e, "destination", "longitude")} required />
                </div>

                <button type="button" onClick={() => getCurrentLocation(setFormData)} className="mt-2 bg-blue-500 text-white p-2 rounded">
                    Add Stop Point
                </button>

                <div>
                    <div className={style.name}>Description</div>
                    <textarea className={style.textarea} value={formData.description} onChange={(e) => handleChange(e, "description")}></textarea>
                </div>

                {/* Transport Budget Section */}
                <div>
                    <div className={style.name}>Transport Budget</div>
                    {formData.transport_budget.map((budget, index) => (
                        <div key={index} className={style.budget}>
                            <select className={style.input} value={budget.category} onChange={(e) => handleChange(e, "transport_budget", "category", index)}>
                                {Object.keys(categoryVehicleMapping).map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <select className={style.input} value={budget.transport.transport_type} onChange={(e) => handleChange(e, "transport_budget", "transport_type", index)}>
                                {categoryVehicleMapping[budget.category]?.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>

                            <input type="number" className={style.input} value={budget.transport.transport_price} onChange={(e) => handleChange(e, "transport_budget", "transport_price", index)} />

                            <input type="text" className={style.input} value={budget.transport.extra_info} onChange={(e) => handleChange(e, "transport_budget", "extra_info", index)} />

                            {formData.transport_budget.length > 1 && (
                                <button type="button" className="btn btn-danger mt-2" onClick={() => removeTransportBudget(index)}>
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn btn-success mt-2" onClick={addTransportBudget}>+ Add Transport Budget</button>
                </div>

                <div className={style.btn}>
                    <button className="btn btn-primary" type="submit">Submit</button>
                    <button type="button" className="btn btn-danger">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default CheckpointForm;
