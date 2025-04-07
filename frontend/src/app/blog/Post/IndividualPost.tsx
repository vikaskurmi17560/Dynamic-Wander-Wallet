'use client';

import React, { useEffect, useState } from 'react';
import style from './post.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faEllipsisV,
    faHeart as solidHeart,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import useData from '@/hook/useData';

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

interface Comment {
    _id: string;
    text: string;
    createdAt: string;
    user?: {
        name: string;
        profile?: string;
    };
}

interface IndividualPostProps {
    post: Post;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const IndividualPost: React.FC<IndividualPostProps> = ({
    post,
    onClose,
    onNext,
    onPrev,
}) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const { userId } = useData();

    const getLocation = () => {
        try {
            const parts = post.location.split(',');
            const city = parts[parts.length - 3]?.trim() || 'Unknown';
            const state = parts[parts.length - 2]?.trim() || 'Unknown';
            return `${city}, ${state}`;
        } catch {
            return 'Location unavailable';
        }
    };

    useEffect(() => {
        fetchLikes();
        fetchComments();
    }, [post._id]);

    const fetchLikes = async () => {
        try {
            const res = await axios.get(
                `http://localhost:7050/api/v1/post/like/getalldata`,
                { params: { post_id: post._id } }
            );
            const allLikes = res.data.likes;
            setLikeCount(allLikes.length);
            setLiked(allLikes.some((like: any) => like.user === userId));
        } catch (error) {
            console.error('Failed to fetch likes', error);
        }
    };

    const handleLikeToggle = async () => {
        try {
            const response = await axios.post(`http://localhost:7050/api/v1/post/like/create`, {
                post_id: post._id,
                user_id: userId,
            });

            if (response.data.message === "Post liked successfully") {
                setLiked(true);
                setLikeCount((prev) => prev + 1);
            } else if (response.data.message === "Like removed successfully") {
                setLiked(false);
                setLikeCount((prev) => prev - 1);
            }
        } catch (error) {
            console.error('Failed to toggle like', error);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axios.get(
                `http://localhost:7050/api/v1/post/comment/getbypost?post_id=${post._id}`
            );

            const commentsData = res.data.comments || [];
            setComments(commentsData);
        } catch (error) {
            console.error('Failed to fetch comments', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await axios.post(`http://localhost:7050/api/v1/post/comment/create`, {
                post_id: post._id,
                user_id: userId,
                text: newComment,
            });
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Failed to add comment', error);
        }
    };

    return (
        <div className={style.modal}>
            <div className={style.modalContainer}>
                <img src={post.image} alt="Post" className={style.modalImage} />

                <div className={style.modalContent}>
                    <div className={style.profile_div}>
                        {post.postedUser?.profile && (
                            <img
                                src={post.postedUser.profile}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-contain"
                            />
                        )}
                        <span className={style.profile_name}>
                            i_am_{post.postedUser?.name || 'Unknown User'}
                            <p className={style.profile_location}>{getLocation()}</p>
                        </span>
                        <FontAwesomeIcon icon={faEllipsisV} className={style.profile_dot_icon} />
                    </div>

                    <div className={style.profile_comment}>
                        <div className={style.comment_div}>
                            {post.postedUser?.profile && (
                                <img
                                    src={post.postedUser.profile}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-contain mt-4"
                                />
                            )}
                            <div>
                                <div className={style.comment_name}>
                                    <span className="text-neutral-400">
                                        i_am_{post.postedUser?.name || 'Unknown User'}
                                    </span>
                                    <span className="font-light ps-3 whitespace-pre-line">{post.description}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-3 items-center">
                        <FontAwesomeIcon
                            icon={liked ? solidHeart : regularHeart}
                            className={`cursor-pointer text-xl ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                            onClick={handleLikeToggle}
                        />
                        <span>{likeCount} likes</span>
                    </div>

                    <div className="text-sm mt-1">Tags: {post.tags.join(', ')}</div>
                    <div className="text-xs text-gray-400">
                        Posted: {new Date(post.createdAt).toLocaleString()}
                    </div>

                    <div className="mt-3">
                        <h4 className="font-semibold text-md mb-1">Comments</h4>
                        <div className="max-h-40 overflow-y-auto space-y-2 text-sm">
                            {comments.map((comment) => (
                                <div key={comment._id} className="flex items-start gap-2">
                                    {comment.user?.profile && (
                                        <img
                                            src={comment.user.profile}
                                            className="w-6 h-6 rounded-full object-cover"
                                            alt="user"
                                        />
                                    )}

                                    <div>
                                        <span className="font-semibold text-gray-700">
                                            i_am_{comment.user?.name || 'Unknown'}
                                        </span>
                                        {' '}
                                        <span>{comment.text}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2 mt-3">
                            <input
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full px-3 py-1 rounded border border-gray-300 text-sm"
                            />
                            <button
                                onClick={handleAddComment}
                                className="bg-blue-500 text-white text-sm px-3 rounded"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>

                <button onClick={onPrev} className={style.modalNavLeft}>
                    ⬅
                </button>
                <button onClick={onNext} className={style.modalNavRight}>
                    ➡
                </button>
                <FontAwesomeIcon icon={faTimes} onClick={onClose} className={style.modalClose} />
            </div>
        </div>
    );
};

export default IndividualPost;
