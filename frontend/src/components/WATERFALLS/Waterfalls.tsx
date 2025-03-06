"use client";

import { useState, useEffect } from "react";
import style from "./Waterfalls.module.css";
import waterfallsList from "./WaterfallsList";
import { useRouter } from "next/navigation";

const Waterfalls = () => {
    const router = useRouter();
    const [startIndex, setStartIndex] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(1);

    useEffect(() => {
        const updateCardsPerView = () => {
            if (window.innerWidth > 1024) {
                setCardsPerView(3);
            } else if (window.innerWidth > 768) {
                setCardsPerView(2);
            } else {
                setCardsPerView(1);
            }
        };
        
        updateCardsPerView();
        window.addEventListener("resize", updateCardsPerView);
        return () => window.removeEventListener("resize", updateCardsPerView);
    }, []);

    const nextSlide = () => {
        if (startIndex + cardsPerView < waterfallsList.length) {
            setStartIndex(startIndex + 1);
        }
    };

    const prevSlide = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    return (
        <div className={style.container}>
            <h2 className={style.heading}>Beautiful Waterfalls of India</h2>
            <div className={style.sliderContainer}>
                <button className={style.navButton} onClick={prevSlide}>&lt;</button>
                <div className={style.flexContainer}>
                    {waterfallsList.slice(startIndex, startIndex + cardsPerView).map((waterfall) => (
                        <div key={waterfall.id} className={style.card}>
                            <div className={style.imageWrapper}>
                                <img src={waterfall.imageUrl} alt={waterfall.name} className={style.image} />
                            </div>
                            <div className={style.overlay}>
                                <h3 className={style.name}>{waterfall.name}</h3>
                                <p className={style.location}>{waterfall.location}</p>
                                <button 
                                    className={style.viewButton} 
                                    onClick={() => router.push(`/waterfalls/${waterfall.id}`)}
                                >
                                    Explore Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className={style.navButton} onClick={nextSlide}>&gt;</button>
            </div>
        </div>
    );
};

export default Waterfalls;

