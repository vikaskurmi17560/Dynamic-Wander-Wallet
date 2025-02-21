"use client";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import style from "./DestinationGuide.module.css";

const destinations = [
  { state: "Rajasthan", places: ["Jaipur", "Udaipur", "Jaisalmer", "Jodhpur", "Pushkar"] },
  { state: "Kerala", places: ["Alleppey", "Munnar", "Kochi", "Wayanad", "Thekkady"] },
  { state: "Goa", places: ["Baga Beach", "Calangute", "Fort Aguada", "Dudhsagar Falls", "Anjuna Beach"] },
  { state: "Himachal Pradesh", places: ["Manali", "Shimla", "Dharamshala", "Kasol", "Spiti Valley"] },
  { state: "Uttarakhand", places: ["Rishikesh", "Mussoorie", "Nainital", "Haridwar", "Auli"] },
  { state: "Maharashtra", places: ["Mumbai", "Lonavala", "Pune", "Mahabaleshwar", "Ajanta Caves"] },
  { state: "Tamil Nadu", places: ["Chennai", "Ooty", "Kodaikanal", "Mahabalipuram", "Madurai"] },
  { state: "Delhi", places: ["Red Fort", "Qutub Minar", "India Gate", "Lotus Temple", "Akshardham"] },
  { state: "West Bengal", places: ["Darjeeling", "Kolkata", "Sundarbans", "Kalimpong", "Shantiniketan"] },
  { state: "Jammu & Kashmir", places: ["Srinagar", "Gulmarg", "Leh", "Pahalgam", "Sonmarg"] },
  { state: "Punjab", places: ["Amritsar", "Golden Temple", "Wagah Border", "Jalandhar", "Patiala"] },
  { state: "Gujarat", places: ["Ahmedabad", "Gir National Park", "Dwarka", "Somnath", "Kutch"] },
  { state: "Madhya Pradesh", places: ["Khajuraho", "Bhopal", "Kanha National Park", "Gwalior", "Ujjain"] },
  { state: "Andhra Pradesh", places: ["Visakhapatnam", "Tirupati", "Vijayawada", "Araku Valley", "Lepakshi"] },
  { state: "Telangana", places: ["Hyderabad", "Charminar", "Golconda Fort", "Ramoji Film City", "Warangal"] },
  { state: "Odisha", places: ["Puri", "Konark Sun Temple", "Bhubaneswar", "Chilika Lake", "Cuttack"] },
  { state: "Assam", places: ["Kaziranga National Park", "Guwahati", "Majuli", "Manas National Park", "Tezpur"] },
  { state: "Chhattisgarh", places: ["Chitrakote Falls", "Jagdalpur", "Raipur", "Barnawapara Wildlife Sanctuary", "Sirpur"] },
  { state: "Haryana", places: ["Kurukshetra", "Panipat", "Gurgaon", "Pinjore Gardens", "Surajkund"] },
  { state: "Tripura", places: ["Agartala", "Neermahal", "Unakoti", "Sepahijala Wildlife Sanctuary", "Jampui Hills"] },
];


const DestinationGuide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isView, setIsView] = useState(3);

  useEffect(() => {
    const handlePerView = () => {
      if (window.innerWidth <= 648) setIsView(1);
      else if (window.innerWidth <= 1024) setIsView(2);
      else setIsView(4);
    };

    handlePerView();
    window.addEventListener("resize", handlePerView);
    return () => window.removeEventListener("resize", handlePerView);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + isView) % destinations.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - isView + destinations.length) % destinations.length);
  };

  const visibleDestinations = destinations.slice(currentIndex, currentIndex + isView).concat(
    currentIndex + isView > destinations.length
      ? destinations.slice(0, (currentIndex + isView) % destinations.length)
      : []
  );

  return (
    <div className={style.guideContainer}>
      <div className={style.upperdiv}>
        <div className={style.heading}>Destination Guides</div>
        <div className={style.buttonContainer}>
          <button onClick={handlePrev} className={style.arrowButton} aria-label="Previous">
            <FaChevronLeft size={20} />
          </button>
          <button onClick={handleNext} className={style.arrowButton} aria-label="Next">
            <FaChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className={style.stateContainer}>
        {visibleDestinations.map((destination, index) => (
          <div key={index} className={style.flipCard}>
            <div className={style.flipInner}>
              <div className={style.flipFront}>
                <h3 className={style.stateName}>{destination.state}</h3>
              </div>
              <div className={style.flipBack}>
                <ul className={style.placesList}>
                  {destination.places.map((place, idx) => (
                    <li key={idx} className={style.placeItem}>{place}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationGuide;
