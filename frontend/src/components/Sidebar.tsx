"use client";

import styles from "./Sidebar.module.css";
import {
  FaPen,
  FaVideo,
  FaHome,
  FaPlus,
  FaUser,
  FaCompass,
  FaTachometerAlt,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  activeTab?: "post" | "reels";
  onTabChange?: (tab: "post" | "reels") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const handleTabClick = (tab: "post" | "reels") => {
    onTabChange?.(tab); 
  };

  return (
    <div className={styles.buttonContainer}>
      <Link href="/" className={styles.logo}>
        <Image
          src="/images/LOGOPIC.png"
          height={65}
          width={150}
          alt="Brand Logo"
          className={styles.image}
          priority
        />
      </Link>

      <div
        className={`${styles.btn} ${isActive("/") ? styles.active : ""}`}
        onClick={() => router.push("/")}
      >
        <FaHome className={styles.icon} />
        <span>Home</span>
      </div>

      <div
        className={`${styles.btn} ${activeTab === "post" ? styles.active : ""}`}
        onClick={() => { handleTabClick("post"); router.push("/blog") }}
      >
        <FaPen className={styles.icon} />
        <span>Post</span>
      </div>

      <div
        className={`${styles.btn} ${activeTab === "reels"? styles.active : ""}`}
        onClick={() => { handleTabClick("reels"); router.push("/blog") }}
      >
        <FaVideo className={styles.icon} />
        <span>Reels</span>
      </div>

      <div
        className={`${styles.btn} ${isActive("/create") ? styles.active : ""}`}
        onClick={() => router.push("/create")}
      >
        <FaPlus className={styles.icon} />
        <span>Create</span>
      </div>

      <div
        className={`${styles.btn} ${isActive("/explore") ? styles.active : ""}`}
        onClick={() => router.push("/explore")}
      >
        <FaCompass className={styles.icon} />
        <span>Explore</span>
      </div>

      <div
        className={`${styles.btn} ${isActive("/dashboard") ? styles.active : ""}`}
        onClick={() => router.push("/dashboard")}
      >
        <FaTachometerAlt className={styles.icon} />
        <span>Dashboard</span>
      </div>

      <div
        className={`${styles.btn} ${isActive("/profile") ? styles.active : ""}`}
        onClick={() => router.push("/profile")}
      >
        <FaUser className={styles.icon} />
        <span>Profile</span>
      </div>
    </div>
  );
};

export default Sidebar;
