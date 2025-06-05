"use client";

import style from "./ReelPage.module.css";
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import useData from '@/hook/useData';
import { Autocomplete } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import VideoPreview from "./VideoPreview";
import Image from "next/image";

const ReelPage = () => {
    const { user, userId } = useData();
    const router = useRouter();

    const [formData, setFormData] = useState({
        description: '',
        tags: '',
        location: '',
        visibility: '',
        postedBy: '',
    });

    const [video, setVideo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        if (userId) {
            setFormData((prev) => ({ ...prev, postedBy: userId }));
        }
    }, [userId]);

    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            setFormData((prev) => ({
                ...prev,
                location: place?.formatted_address || '',
            }));
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideo(file);
            setPreview(URL.createObjectURL(file));
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('Please upload an image less than 10 MB.');
            return;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!video) return alert('Please upload a video');
        if (!formData.postedBy) return alert('User ID is missing. Please try again.');

        const data = new FormData();
        data.append('description', formData.description);
        data.append('location', formData.location);
        data.append('postedBy', formData.postedBy);
        data.append('visibility', formData.visibility);
        data.append('image', video);

        const tagsArray = formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
        tagsArray.forEach((tag) => data.append('tags[]', tag));
        console.log(video.name, video.type, video.size);
        try {
            const res = await axios.post(
                `https://dynamic-wander-wallet.onrender.com/api/v1/post/create?user_id=${userId}`,
                data,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            router.push('/');
            setFormData({
                description: '',
                tags: '',
                location: '',
                visibility: '',
                postedBy: userId || '',
            });
            setVideo(null);
            setPreview(null);
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to create post');
        }
    };

    return (
        <div className={style.main}>
            <form onSubmit={handleSubmit} method="post" className={style.form}>
                <div className={style.upper_div}>
                    <p className={style.upper_heading}>Create New Reel</p>
                    <button type="submit" className={style.post_btn}>Post</button>
                </div>
                <div className={style.info_div}>
                    <div className={style.video_div}>
                        {preview ? (
                            <VideoPreview src={preview} />
                        ) : (
                            <input
                                type="file"
                                accept="video/*"
                                className={style.video}
                                required
                                onChange={handleVideoChange}
                            />
                        )}
                    </div>
                    <div className={style.content}>
                        <div className={style.profile_div}>
                            <Image
                                src={user.profile || '/images/profilelogo.png'}
                                alt="Profile"
                                width={500}
                                height={500}
                                priority
                                className={style.profile_photo}
                            />
                            <p className={style.profile_name}>i_am_{user.name}</p>
                        </div>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Caption"
                            className={style.textarea}
                        />

                        <Autocomplete onLoad={(auto) => (autocompleteRef.current = auto)} onPlaceChanged={handlePlaceChanged}>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Add Location"
                                required
                                className={style.location}
                            />
                        </Autocomplete>

                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="Tags (comma separated)"
                            className={style.location}
                        />

                        <select
                            name="visibility"
                            value={formData.visibility}
                            onChange={handleChange}
                            className={style.select}
                            aria-placeholder="Accessibility"
                        >
                            <option value="" disabled hidden className={style.hidden}>Accessibility</option>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="friends-only">Friends-only</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ReelPage;
