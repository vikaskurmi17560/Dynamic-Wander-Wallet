'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import style from './post.module.css'; 

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

interface Props {
    data: {
        post: Post;
        onClose: () => void;
        onNext: () => void;
        onPrev: () => void;
    };
}

const IndividualPost: React.FC<Props> = ({ data }) => {
    const { post, onClose, onNext, onPrev } = data;

    return (
        <div className={style.modal}>
            <div className={style.modalContainer}>
                <img
                    src={post.image}
                    alt="Post"
                    className={style.modalImage}
                />
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
                            <p className={style.profile_location}>
                                {
                                    (() => {
                                        try {
                                            const parts = post.location.split(',');
                                            const city = parts[parts.length - 3]?.trim() || 'Unknown';
                                            const state = parts[parts.length - 2]?.trim() || 'Unknown';
                                            return `${city}, ${state}`;
                                        } catch {
                                            return 'Location unavailable';
                                        }
                                    })()
                                }
                            </p>
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
                                    <span className="font-light ps-3 whitespace-pre-line">
                                        {post.description}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm mt-1">Tags: {post.tags.join(', ')}</div>
                    <div className="text-xs text-gray-400">
                        Posted: {new Date(post.createdAt).toLocaleString()}
                    </div>
                </div>

                <button onClick={onPrev} className={style.modalNavLeft}>⬅</button>
                <button onClick={onNext} className={style.modalNavRight}>➡</button>
                <FontAwesomeIcon icon={faTimes} onClick={onClose} className={style.modalClose} />
            </div>
        </div>
    );
};

export default IndividualPost;
