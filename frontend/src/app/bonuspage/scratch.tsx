import ScratchCard from "@/app/bonuspage/ScratchCard";
import { useData } from "@/context/UserContext";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import style from "./scratch.module.css";

interface ScratchPageProps {
  onPurchaseSuccess?: () => void;
}

const getRandomCashback = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const ScratchPage: React.FC<ScratchPageProps> = ({ onPurchaseSuccess }) => {
  const [cashback, setCashback] = useState<number | null>(null);
  const { userId } = useData();
  const [allCashback, setAllCashback] = useState<number[]>([]);
  const [numberOfScratchCards, setNumberOfScratchCards] = useState<number>(0);
  const hasHandled = useRef(false);

  const fetchCashback = async () => {
    try {
      const res = await axios.get("https://dynamic-wander-wallet.onrender.com/api/v1/user/get-user", {
        params: { user_id: userId },
      });

      const user = res?.data?.user;
      setAllCashback(user?.history_cashback || []);
      setNumberOfScratchCards(user?.number_scratch_card || 0);
    } catch (error) {
      console.error("Failed to fetch cashback history:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchCashback();
    const value = getRandomCashback(10, 200);
    setCashback(value);
  }, [userId]);

  const handleCashback = async () => {
    if (!userId || cashback === null || hasHandled.current) return;

    try {
      hasHandled.current = true;

      const res = await axios.post(
        "https://dynamic-wander-wallet.onrender.com/api/v1/product/cashback",
        { cashback, userId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (onPurchaseSuccess) onPurchaseSuccess();
      alert(`You won ₹${cashback}!`);
      fetchCashback();
      console.log("Cashback saved:", res.data);
    } catch (err) {
      console.error("Error sending cashback:", err);
    }
  };

  return (
    <div className={style.div} style={{ padding: "2rem" }}>
      <h1 className={style.heading}>🎉 Scratch & Claim your rewards</h1>

      <div className={style.cashback_div}>
        {numberOfScratchCards > 0 ? (
          Array.from({ length: numberOfScratchCards }).map((_, index) => (
            <ScratchCard
              key={index}
              rewardText={`₹${cashback} Cashback!`}
              onComplete={handleCashback}
            />
          ))
        ) : (
          <p className={style.no_reward}>Currently no reward cards available....</p>
        )}
      </div>

      <h3 className={style.sub_heading}>Claimed Cashbacks</h3>
      <div className={style.box_div}>
        {allCashback.length ? (
          allCashback.map((value, index) => (
            <div key={index} className={style.card}>
              <p>You Won</p>
              <p className={style.value}>₹{value}</p>
            </div>
          ))
        ) : (
          <p className={style.no_reward}>No cashback history yet.</p>
        )}
      </div>
    </div>
  );
};

export default ScratchPage;
