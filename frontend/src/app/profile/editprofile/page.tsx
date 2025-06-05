"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import style from "./editprofile.module.css";
import { useData } from "@/context/UserContext";

interface User {
    name: string;
    bio: string;
    phone_no: string;
    profile: string;
    banner: string;
}

const EditProfile = () => {
    const router = useRouter();
    const { userId } = useData();
    const [loading, setLoading] = useState(true);
    const { register, setValue, watch, handleSubmit } = useForm();

    const fetchUserData = async () => {
        try {
            const response = await axios.get("https://dynamic-wander-wallet.onrender.com/api/v1/user/get-user", {
                params: { user_id: userId },
            });

            if (response.data.success) {
                const user: User = response.data.user;
                setValue("name", user.name || "");
                setValue("bio", user.bio || "");
                setValue("phone_no", user.phone_no || "");
                setValue("profile", user.profile || "");
                setValue("banner", user.banner || "");
            } else {
                toast.error("Failed to load user data");
            }
        } catch (error) {
            toast.error("Error fetching user data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            const values = watch();

            formData.append("user_id", userId || "");
            formData.append("name", values.name);
            formData.append("bio", values.bio);
            formData.append("phone_no", values.phone_no);

            if (values.profile?.[0]) {
                formData.append("profile", values.profile[0]);
            }

            if (values.banner?.[0]) {
                formData.append("banner", values.banner[0]);
            }

            const response = await axios.post(
                `https://dynamic-wander-wallet.onrender.com/api/v1/user/update-user?user_id=${userId}`,
                formData
            );
            // alert("update Successfully")
            router.push("/profile");
            if (response.data.success) {
                toast.success("Profile updated successfully");
                router.push("/profile");
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred during update");
        }
    };

    const profilePreview = watch("profile") && Array.isArray(watch("profile")) && watch("profile")[0]
        ? URL.createObjectURL(watch("profile")[0])
        : undefined;

    const bannerPreview = watch("banner") && Array.isArray(watch("banner")) && watch("banner")[0]
        ? URL.createObjectURL(watch("banner")[0])
        : undefined;

    if (loading) {
        return <p className="text-center mt-8">Loading...</p>;
    }

    return (
        <div className={style.main}>
            <div className={style.container}>
                <div className="mt-6 space-y-4">
                    <div className={style.images_div}>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                                {profilePreview ? (
                                    <img
                                        src={profilePreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="profileImage"
                                className="text-blue-600 mt-2 text-sm font-semibold cursor-pointer"
                            >
                                Change Profile Photo
                            </label>
                            <input
                                {...register("profile")}
                                id="profileImage"
                                type="file"
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                                {bannerPreview ? (
                                    <img
                                        src={bannerPreview}
                                        alt="banner"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="bannerImage"
                                className="text-blue-600 mt-2 text-sm font-semibold cursor-pointer"
                            >
                                Change Banner Photo
                            </label>
                            <input
                                {...register("banner")}
                                id="bannerImage"
                                type="file"
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Name</label>
                        <input {...register("name")} type="text" className={style.input} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">Bio</label>
                        <textarea {...register("bio")} className={style.textarea} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">Phone Number</label>
                        <input {...register("phone_no")} type="tel" className={style.input} />
                    </div>
                    <button
                        type="submit"
                        onClick={handleUpdate}
                        className="w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-semibold shadow-sm hover:bg-indigo-500"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
