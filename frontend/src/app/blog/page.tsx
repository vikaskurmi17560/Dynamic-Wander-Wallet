"use client";

import { useState } from "react";
import styles from "./blog.module.css";
import { 
  FaPen, 
  FaVideo, 
  FaHome, 
  FaPlus, 
  FaUser, 
  FaCompass, 
  FaTachometerAlt 
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Post from "./Post/page";
import Reels from "./Reels/page";

type Tab = "post" | "reels";

const Blog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("post");
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <div className={styles.buttonContainer}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/BrandLogo.png"
            height={45}
            width={100}
            alt="Brand Logo"
            className={styles.image}
            priority
          />
        </Link>

        {/* Navigation Buttons */}
        <div className={styles.btn} onClick={() => router.push("/")}>
          <FaHome className={styles.icon} />
          <span>Home</span>
        </div>
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
        <div className={styles.btn} onClick={() => router.push("/create")}>
          <FaPlus className={styles.icon} />
          <span>Create</span>
        </div>

        <div className={styles.btn} onClick={() => router.push("/explore")}>
          <FaCompass className={styles.icon} />
          <span>Explore</span>
        </div>

        <div className={styles.btn} onClick={() => router.push("/dashboard")}>
          <FaTachometerAlt className={styles.icon} />
          <span>Dashboard</span>
        </div>

        <div className={styles.btn} onClick={() => router.push("/profile")}>
          <FaUser className={styles.icon} />
          <span>Profile</span>
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === "post" ? <Post /> : <Reels />}
      </div>
    </div>
  );
};

export default Blog;
