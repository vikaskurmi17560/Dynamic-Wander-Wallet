"use client";

import { useState, useEffect } from "react";
import style from "./checkpoint.module.css";
import Image from "next/image";
import CheckpointForm from "./CheckpointForm";
import useLocation from "@/hook/useLocation";
import axios from "axios";
import { useRouter } from "next/navigation";

const CheckpointDetail = () => {
  const router = useRouter();
  const [checkpoints, setCheckpoints] = useState<any[]>([]);
  const [lineHeight, setLineHeight] = useState(120);
  const { isCheckpoint, toggleCheckpoint, tripId } = useLocation();

  useEffect(() => {
    setLineHeight(140 + checkpoints.length * 130);
  }, [checkpoints]);

  useEffect(() => {
    if (!tripId) return;

    async function fetchCheckpoints() {
      try {
        const res = await axios.get("http://localhost:7050/api/v1/checkpoint/getbytripid", {
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

                <button className={style.btn3}>Restaurant</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className={style.addButton} onClick={handleAddCheckpoint} title="Click to add a new checkpoint">
        +
      </button>

      <div className={isCheckpoint ? style.form_div : style.form_close}>
        {isCheckpoint && <CheckpointForm onCheckpointAdded={handleCheckpointAdded} />}
      </div>
    </div>
  );
};

export default CheckpointDetail;
