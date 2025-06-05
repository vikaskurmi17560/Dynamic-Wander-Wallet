"use client";

import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import Places from "./Places";
import styles from "./Destination.module.css";

const Destination = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(3);

    useEffect(() => {
        const updateCardsPerView = () => {
            if (window.innerWidth <= 648) setCardsPerView(1); 
            else if (window.innerWidth <= 1024) setCardsPerView(2); 
            else setCardsPerView(3); 
        };

        updateCardsPerView();
        window.addEventListener("resize", updateCardsPerView);
        return () => window.removeEventListener("resize", updateCardsPerView);
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex - cardsPerView < 0 ? Places.length - cardsPerView : prevIndex - cardsPerView
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + cardsPerView >= Places.length ? 0 : prevIndex + cardsPerView
        );
    };

    const Photo = [
        "/images/Destination/tajmahal.jpeg", "/images/Destination/jaipur.jpg", "/images/Destination/ladak.jpg",
        "/images/Destination/goa.jpg", "/images/Destination/kerala.jpg", "/images/Destination/manali.jpg",
        "/images/Destination/varanshi.jpeg", "/images/Destination/rishikesh.jpeg", "/images/Destination/andaman.jpg",
        "/images/Destination/darjeling.jpg", "/images/Destination/udaipur.jpg", "/images/Destination/coorg.jpg",
        "/images/Destination/shillong.jpg", "/images/Destination/hampi.jpg", "/images/Destination/ooty.jpg",
        "/images/Destination/amristar.jpg", "/images/Destination/kaziranga.jpeg", "/images/Destination/ranthambore.cms",
        "/images/Destination/auli.jpg"
    ];

    const visiblePlaces = Places.slice(currentIndex, currentIndex + cardsPerView);

    return (
        <div className={styles.carouselContainer}>
            <div className={styles.upperdiv}>
                <div className={styles.heading}>Famous Destinations</div>
                <div className={styles.buttonContainer}>
                    <button onClick={handlePrev} className={styles.arrowButton} aria-label="Previous">
                        <FaChevronLeft size={20} />
                    </button>
                    <button onClick={handleNext} className={styles.arrowButton} aria-label="Next">
                        <FaChevronRight size={20} />
                    </button>
                </div>
            </div>
            <div className={styles.gridContainer}>
                {visiblePlaces.map(({ name, location, type, description, link }, index) => (
                    <div key={index} className={styles.card}>
                        <Image
                            src={Photo[(currentIndex + index) % Photo.length]}
                            alt={name}
                            width={200}
                            height={200}
                            className={styles.cardImage}
                        />
                        <h2 className={styles.imageText}>{name}</h2>
                        <div className={styles.cardContent}>
                            <p className={styles.cardLocation}>{location}</p>
                            <p className={styles.cardType}>{type}</p>
                            <div className={styles.cardTextWrapper}>
                                <p className={styles.cardText}>{description}</p>
                            </div>
                            <Link href={link} target="_blank" rel="noopener noreferrer" className={styles.cardButton}>
                                Explore <span className={styles.arrow}>&rarr;</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Destination;