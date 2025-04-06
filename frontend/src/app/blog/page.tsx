"use client";

import { useState } from "react";
import styles from "./blog.module.css";
import { FaPen, FaVideo } from "react-icons/fa";
import Post from "./Post/page";
import Reels from "./Reels/page";

type Tab = "post" | "reels";

const Blog: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>("post");

    return (
        <div className={styles.wrapper}>
            <div className={styles.buttonContainer}>
                <div
                    className={`${styles.btn} ${activeTab === "post" ? styles.active : ""}`}
                    onClick={() => setActiveTab("post")}
                >
                    <FaPen className={styles.icon} />
                    <span>Post</span>
                </div>
                <div
                    className={`${styles.btn} ${activeTab === "reels" ? styles.active : ""}`}
                    onClick={() => setActiveTab("reels")}
                >
                    <FaVideo className={styles.icon} />
                    <span>Reels</span>
                </div>
            </div>

            <div className={styles.content}>
                {activeTab === "post" ? <Post /> : <Reels />}
            </div>
        </div>
    );
};

export default Blog;
