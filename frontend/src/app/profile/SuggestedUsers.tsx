"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import style from "./Suggestedusers.module.css";
import Image from "next/image";
import useData from "@/hook/useData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface User {
    _id: string;
    name: string;
    email: string;
    phone_no: string;
    gender?: string;
    profile?: string;
    banner?: string;
    bio?: string;
    posts: any[];
    followers: { _id: string }[];
    following: { _id: string }[];
    badge_point: number;
    total_trip: number;
    createdAt: string;
    updatedAt: string;
}

const SuggestedUsers = ({ onClose }: { onClose: () => void }) => {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useData();
    const [followingIds, setFollowingIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchUsersAndFollowing = async () => {
            try {
                const [usersRes, currentUserRes] = await Promise.all([
                    axios.get("https://dynamic-wander-wallet.onrender.com/api/v1/user/getalluser"),
                    axios.get("https://dynamic-wander-wallet.onrender.com/api/v1/user/get-user", {
                        params: { user_id: userId },
                    }),
                ]);

                if (usersRes.data.success && currentUserRes.data.success) {
                    const filtered = usersRes.data.users.filter((u: User) => u._id !== userId);
                    setAllUsers(filtered);

                    const followingList = currentUserRes.data.user.following || [];
                    const ids = followingList.map((f: any) => f._id || f); 
                    setFollowingIds(ids);
                } else {
                    setError("Failed to fetch users or following info.");
                }
            } catch (err) {
                console.error("Error fetching users or following list:", err);
                setError("An error occurred while fetching suggestions.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUsersAndFollowing();
    }, [userId]);

    const handleFollowToggle = async (targetUserId: string) => {
        try {
            const isFollowing = followingIds.includes(targetUserId);
            const url = `https://dynamic-wander-wallet.onrender.com/api/v1/user/${isFollowing ? "unfollow" : "follow"}?id=${targetUserId}`;
            await axios.post(url, { currentUserId: userId });

            setFollowingIds((prev) =>
                isFollowing ? prev.filter((id) => id !== targetUserId) : [...prev, targetUserId]
            );
        } catch (error) {
            console.error("Follow/unfollow error:", error);
        }
    };

    return (
        <div className={style.suggested_container}>
            <h4 className={style.h4}>Suggested for you</h4>
            <FontAwesomeIcon icon={faTimes} onClick={onClose} className={style.close_btn} />
            {loading ? (
                <p>Loading suggestions...</p>
            ) : error ? (
                <p>{error}</p>
            ) : allUsers.length > 0 ? (
                <div className={style.suggested_list}>
                    {allUsers.slice(0, 5).map((u) => {
                        const isFollowing = followingIds.includes(u._id);
                        return (
                            <div key={u._id} className={style.suggested_user}>
                                <Image
                                    src={u.profile || "/images/ProfileIcon.webp"}
                                    alt={u.name}
                                    width={40}
                                    height={40}
                                    className={style.suggested_avatar}
                                />
                                <span className={style.suggested_name}>{u.name}</span>
                                <button
                                    className={`${style.btn} ${isFollowing ? style.following : ""}`}
                                    onClick={() => handleFollowToggle(u._id)}
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>No suggestions</p>
            )}
        </div>
    );
};

export default SuggestedUsers;
