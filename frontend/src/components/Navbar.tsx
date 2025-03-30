"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import useData from "@/hook/useData";

function Navbar() {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  let lastScrollY = 0;
  const {isAuthenticated,handleLogout}=useData();
 
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

 

  return (
    <nav className={`${styles.navbar} ${visible ? styles.visible : styles.hidden}`}>
      <Link href="/" className={styles.logo}>
        <Image src="/images/BrandLogo.png" height={45} width={100} alt="Brand Logo" className={styles.image} />
      </Link>
      <div className={styles.menu_icon} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
      <div className={`${styles.nav_links} ${menuOpen ? styles.open : ""}`}>
        <div className={styles.left_section}>
          <Link href={"/"} className={styles.nav_item}>Home</Link>
           <div className={styles.nav_item}>Blogs</div>
          <Link href={"/trip"} className={styles.nav_item}>Trip</Link>
          <Link href={"/about"} className={styles.nav_item}>About Us</Link>
          <Link href={"/dashboard"} className={styles.nav_item}>Dashboard</Link>
          <div className={styles.nav_item}>Explore</div>
        </div>
        <div className={styles.right_section}>
         
          {
            isAuthenticated  ? (<>
             <Link href="/profile" className={styles.btn}>Profile</Link>
             <div className={styles.line}></div>
            <div className={styles.btn} onClick={handleLogout}>Log out</div>
             
            </>

            ) :(
              <Link className={styles.btn} href="/login">Log In</Link>
            )
          }
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
