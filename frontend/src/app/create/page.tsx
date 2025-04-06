'use client';
import React, { useState } from 'react';
import styles from "./create.module.css";
import PostPage from './PostPage';

type ContentType = 'post' | 'reels';

const CreatePage: React.FC = () => {
    const [type, setType] = useState<ContentType>('post');

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.nav}>
                    <button
                        className={`${styles.navButton} ${type === 'post' ? styles.active : ''}`}
                        onClick={() => setType('post')}
                    >
                        📝 Post
                    </button>
                    <button
                        className={`${styles.navButton} ${type === 'reels' ? styles.active : ''}`}
                        onClick={() => setType('reels')}
                    >
                        🎥 Reels
                    </button>
                </div>
            </div>
            {type === 'post' ? (
                <PostPage />
            ) : (
                <form className={styles.form}>
                    <label htmlFor="reelTitle">Reel Title</label>
                    <input type="text" id="reelTitle" placeholder="Enter your reel title" />

                    <label htmlFor="reelFile">Upload Reel</label>
                    <input type="file" id="reelFile" accept="video/*" />

                    <button type="submit" className={styles.submit}>
                        Upload Reel
                    </button>
                </form>
            )}
        </>
    )
};

export default CreatePage;
