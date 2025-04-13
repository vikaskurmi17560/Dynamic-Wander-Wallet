import React, { useState, useRef } from "react";
import axios from "axios";
import useLocation from "@/hook/useLocation";
import style from "./uploadimage.module.css";
import { useRouter } from "next/navigation";
import { updateCheckpointBudgets } from "./CHECKPOINTS/updateCheckpointBudgets";
import useData from "@/hook/useData";
import Image from "next/image";

const UploadTripImages = () => {
    const { userId } = useData();
    const { tripId, location, toggleCheckpoint, saveLocation, toggleTripEnd } = useLocation();
    const formRef = useRef<HTMLFormElement | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [uploadedData, setUploadedData] = useState<{ cover_image?: string }>({});
    const router = useRouter();

    const [showReward, setShowReward] = useState(false);
    const [earnBadgePoint, setEarnBadgePoint] = useState(0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowReward(true);
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

    const handleTripEnd = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            console.log("Saving checkpoint...");

            const result = await updateCheckpointBudgets(String(tripId), String(userId));
            const budgetPoint = result.earnedPoints;

            setEarnBadgePoint(budgetPoint);
            setShowReward(true);

            if (result.success) {
                console.log("Trip budget updated:", result.tripBudget);
            } else {
                alert("Failed to update budgets: " + result.error);
            }
            setTimeout(() => {
                setShowReward(false);
                toggleTripEnd();
                router.push(`/trip/CHECKPOINTS/tripend`);
            }, 6000);
            console.log("Checkpoint saved. Redirecting...");
        } catch (error) {
            console.error("Error ending trip:", error);
            alert("Failed to end the trip. Redirecting anyway...");
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
            <div className={style.main}>
                <h2 className={style.heading}>Wrap Up Your Journey</h2>
                <div className={style.form}>
                    <button
                        type="button"
                        onClick={handleTripEnd}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300">
                        End Trip
                    </button>
                </div>
            </div>
            {showReward && (
                <div className={style.rewardOverlay}>
                    <div className={style.rewardCard}>
                        <div className={style.coinImageWrapper}>
                            <Image
                                src="/images/Trip/give_coin.png"
                                alt="Coin"
                                width={120}
                                height={120}
                                className={style.coinImage}
                            />
                        </div>
                        <div className={style.coinText}>
                            <span className={style.coinAmount}>+{earnBadgePoint}</span>
                            <span className={style.coinLabel}>Coins Earned!</span>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UploadTripImages;
