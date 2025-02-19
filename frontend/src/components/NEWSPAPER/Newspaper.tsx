"use client";

import { useState } from "react";
import Image from "next/image";
import style from "./Newspaper.module.css";

const Newspaper = () => {
  const News = [
    {
      companyname: "YourStory",
      link: "",
      logo: "/images/Newspaper/yourstory.png",
      date: "Dec 02, 2024",
      comment:
        "PickYourTrail is also carving a niche for itself in this space and intends to become a one-stop shop for personalised vacation",
    },
    {
      companyname: "The Hindu",
      link: "",
      logo: "/images/Newspaper/hindu.avif",
      date: "Nov 21, 2024",
      comment:
        "With offbeat experiences and a platter-full of trending destinations, PickYourTrail is helping change the way people travel",
    },
    {
      companyname: "nasscom",
      link: "",
      logo: "/images/Newspaper/nasscom.avif",
      date: "Sep 23, 2024",
      comment:
        "Tailor made to suit the needs of the travellers, Pickyourtrail offers a much-needed respite from packaged tours",
    },
    {
      companyname: "the economic times",
      link: "",
      logo: "/images/Newspaper/economic.avif",
      date: "Feb 10, 2025",
      comment:
        "Pickyourtrail uses its unique matching algorithms and price comparison engine to help travellers create customised tour packages at competitive online prices.",
    },
    {
      companyname: "times of india",
      link: "",
      logo: "/images/Newspaper/toi.jpg",
      date: "Jan 04, 2024",
      comment:
        "Pickyourtrail has helped book international vacations for over 10,000 travelers since 2014",
    },
  ];

  const [hoveredCompany, setHoveredCompany] = useState(News[0]);

  return (
    <div className={style.main}>
      <p className={style.heading}>What the press says</p>

      <div className={style.logo_div}>
        {News.map((newsItem, id) => (
          <div
            key={id}
            className={style.block}
            style={{
              borderBottom:
                hoveredCompany.companyname === newsItem.companyname
                  ? "2px solid green"
                  : "",
            }}
          >
            <Image
              src={newsItem.logo}
              alt={newsItem.companyname}
              width={200}
              height={200}
              className={style.logo}
              onMouseEnter={() => setHoveredCompany(newsItem)}
            />
          </div>
        ))}
      </div>

      {hoveredCompany && (
        <div className={style.details}>
          <p className={style.comment}>"{hoveredCompany.comment}"</p>
          <div className={style.about}>
            <span className={style.name}>{hoveredCompany.companyname}</span>
            <span className={style.date}>{hoveredCompany.date}</span>
            <span className={style.link}>
              Read more on {hoveredCompany.companyname}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newspaper;
