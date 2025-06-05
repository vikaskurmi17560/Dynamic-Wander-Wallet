"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import styles from "./Navbar.module.css";
import useLocation from "@/hook/useLocation";
import { useData } from "@/context/UserContext";

function Navbar() {
  const { isTripEnd } = useLocation();
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, handleLogout } = useData();

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
          <Link href="/" className={styles.nav_item} onClick={() => setMenuOpen(!menuOpen)}>
            Home
          </Link>
          <Link href={isAuthenticated ? "/blog" : "/login"} className={styles.nav_item} onClick={() => setMenuOpen(!menuOpen)}>
            Blogs
          </Link>
          <Link href={isAuthenticated ? !isTripEnd ? "/trip" : "/trip/TripCheckpoint" : "/login"} className={styles.nav_item} onClick={() => setMenuOpen(!menuOpen)}>
            Trip
          </Link>
          <Link href={isAuthenticated ? "/create" : "/login"} className={styles.nav_item} onClick={() => setMenuOpen(!menuOpen)}>
            Create
          </Link>
          <Link href={isAuthenticated ? "/dashboard" : "/login"} className={styles.nav_item} onClick={() => setMenuOpen(!menuOpen)}>
            Dashboard
          </Link>
          <Link href={isAuthenticated ? "/explore" : "/login"} className={styles.nav_item} onClick={() => setMenuOpen(!menuOpen)}>
            Explore
          </Link>
          <Link href="/bonuspage" className={styles.nav_item} onClick={() => setMenuOpen(!menuOpen)}>
            Wallet
          </Link>
        </div>

        <div className={styles.right_section}>
          {isAuthenticated ? (
            <>
              <Link href="/profile" className={styles.btn} onClick={() => setMenuOpen(!menuOpen)}>
                Profile
              </Link>
              <div className={styles.line}></div>
              <div className={styles.btn} onClick={handleLogout}>
                Log out
              </div>
            </>
          ) : (
            <Link className={styles.btn} href="/login" onClick={() => setMenuOpen(!menuOpen)}>
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
