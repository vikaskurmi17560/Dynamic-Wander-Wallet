"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faStar, faCoins, faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import style from "./bonuspage.module.css";
import useData from "@/hook/useData";
import { useEffect, useState } from "react";
import axios from "axios";

interface BadgeUsage {
    product_id: string;
    used_points: number;
    used_at: string;
}

interface User {
    _id: string;
    name: string;
    profile?: string;
    email: string;
    phone_no: string;
    gender?: string;
    banner?: string;
    bio?: string;
    Earnbadge_point: number;
    badge_usage_history: BadgeUsage[];
    total_trip: number;
    posts: string[];
    followers: string[];
    following: string[];
    createdAt: string;
    updatedAt: string;
}

const BonusPage = () => {
    const { userId } = useData();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await axios.get("http://localhost:7050/api/v1/user/get-user", {
                    params: { user_id: userId },
                });
                setUser(res.data);
            } catch (error: any) {
                throw new Error(error?.response?.data?.message || "Error fetching user");
            }
        }
        loadUser();
    }, [userId]);

    return (
        <div className={style.main}>
            <div className={style.container}>
                <h1 className={style.h1}>Reward And Cashback</h1>
                <div className={style.navbar}>
                    <div className={style.navItem}>
                        <p className={style.name}>Cashback Won</p>
                        <div className={style.number_div}>
                            <FontAwesomeIcon icon={faGift} className={style.faIcon} />\
                            <p className={style.value}>$40000</p>
                        </div>
                    </div>
                    <div className={style.navItem}>
                        <p className={style.name}>Wander Point</p>
                        <div className={style.number_div}>
                            <FontAwesomeIcon icon={faStar} className={style.faIcon} />\
                            {/* <p className={style.value}>{user.Earnbadge_point}</p> */}
                        </div>
                    </div>
                    <div className={style.navItem}>
                        <p className={style.name}>Redeem Coins</p>
                        <div className={style.number_div}>
                            <FontAwesomeIcon icon={faCoins} className={style.faIcon} />\
                            <p className={style.value}>4567</p>
                        </div>
                    </div>
                    <div className={style.navItem}>
                        <p className={style.name}>My Vouchers</p>
                        <div className={style.number_div}>
                            <FontAwesomeIcon icon={faTicketAlt} className={style.faIcon} />\
                            <p className={style.value}>000</p>
                        </div>
                    </div>
                </div>
                <div className={style.reward_container}>

                </div>
            </div>
        </div>
    );
};

export default BonusPage;
