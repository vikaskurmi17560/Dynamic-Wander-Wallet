"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar"; 
import Post from "./Post/page";
import Reels from "./Reels/page";
import styles from "./blog.module.css";


const Blog = () => {
  const [activeTab, setActiveTab] = useState<"post" | "reels">("post");

  return (
    <div className={styles.wrapper}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={styles.content}>
        {activeTab === "post" ? <Post /> : <Reels />}
      </div>
    </div>
  );
};

export default Blog;
