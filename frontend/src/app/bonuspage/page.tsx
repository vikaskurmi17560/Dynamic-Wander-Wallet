"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import style from "./bonuspage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faStar, faCoins, faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import useData from "@/hook/useData";
import ProductPage from "./ProductPage";
import WanderPoint from "./WanderPoint";

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
    const [refresh, setRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState<"product" | "wander">("product");

    const loadUser = async () => {
        try {
            const res = await axios.get("http://localhost:7050/api/v1/user/get-user", {
                params: { user_id: userId },
            });
            setUser(res.data?.user || res.data);
        } catch (error: any) {
            console.error(error?.response?.data?.message || "Error fetching user");
        }
    };

    useEffect(() => {
        if (userId) loadUser();
    }, [userId, refresh]);

    const handleRefresh = () => {
        setRefresh((prev) => !prev);
    };

    return (
        <div className={style.main}>
            <div className={style.container}>
                <h1 className={style.h1}>Reward And Cashback</h1>
                <div className={style.navbar}>
                    <div className={style.navItem} onClick={() => setActiveTab("product")}>
                        <p className={style.name}>Cashback Won</p>
                        <div className={style.number_div}>
                            <FontAwesomeIcon icon={faGift} className={style.faIcon} />
                            <p className={style.value}>$40000</p>
                        </div>
                    </div>

                    <div className={style.navItem} onClick={() => setActiveTab("wander")}>
                        <p className={style.name}>Wander Point</p>
                        <div className={style.number_div}>
                            <FontAwesomeIcon icon={faStar} className={style.faIcon} />
                            <p className={style.value}>{user?.Earnbadge_point ?? "0"}</p>
                        </div>
                    </div>

                    <div className={style.navItem}>
                        <p className={style.name}>Redeem Coins</p>
                        <div className={style.number_div}>
                            <FontAwesomeIcon icon={faCoins} className={style.faIcon} />
                            <p className={style.value}>4567</p>
                        </div>
                    </div>

                    <div className={style.navItem}>
                        <p className={style.name}>My Vouchers</p>
                        <div className={style.number_div}>
                            <FontAwesomeIcon icon={faTicketAlt} className={style.faIcon} />
                            <p className={style.value}>000</p>
                        </div>
                    </div>
                </div>

                <div className={style.reward_container}>
                    {activeTab === "product" && (
                        <ProductPage
                            WanderPoint={user?.Earnbadge_point}
                            onPurchaseSuccess={handleRefresh}
                        />
                    )}
                    {activeTab === "wander" && (
                        <WanderPoint
                            WanderPoint={user?.Earnbadge_point}
                            badgeUsageHistory={user?.badge_usage_history || []}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BonusPage;
