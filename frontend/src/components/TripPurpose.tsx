import React from 'react'
import style from "./TripPurpose.module.css";
import Image from 'next/image';

const TripPurpose = () => {
    const Arr = [
        {
            name : "adventure",
            subname : "trails",
            photo : "/images/adventure.jpg",
        },
        {
            name : "honeymoon",
            subname : "trip",
            photo : "/images/honeymoon.jpg",
        },
        {
            name : "Spiritual",
            subname : "visit",
            photo : "/images/temples.jpg",
        },
        {
            name : "family",
            subname : "vacation",
            photo : "/images/family.jpg",
        },
    ];
  return (
    <div className={style.main}>
      <div className={style.redbox}>
        <div style={{textAlign : "center"}}>
            <p className={style.choose}>choose your</p>
            <p className={style.travel}>travel style</p>
        </div>
        <div className={style.box_div}>
            {
                Arr.map(({name , subname , photo},id) => (
                    <div key={id} className={style.card}>
                        <Image  src={photo} alt='Loading...' width={300} height={300} className={style.photo}/>
                        <div className={style.data}>
                            <p className={style.name}>{name}</p>
                            <p className={style.subname}>{subname}</p>
                        </div>
                    </div>
                ))
            }
        </div>
      </div>
    </div>
  )
}

export default TripPurpose;
