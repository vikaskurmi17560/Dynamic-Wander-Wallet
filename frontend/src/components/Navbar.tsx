"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import styles from "./Navbar.module.css";
import useData from "@/hook/useData";
import useLocation from "@/hook/useLocation";

function Navbar() {
  const { isTripEnd } = useLocation();
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { isAuthenticated, handleLogout } = useData();

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > lastScrollY.current && window.scrollY > 100) {
  //       setVisible(false);
  //     } else {
  //       setVisible(true);
  //     }
  //     lastScrollY.current = window.scrollY;
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    <nav className={`${styles.navbar} ${visible ? styles.visible : styles.hidden}`}>
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

      <div className={styles.menu_icon} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`${styles.nav_links} ${menuOpen ? styles.open : ""}`}>
        <div className={styles.left_section}>
          <Link href="/" className={styles.nav_item}>
            Home
          </Link>
          <Link href="/blog" className={styles.nav_item}>Blogs</Link>
          <Link href={!isTripEnd ? "/trip" : "/trip/TripCheckpoint"} className={styles.nav_item}>
            Trip
          </Link>
          <Link href="/create" className={styles.nav_item}>
            Create
          </Link>
          <Link href="/dashboard" className={styles.nav_item}>
            Dashboard
          </Link>
          <Link href="/explore" className={styles.nav_item}>
            Explore
          </Link>
          <Link href="/bonuspage" className={styles.nav_item}>
            Wallet
          </Link>
        </div>

        <div className={styles.right_section}>
          {isAuthenticated ? (
            <>
              <Link href="/profile" className={styles.btn}>
                Profile
              </Link>
              <div className={styles.line}></div>
              <div className={styles.btn} onClick={handleLogout}>
                Log out
              </div>
            </>
          ) : (
            <Link className={styles.btn} href="/login">
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
