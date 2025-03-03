"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import styles from "./Navbar.module.css";

function Navbar() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  let lastScrollY = 0;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_image");

    toast.success("Logged out successfully");
    router.replace("/login");
  };

  return (
    <nav className={`${styles.navbar} ${visible ? styles.visible : styles.hidden}`}>
      <Link href="/" className={styles.logo}>
        <Image src="/images/BrandLogo.png" height={50} width={100} alt="Brand Logo" className={styles.image} />
      </Link>
      <div className={styles.menu_icon} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
      <div className={`${styles.nav_links} ${menuOpen ? styles.open : ""}`}>
        <div className={styles.left_section}>
          <div className={styles.nav_item}>Home</div>
          <div className={styles.nav_item}>Blogs</div>
          <div className={styles.nav_item}>Trip</div>
          <div className={styles.nav_item}>About Us</div>
          <div className={styles.nav_item}>Daskboard</div>
          <div className={styles.nav_item}>Explore</div>
        </div>
        <div className={styles.right_section}>
          <Link href="/profile" className={styles.btn}>Profile</Link>
          <div className={styles.line}></div>
          <div className={styles.btn} onClick={handleLogout}>Log out</div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
