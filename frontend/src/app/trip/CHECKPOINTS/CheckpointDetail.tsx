"use client";

import { useState, useEffect } from "react";
import style from "./checkpoint.module.css";
import Image from "next/image";
import CheckpointForm from "./CheckpointForm";
import useLocation from "@/hook/useLocation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaFlagCheckered } from "react-icons/fa";
import { updateCheckpointBudgets } from "./updateCheckpointBudgets";
import { useData } from "@/context/UserContext";

const CheckpointDetail = () => {
  const router = useRouter();
  const { userId } = useData();
  const [checkpoints, setCheckpoints] = useState<any[]>([]);
  const [lineHeight, setLineHeight] = useState(120);
  const { isCheckpoint, toggleCheckpoint, tripId, toggleTripEnd } = useLocation();
  const [showReward, setShowReward] = useState(false);
  const [earnBadgePoint, setEarnBadgePoint] = useState(0);
  const handleTripEnd = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Saving checkpoint...");

      const result = await updateCheckpointBudgets(String(tripId), String(userId));
      const budgetPoint = result.earnedPoints;

      setEarnBadgePoint(budgetPoint);
      setShowReward(true);

      if (result.success) {
        console.log("Trip budget updated:", result.tripBudget);
      } else {
        alert("Failed to update budgets: " + result.error);
      }
      setTimeout(() => {
        setShowReward(false);
        toggleTripEnd();
        router.push(`/trip/CHECKPOINTS/tripend`);
      }, 6000);
      console.log("Checkpoint saved. Redirecting...");
    } catch (error) {
      console.error("Error ending trip:", error);
      alert("Failed to end the trip. Redirecting anyway...");
    }
  };

  useEffect(() => {
    setLineHeight(140 + checkpoints.length * 130);
  }, [checkpoints]);

  useEffect(() => {
    if (!tripId) return;

    async function fetchCheckpoints() {
      try {
        const res = await axios.get("https://dynamic-wander-wallet.onrender.com/api/v1/checkpoint/getbytripid", {
          params: { tripId },
        });

        setCheckpoints(res.data.checkpoints || []);
      } catch (err) {
        console.error("Error fetching checkpoints:", err);
      }
    }

    fetchCheckpoints();
  }, [tripId]);

  const handleCheckpointAdded = (newCheckpoint: any) => {
    setCheckpoints((prev) => [...prev, newCheckpoint]);
  };

  const handleAddCheckpoint = () => {
    toggleCheckpoint();
  };

  const handleViewCheckpointDetails = (checkpointId: string) => {
    router.push(`/trip/CHECKPOINTS/${checkpointId}`);
  };

  return (
    <div className={style.container}>
      <div className={style.lineContainer} style={{ height: `${lineHeight}px` }}>
        <div className={style.line}></div>

        {checkpoints.map((checkpoint, index) => (
          <div key={checkpoint._id} className={style.checkpoint} style={{ top: `${index * 130}px ` }}>
            <div className={style.flagContainer}>
              <Image
                src="/images/Trip/checkpoint.png"
                width={70}
                height={70}
                alt="Checkpoint"
                className={style.flag}
              />
            </div>
            <div
              className={`${style.box} ${index % 2 === 0 ? style.leftBox : style.rightBox}`}
            >
              <p className={style.checkpoint_number}>Checkpoint {index + 1}</p>
              <div className={style.box_div_location}>
                <Image
                  src="/images/Trip/start_location.png"
                  width={500}
                  height={500}
                  alt="Loading..."
                  className={style.img}
                />
                <div className={style.name}>{checkpoint.source?.name || "N/A"}</div>
              </div>
              <div className={style.box_div_location}>
                <Image
                  src="/images/Trip/destination.png"
                  width={500}
                  height={500}
                  alt="Loading..."
                  className={style.img}
                />
                <div className={style.name}>{checkpoint.destination?.name || "N/A"}</div>
              </div>
              <div className={style.btn_box}>
                <button className={style.button}
                  title="Click to View Full Details"
                  onClick={() => handleViewCheckpointDetails(checkpoint._id)}
                >
                  Detail
                </button>
                <button
                  className={style.btn2}
                  onClick={() => router.push(`/hotels?tripId=${tripId}&checkpointId=${checkpoint._id}`)}
                >
                  Hotel
                </button>
                <button
                  className={style.btn3}
                  onClick={() => router.push(`/restaurant?tripId=${tripId}&checkpointId=${checkpoint._id}`)}
                >
                  Restaurant
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={style.addButton} >
        <div onClick={handleAddCheckpoint} title="Click to add a new checkpoint" className={style.div}>
          🞧
        </div>
        <div className={style.div}>
          <FaFlagCheckered size={50} className={style.end} onClick={handleTripEnd} title="Click to End Trip" />
        </div>
      </div>
      {showReward && (
        <div className={style.rewardOverlay}>
          <div className={style.rewardCard}>
            <div className={style.coinImageWrapper}>
              <Image
                src="/images/Trip/give_coin.png"
                alt="Coin"
                width={120}
                height={120}
                className={style.coinImage}
              />
            </div>
            <div className={style.coinText}>
              <span className={style.coinAmount}>+{earnBadgePoint}</span>
              <span className={style.coinLabel}>Coins Earned!</span>
            </div>
          </div>
        </div>
      )}
      <div className={isCheckpoint ? style.form_div : style.form_close}>
        {isCheckpoint && <CheckpointForm onCheckpointAdded={handleCheckpointAdded} />}
      </div>
    </div>
  );
};

export default CheckpointDetail;
