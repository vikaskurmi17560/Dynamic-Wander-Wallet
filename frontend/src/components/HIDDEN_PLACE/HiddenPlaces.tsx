"use client";

import { useState, useEffect } from "react";
import style from "./Hidden_Places.module.css";
import List from "./HiddenList.js";
import { useRouter } from "next/navigation";

const HiddenPlaces = () => {
    const [startIndex, setStartIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const router = useRouter();

    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth <= 600) {
                setItemsPerPage(1);
            } else if (window.innerWidth <= 1024) {
                setItemsPerPage(3);
            } else if (window.innerWidth <= 1524) {
                setItemsPerPage(4);
            }
            else {
                setItemsPerPage(5);
            }
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);

        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, []);

    const visiblePlaces = List.slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => {
        if (startIndex + itemsPerPage < List.length) {
            setStartIndex(startIndex + itemsPerPage);
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - itemsPerPage);
        }
    };

    return (
        <div className={style.container}>
            <h2 className={style.heading}>Hidden Destinations</h2>
            <div className={style.placesContainer}>
                {visiblePlaces.map((place, index) => (
                    <div key={index} className={style.card}>
                        <img src={place.imageUrl} alt={place.name} className={style.image} />
                        <div className={style.overlay}>
                            <h3 className={style.name}>{place.name}</h3>
                            <p className={style.location}>{place.location}</p>
                            <button 
                                className={style.viewButton} 
                                // onClick={() => router.push(`/places/${place.id}`)}
                            >
                                View More
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className={style.buttons}>
                <button onClick={handlePrev} className={style.button} disabled={startIndex === 0}>Previous</button>
                <button onClick={handleNext} className={style.button} disabled={startIndex + itemsPerPage >= List.length}>Next</button>
            </div>
        </div>
    );
};

export default HiddenPlaces;
