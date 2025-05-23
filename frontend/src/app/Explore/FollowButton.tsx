"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface FollowButtonProps {
    userId: string; 
    currentUserId: string; 
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, currentUserId }) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const checkFollowStatus = async () => {
        try {
            const res = await axios.get("http://localhost:7050/api/v1/user/check-follow", {
                params: {
                    id: userId,
                    currentUserId,
                },
            });
            setIsFollowing(res.data.isFollowing);
        } catch (err) {
            console.error("Error checking follow status:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await axios.post(`http://localhost:7050/api/v1/user/unfollow?id=${userId}`, {
                    currentUserId,
                });
            } else {
                await axios.post(`http://localhost:7050/api/v1/user/follow?id=${userId}`, {
                    currentUserId,
                });
            }
            setIsFollowing(!isFollowing);
        } catch (err) {
            console.error("Follow toggle failed:", err);
        }
    };

    useEffect(() => {
        if (userId && currentUserId) {
            checkFollowStatus();
        }
    }, [userId, currentUserId]);

    if (loading) return <button disabled>Loading...</button>;

    return (
        <button
            onClick={handleFollowToggle}
            style={{
                padding: "0.2em 0.4em",
                backgroundColor: isFollowing ? "#ccc" : "#007bff",
                color: isFollowing ? "#333" : "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize :"0.9em",
                height:"1.9em"
            }}
        >
            {isFollowing ? "Following" : "Follow"}
        </button>
    );
};

export default FollowButton;
