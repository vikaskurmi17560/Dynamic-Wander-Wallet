import React from "react";
import Image from "next/image";
import style from "./ExplorePage.module.css";

const ExplorePage = () => {
  const places = [
    { name: "Nainital", path: "/images/nainital.jpg" },
    { name: "Mussoorie", path: "/images/mussorie.jpg" },
    { name: "Rishikesh", path: "/images/rishikesh.jpg" },
    { name: "Auli", path: "/images/auli.jpg" },
    { name: "Badrinath", path: "/images/badrinath.jpg" },
    { name: "Jim Corbett", path: "/images/corbett.jpg" },
    { name: "Valley of Flowers", path: "/images/valley.jpg" },
    { name: "Chopta", path: "/images/chopta.jpg" },
    { name: "Haridwar", path: "/images/haridwar.jpg" },
  ];

  return (
    <div className={style.container}>
      <h2 className={style.heading}>Explore Uttarakhand</h2>
      <div className={style.grid}>
        {places.map(({ name, path }, id) => (
          <div key={id} className={style.card}>
            <Image src={path} alt={name} width={500} height={130} className={style.image} />
            <p className={style.name}>{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
