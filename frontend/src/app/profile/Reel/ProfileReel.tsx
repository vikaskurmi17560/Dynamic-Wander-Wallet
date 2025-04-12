"use client";

import useData from '@/hook/useData';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import style from "../ProfilePost.module.css";
import IndividualPost from './individualPost';
import { FaHeart, FaComment } from "react-icons/fa";

interface Post {
    _id: string;
    image: string;
    description: string;
    tags: string[];
    location: string;
    createdAt: string;
    postedBy: string;
    postedUser?: User;
    likes: string[];
    comments: string[];
}

interface User {
    _id: string;
    name: string;
    profile?: string;
}

const isVideo = (url: string): boolean => {
    return /\.(mp4|mov|webm|ogg)$/i.test(url);
};

const ProfileReel = () => {
    const { userId } = useData();
    const [posts, setPosts] = useState<Post[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:7050/api/v1/post/getbyuserid`, {
                params: { user_id: userId },
            });
    
            const postsData: Post[] = response.data.posts || [];
            const videoPosts = postsData.filter(post => isVideo(post.image));
    
            const postsWithUsers = await Promise.all(
                videoPosts.map(async (post) => {
                    try {
                        const userRes = await axios.get('http://localhost:7050/api/v1/user/get-user', {
                            params: { user_id: post.postedBy },
                        });
                        return { ...post, postedUser: userRes.data.user };
                    } catch (err) {
                        console.error("Error fetching user:", err);
                        return post;
                    }
                })
            );
    
            setPosts(postsWithUsers);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };
    
    useEffect(() => {
        if (userId) fetchPosts();
    }, [userId]);
    
    const nextPost = () => {
        if (activeIndex === null) return;
        setActiveIndex((prev) => (prev! + 1) % posts.length);
    };

    const prevPost = () => {
        if (activeIndex === null) return;
        setActiveIndex((prev) => (prev! - 1 + posts.length) % posts.length);
    };

    return (
        <div className={style.main}>
            <div className={style.grid}>
                {posts.map((post, idx) => (
                    <div key={post._id} className={style.card}>
                        <div className={style.imageWrapper} onClick={() => setActiveIndex(idx)}>
                            <video
                                src={post.image}
                                className={style.image}
                                muted
                                loop
                                playsInline
                            />
                            <div className={style.overlay}>
                                <div className={style.icons}>
                                    <span className={style.span}><FaHeart /> {post.likes.length}</span>
                                    <span className={style.span}><FaComment /> {post.comments.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {activeIndex !== null && posts[activeIndex] && (
                <IndividualPost
                    post={posts[activeIndex]}
                    onClose={() => setActiveIndex(null)}
                    onNext={nextPost}
                    onPrev={prevPost}
                    onDelete={fetchPosts}
                />
            )}
        </div>
    );
};

export default ProfileReel;
