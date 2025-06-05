"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from "./ProfilePost.module.css";
import { FaHeart, FaComment } from "react-icons/fa";
import DisplayPost from './DisplayPost';

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

interface ProfilePostProps {
    userId: string;
    isDisabled?: boolean;
}

const isImage = (url: string): boolean => {
    return /\.(jpeg|jpg|png|gif|webp|avif)$/i.test(url);
};

const ProfilePost: React.FC<ProfilePostProps> = ({ userId, isDisabled }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`https://dynamic-wander-wallet.onrender.com/api/v1/post/getbyuserid?user_id=${userId}`);
            const postsData: Post[] = response.data.posts || [];

            const imagePosts = postsData.filter(post => isImage(post.image));

            const postsWithUsers = await Promise.all(
                imagePosts.map(async (post) => {
                    try {
                        const userRes = await axios.get('https://dynamic-wander-wallet.onrender.com/api/v1/user/get-user', {
                            params: { user_id: post.postedBy },
                        });
                        return { ...post, postedUser: userRes.data.user };
                    } catch {
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
                        <div
                            className={style.imageWrapper}
                            onClick={() => setActiveIndex(idx)}
                        >
                            <img
                                src={post.image}
                                alt="Post"
                                className={style.image}
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
                <DisplayPost
                    post={posts[activeIndex]}
                    onClose={() => setActiveIndex(null)}
                    onNext={nextPost}
                    onPrev={prevPost}
                    onDelete={fetchPosts}
                    isDisabled={isDisabled}
                />
            )}
        </div>
    );
};

export default ProfilePost;
