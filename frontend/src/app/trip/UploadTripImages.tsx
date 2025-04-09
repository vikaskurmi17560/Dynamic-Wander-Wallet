import React, { useState, useRef } from "react";
import axios from "axios";
import useLocation from "@/hook/useLocation";
import style from "./uploadimage.module.css";

const UploadTripImages = () => {
    const { tripId } = useLocation();
    const formRef = useRef<HTMLFormElement | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [uploadedData, setUploadedData] = useState<{ cover_image?: string }>({});

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

            console.log("Upload successful:", response.data);
            alert("Trip cover image uploaded successfully!");

            setUploadedData({
                cover_image: response.data.update_trip.cover_image,
            });

            setCoverImage(null);
            formRef.current?.reset();

        } catch (error: any) {
            console.error("Error uploading cover image:", error.response?.data || error.message);
            alert("Failed to upload cover image.");
        }
    };

    return (
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
            {/* {uploadedData.cover_image && (
                <div style={{ marginTop: 30 }}>
                    <h3>Uploaded Cover Image Preview</h3>
                    <img
                        src={uploadedData.cover_image}
                        alt="Cover"
                        style={{ width: "100%", maxWidth: 400, borderRadius: 10 }}
                    />
                </div>
            )} */}
        </div>
    );
};

export default UploadTripImages;
