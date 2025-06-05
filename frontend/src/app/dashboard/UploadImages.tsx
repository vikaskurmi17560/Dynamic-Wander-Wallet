import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import style from "./uploadimage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface UploadImagesProps {
    tripId: string;
}

const UploadImages: React.FC<UploadImagesProps> = ({ tripId }) => {
    const formRef = useRef<HTMLFormElement | null>(null);

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [tripImages, setTripImages] = useState<File[]>([]);
    const [uploadedData, setUploadedData] = useState<{
        cover_image?: string;
        image?: string[];
    }>({});

    const [isGallery, setIsGallery] = useState<boolean>(false);
    const [isUrl, setIsUrl] = useState<string>("");

    useEffect(() => {
        if (tripId) fetchTripData();
    }, [tripId]);

    useEffect(() => {
        if (isGallery) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isGallery]);

    const fetchTripData = async () => {
        try {
            const response = await axios.post("https://dynamic-wander-wallet.onrender.com/api/v1/trip/fetch", {
                _id: tripId,
            });

            const trip = response.data;
            if (!trip) return alert("Trip data not found!");

            setUploadedData({
                cover_image: trip.cover_image || "",
                image: trip.image || [],
            });

            if (trip.image && trip.image.length > 0) {
                setIsUrl(trip.image[0]);
            }

        } catch (error: any) {
            console.error("Failed to fetch trip data:", error.message);
            alert("Failed to fetch trip data.");
        }
    };

    const uploadCoverImage = async () => {
        if (!coverImage || !tripId) return alert("Select a cover image and ensure Trip ID exists.");

        const formData = new FormData();
        formData.append("cover_image", coverImage);

        try {
            await axios.post(
                `https://dynamic-wander-wallet.onrender.com/api/v1/trip/update-trip?trip_id=${tripId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setCoverImage(null);
            formRef.current?.reset();
            fetchTripData();
        } catch (err: any) {
            console.error("Cover upload failed:", err.response?.data || err.message);
            alert("Failed to upload cover image.");
        }
    };

    const uploadGalleryImages = async () => {
        if (tripImages.length === 0 || !tripId) return alert("Select gallery images and ensure Trip ID exists.");

        const formData = new FormData();
        tripImages.forEach((file) => formData.append("image", file));

        try {
            await axios.post(
                `https://dynamic-wander-wallet.onrender.com/api/v1/trip/update-trip?trip_id=${tripId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setTripImages([]);
            formRef.current?.reset();
            alert("Images uploaded successfully!");
            fetchTripData();
        } catch (err: any) {
            console.error("Gallery upload failed:", err.response?.data || err.message);
            alert("Failed to upload gallery images.");
        }
    };

    const handleGallery = () => {
        if (!isGallery && uploadedData.image && uploadedData.image.length > 0) {
            setIsUrl(uploadedData.image[0]);
        }
        setIsGallery((prev) => !prev);
    };

    return (
        <div className={style.main}>
            <h2 className={style.heading}>Upload Trip Images</h2>
            <form ref={formRef} className={style.form} onSubmit={(e) => e.preventDefault()}>
                <div className={style.box}>
                    <label className={style.label}>Change Cover Image</label>
                    <input
                        className={style.input}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                    />
                    <button
                        type="button"
                        className={style.btn}
                        onClick={uploadCoverImage}
                        disabled={!coverImage}
                    >
                        Upload Cover
                    </button>
                </div>

                <div className={style.box}>
                    <label className={style.label}>Gallery Images</label>
                    <input
                        className={style.input}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setTripImages(e.target.files ? Array.from(e.target.files) : [])}
                    />
                    <button
                        type="button"
                        className={style.btn}
                        onClick={uploadGalleryImages}
                        disabled={tripImages.length === 0}
                    >
                        Upload Gallery
                    </button>
                </div>

                {/* Gallery Viewer Button */}
                <div className={style.box}>
                    <button className={style.button} onClick={handleGallery}>🖼️ Gallery</button>
                </div>
            </form>

            {/* Cover Preview
            {uploadedData.cover_image && (
                <div style={{ marginTop: 30 }}>
                    <h3>Cover Image Preview</h3>
                    <img
                        src={uploadedData.cover_image}
                        alt="Cover"
                        style={{ width: "100%", maxWidth: 400, borderRadius: 10 }}
                    />
                </div>
            )} */}

            {isGallery && (
                <div className={style.watch_div}>
                    <div className={style.photo_div}>
                        <img
                            src={isUrl}
                            alt="Selected"
                            className={style.image_show}
                        />
                        <div className={style.small_image_div}>
                            {uploadedData.image && uploadedData.image.length > 0 && (
                                <div className={style.thumbnail_wrapper}>
                                    {uploadedData.image.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url}
                                            alt={`Gallery ${idx + 1}`}
                                            style={{
                                                width: 150, 
                                                height: 100,
                                                objectFit: "cover",
                                                borderRadius: 6,
                                                flexShrink: 0,
                                                cursor: "pointer",
                                                border: url === isUrl ? "4px solid white" : "none",
                                                boxShadow: url === isUrl ? "0 0 8px rgba(255,255,255,0.8)" : "none",
                                            }}
                                            onClick={() => setIsUrl(url)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className={style.cross_icon}
                        onClick={handleGallery}
                    />
                </div>
            )}
        </div>
    );
};

export default UploadImages;
