"use client";

import React, { useState } from "react";
import styles from "./create.module.css";
import PostPage from "./PostPage";
import ReelPage from "./ReelPage";
import Sidebar from "@/components/Sidebar";

type ContentType = "post" | "reels";

const CreatePage: React.FC = () => {
  const [type, setType] = useState<ContentType>("post");

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.nav}>
          <button
            className={`${styles.navButton} ${type === "post" ? styles.active : ""}`}
            onClick={() => setType("post")}
          >
            📝 Post
          </button>
          <button
            className={`${styles.navButton} ${type === "reels" ? styles.active : ""}`}
            onClick={() => setType("reels")}
          >
            🎥 Reels
          </button>
        </div>
        {type === "post" ? <PostPage /> : <ReelPage />}
      </div>
    </div>
  );
};

export default CreatePage;
