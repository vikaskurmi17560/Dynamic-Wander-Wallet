"use client"; // Required in Next.js App Router
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import style from "./UniquePlaces.module.css";

interface Place {
  name: string;
  path: string;
  call: string;
}

const UniquePlaces: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  const [lastScrolled, setLastScrolled] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    const checkScrollPosition = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const canScrollL = scrollLeft > 0;
        const canScrollR = scrollLeft < scrollWidth - clientWidth;
        
        setCanScrollLeft(canScrollL);
        setCanScrollRight(canScrollR);

        // Ensure only one side blinks based on last scroll direction
        if (!canScrollL) setLastScrolled("right");
        else if (!canScrollR) setLastScrolled("left");
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      setLastScrolled(direction); // Track last scrolled direction
    }
  };

  const places: Place[] = [
    { name: "Munsiyari", path: "/images/munsiyari.jpg", call: "Little Kashmir of Uttarakhand" },
    { name: "Kanatal", path: "/images/kanatal.jpg", call: "A Secluded Himalayan Retreat" },
    { name: "Abbott Mount", path: "/images/abbot_mount.jpg", call: "A Colonial-Era Ghost Town" },
    { name: "Peora", path: "/images/peora.jpg", call: "An Unexplored Eco-Village" },
    { name: "Khirsu", path: "/images/khirsu.webp", call: "A Hidden Himalayan Hamlet" },
    { name: "Dodital", path: "/images/dodital.png", call: "A High-Altitude Lake Trek" },
    { name: "Chakrata", path: "/images/chakrata.jpg", call: "A Serene Army Cantonment Hill Station" },
    { name: "Nelang Valley", path: "/images/nelang_valley.jpg", call: "The Ladakh of Uttarakhand" },
  ];

  return (
    <div className={style.container}>
      <div className={style.heading}>
        <p>For Unique Experiences</p>
        <hr className={style.line}/>
        <div className={style.scrollWrapper}>
          <button 
            className={`${style.arrow} ${canScrollLeft && lastScrolled === "left" ? style.blink : ""}`} 
            onClick={() => scroll("left")}
          >
            ◀
          </button>
          <button 
            className={`${style.arrow} ${canScrollRight && lastScrolled === "right" ? style.blink : ""}`} 
            onClick={() => scroll("right")}
          >
            ▶
          </button>
        </div>
      </div>
      <div className={style.gridContainer} ref={scrollContainerRef}>
        {places.map(({ name, path, call }, id) => (
          <div key={id} className={style.card}>
            <div className={style.imageContainer}>
              <Image src={path} alt={name} fill className={style.image} />
            </div>
            <div className={style.about}>
              <p className={style.call}>{call}</p>
              <h3 className={style.name}>{name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniquePlaces;
