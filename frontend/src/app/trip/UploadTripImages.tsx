import React, { useState, useRef } from "react";
import axios from "axios";
import useLocation from "@/hook/useLocation";
import style from "./uploadimage.module.css";

import Image from "next/image";
import { useData } from "@/context/UserContext";

const UploadTripImages = () => {
    const { userId } = useData();
    const { tripId, location, toggleCheckpoint, saveLocation, toggleTripEnd } = useLocation();
    const formRef = useRef<HTMLFormElement | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!tripId) {
            alert("Please provide a Trip ID.");
            return;
        }
        const formData = new FormData();
        if (coverImage) {
            formData.append("cover_image", coverImage);
        }
        try {
            const response = await axios.post(
                `http://localhost:7050/api/v1/trip/update-trip?trip_id=${tripId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                console.log("Upload successful:", response.data);
                alert("Trip cover image uploaded successfully!");
                setCoverImage(null);
                formRef.current?.reset();
            } else {
                console.error("Unexpected response status:", response.status);
                alert("Failed to upload cover image.");
            }
        } catch (error: any) {
            console.error("Error uploading cover image:", error.response?.data || error.message);
            alert("Failed to upload cover image.");
        }

    };

    return (
        <div className={style.container}>
            <div className={style.main}>
                <h2 className={style.heading}>Upload Cover Image</h2>
                <form onSubmit={handleSubmit} className={style.form} ref={formRef}>
                    <div className={style.box}>
                        <label className={style.label}>Cover Image</label>
                        <input
                            className={style.input}
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                        />
                    </div>
                    <button type="submit" className={style.btn}>
                        Upload
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadTripImages;
