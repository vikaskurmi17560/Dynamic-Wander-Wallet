'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './post.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import useData from '@/hook/useData';
import IndividualPost from './IndividualPost'; 

interface User {
    _id: string;
    name: string;
    profile?: string;
}

interface Post {
    _id: string;
    image: string;
    description: string;
    tags: string[];
    location: string;
    createdAt: string;
    postedBy: string;
    postedUser?: User;
}

const PostCard: React.FC = () => {
    const { userId } = useData();
    const [posts, setPosts] = useState<Post[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:7050/api/v1/post/getallpost');
                const postsData: Post[] = response.data;
                
                const postsWithUsers = await Promise.all(
                    postsData.map(async (post) => {
                        try {
                            const userRes = await axios.get('http://localhost:7050/api/v1/user/get-user', {
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

        fetchPosts();
    }, []);

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
                        <img
                            src={post.image}
                            alt="Post"
                            className={style.image}
                            onClick={() => setActiveIndex(idx)}
                        />
                    </div>
                ))}
            </div>

            {activeIndex !== null && (
                <IndividualPost
                    data={{
                        post: posts[activeIndex],
                        onClose: () => setActiveIndex(null),
                        onNext: nextPost,
                        onPrev: prevPost,
                    }}
                />
            )}
        </div>
    );
};

export default PostCard;
