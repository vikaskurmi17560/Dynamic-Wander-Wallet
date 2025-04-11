'use client';

import React, { useEffect, useState } from 'react';
import style from './DisplayPost.module.css';
import { faComment, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import {
    FaHeart,
    FaRegHeart,
} from "react-icons/fa";
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
    onDelete?: () => void;
}

const DisplayPost: React.FC<IndividualPostProps> = ({
    post,
    onClose,
    onNext,
    onPrev,
    onDelete
}) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const { userId } = useData();
    const [isSetting, setIsSetting] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

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
        if (userId) {
            fetchLikes();
            fetchComments();
        }
    }, [post._id, userId]);

    const fetchLikes = async () => {
        try {
            const res = await axios.get(`http://localhost:7050/api/v1/post/like/getalldata`, {
                params: { post_id: post._id },
            });
            const allLikes = res.data.likes || [];

            setLikeCount(allLikes.length);

            const isLikedByUser = allLikes.some((like: any) => {
                const likedById = like.likedBy?._id || like.likedBy;
                return likedById === userId;
            });

            setLiked(isLikedByUser);
        } catch (error) {
            console.error("Failed to fetch likes", error);
        }
    };


    const handleLikeToggle = async () => {
        try {
            console.log("Sending like request with:", {
                post_id: post._id,
                user_id: userId,
            });
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
            console.error('❌ Failed to toggle like:', error);
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

    const handleDeletePost = async () => {
        try {
            const response = await axios.delete(`http://localhost:7050/api/v1/post/delete`, {
                params: { post_id: post._id },
                data: { userId },
            });

            if (response.data.success) {
                onClose();
                if (onDelete) onDelete();
            } else {
                alert(response.data.message || "Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Something went wrong while deleting the post.");
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
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        )}
                        <span className={style.profile_name}>
                            i_am_{post.postedUser?.name || 'Unknown User'}
                            <p className={style.profile_location}>{getLocation()}</p>
                        </span>
                        <FontAwesomeIcon icon={faEllipsisV} className={style.profile_dot_icon} onClick={() => setIsSetting((prev) => !prev)} />
                    </div>
                    {
                        isSetting ? (
                            <div className={style.setting_div}>
                                <div className={style.setting_container}>
                                    <div style={{ color: "red" }} className={style.setting_box} onClick={() => { setIsDelete((prev) => !prev); setIsSetting((prev) => !prev) }}>Delete</div>
                                    <div className={style.setting_box}>Edit</div>
                                    <div className={style.setting_box}>Hide like count to others</div>
                                    <div className={style.setting_box}>Share to.</div>
                                    <div className={style.setting_box}>Go to Post</div>
                                    <div className={style.setting_box}>About this Account</div>
                                    <div className={style.setting_box} onClick={() => setIsSetting((prev) => !prev)}>Cancel</div>
                                </div>
                            </div>
                        ) : !isSetting && isDelete && (
                            <div className={style.setting_div}>
                                {
                                    isDelete && (
                                        <div className={style.delete_div}>
                                            <div className={style.delete_heading}>
                                                <p className={style.heading_h1}>Delete post?</p>
                                                <p className={style.heading_p}>Are you sure you want to delete this post?</p>
                                            </div>
                                            <div style={{ color: "red" }} className={style.setting_box} onClick={handleDeletePost}>Delete</div>
                                            <div className={style.setting_box} onClick={() => setIsDelete((prev) => !prev)}>Cancel</div>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }

                    <div className={style.profile_comment}>
                        <div className={style.comment_div}>
                            {post.postedUser?.profile && (
                                <img
                                    src={post.postedUser.profile}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover mt-4"
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
                        <div className={style.display_comment}>
                            {comments.map((comment) => (
                                <div key={comment._id} className={style.display_comment_box}>
                                    {comment.user?.profile && (
                                        <img
                                            src={comment.user.profile}
                                            className="w-8 h-8 rounded-full object-cover"
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
                    </div>
                    <div className={style.third_main_div}>
                        <div className={style.icon_div}>
                            <div onClick={handleLikeToggle}>
                                {liked ? <FaHeart color="red" style={{ fontSize: "1.6em" }} /> : <FaRegHeart style={{ fontSize: "1.6em" }} />}
                            </div>
                            <FontAwesomeIcon icon={faComment} className={style.icon} />
                        </div>
                        <div className={style.result}>
                            <span>{likeCount} likes</span>
                            <div className="text-sm mt-1">Tags {post.tags.join(', ')}</div>
                            <div className={`${style.date}  text-gray-400`}>
                                {new Date(post.createdAt).toLocaleString()}
                            </div>
                        </div>
                        <div className={style.comment}>
                            <input
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className={style.input}
                            />
                            <button
                                onClick={handleAddComment}
                                className={style.comment_btn}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>

                <button onClick={onPrev} className={style.modalNavLeft}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button onClick={onNext} className={style.modalNavRight}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
                <FontAwesomeIcon icon={faTimes} onClick={onClose} className={style.modalClose} />
            </div>
        </div>
    );
};

export default DisplayPost;
