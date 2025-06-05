// components/CheckpointCard.tsx
import Image from "next/image";
import React from "react";
import style from "../[id]/style.module.css";

interface Checkpoint {
  _id: string;
  source: { name: string };
  destination: { name: string };
  Total_checkpointBudget: number;
}

interface CheckpointCardProps {
  checkpoint: Checkpoint;
  index: number;
  onViewDetails: (checkpoint: Checkpoint) => void;
}

const CheckpointCard: React.FC<CheckpointCardProps> = ({ checkpoint, index, onViewDetails }) => {
  return (
    <div className={style.timelineItem}>
      <div className={style.card}>
        <div className={style.header}>
          <h3 className={style.h3}>Checkpoint {index + 1}</h3>
        </div>

        <div className={style.locationbox}>
          <Image
            src="/images/Daskboard/checkpoint.png"
            alt="Checkpoint"
            height={24}
            width={24}
            className={style.logo}
          />
          <p className={style.locationbox_name}>{checkpoint.source.name}</p>
        </div>

        <div className={style.locationbox}>
          <Image
            src="/images/Daskboard/start_location.png"
            alt="Destination"
            height={24}
            width={24}
            className={style.logo}
          />
          <p className={style.locationbox_name}>{checkpoint.destination.name}</p>
        </div>

        <div className={style.locationbox}>
          <Image
            src="/images/Daskboard/budget.png"
            alt="Budget"
            height={24}
            width={24}
            className={style.logo}
          />
          <p className={style.locationbox_name}>₹{checkpoint.Total_checkpointBudget}</p>
        </div>

        <div className={style.buttonWrapper}>
          <button
            type="button"
            onClick={() => onViewDetails(checkpoint)}
            title="Click to view full details"
            className={style.btn_checkpoint}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckpointCard;
