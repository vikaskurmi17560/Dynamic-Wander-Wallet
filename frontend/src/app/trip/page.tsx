"use client";

import { useState, useEffect } from "react";
import style from "./trippage.module.css";

const Trip = () => {
    const [tripData, setTripData] = useState({
        tripName: "",
        state: "",
        city: "",
        startPlace: "",
        destination: "",
    });

    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
        fetch("https://countriesnow.space/api/v0.1/countries/states", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: "India" }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data?.data?.states) {
                    setStates(data.data.states.map((state: any) => state.name));
                }
            })
            .catch((err) => console.error("Error fetching states:", err));
    }, []);

    useEffect(() => {
        if (tripData.state) {
            fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country: "India", state: tripData.state }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data?.data) {
                        setCities(data.data);
                    }
                })
                .catch((err) => console.error("Error fetching cities:", err));
        } else {
            setCities([]);
        }
    }, [tripData.state]);

    const handleData = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTripData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "state" && { city: "" }),
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Trip Data Submitted:", tripData);
    };

    return (
        <div className={style.main}>
            <video className={style.video} autoPlay loop muted playsInline>
                <source src="/video/TripPage.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className={style.data}>
                <div className={style.heading_div}>
                    <p className={style.heading}>Trip Information</p>
                    <p className={style.desp}>
                        Every great adventure starts with a perfect plan—let’s create yours
                    </p>
                </div>
                <form className={style.form} method="POST" onSubmit={handleSubmit}>
                    <div className={style.inputbox}>
                        <p className={style.name}>Trip Name</p>
                        <input
                            type="text"
                            name="tripName"
                            value={tripData.tripName}
                            onChange={handleData}
                            placeholder="Enter Trip Name"
                            className={style.input}
                        />
                    </div>
                    <div className={style.inputbox}>
                        <p className={style.name}>State</p>
                        <select
                            name="state"
                            value={tripData.state}
                            onChange={handleData}
                            className={style.input}
                        >
                            <option value="">Select State</option>
                            {states.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={style.inputbox}>
                        <p className={style.name}>City</p>
                        <select
                            name="city"
                            value={tripData.city}
                            onChange={handleData}
                            className={style.input}
                            disabled={!tripData.state}
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={style.inputbox}>
                        <p className={style.name}>Start Place</p>
                        <input
                            type="text"
                            name="startPlace"
                            value={tripData.startPlace}
                            onChange={handleData}
                            placeholder="Enter Start Place"
                            className={style.input}
                        />
                    </div>
                    <div className={style.inputbox}>
                        <p className={style.name}>Destination</p>
                        <input
                            type="text"
                            name="destination"
                            value={tripData.destination}
                            onChange={handleData}
                            placeholder="Enter Destination"
                            className={style.input}
                        />
                    </div>
                    <div className={style.buttonbox}>
                        <button type="submit" className={style.btn}>
                            Start Journey
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Trip;
