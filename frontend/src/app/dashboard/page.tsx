"use client"
import React, { useState } from 'react'
import style from "./daskboard.module.css";
import Image from 'next/image';
import MyTrip from './mytrip/page';
import Watchlist from './watchlist/page';

const Dashboard = () => {
    const [activeComponent, setActiveComponent] = useState<JSX.Element>(<MyTrip />); 

    const handleTrip = () => setActiveComponent(<MyTrip />);
    const handleWatchlist = () => setActiveComponent(<Watchlist />);

    return (
        <>
            <div className={style.main}>
                <div className={style.image_div}>
                    <Image 
                        src="/images/Daskboard/HomePage.jpg" 
                        className={style.img} 
                        height={3000} 
                        width={3000} 
                        priority
                        alt="Dashboard Background" 
                    />
                    <div className={style.heading_div}></div>
                    <div className={style.btn_div}>
                        <div className={style.btn_box}>
                            <button className={style.btn} onClick={handleTrip}>See My Trips</button>
                            <p className={style.line}></p>
                            <button className={style.btn} onClick={handleWatchlist}>Cart</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.container}>
                {activeComponent}
            </div>
        </>
    );
};

export default Dashboard;
