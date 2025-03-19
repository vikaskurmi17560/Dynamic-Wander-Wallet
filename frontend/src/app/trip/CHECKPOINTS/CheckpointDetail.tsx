"use client";
import { useState, useEffect } from "react";
import style from "./checkpoint.module.css";
import Image from "next/image";

const CheckpointDetail = () => {
  const [checkpoints, setCheckpoints] = useState<number[]>([]);
  const [lineHeight, setLineHeight] = useState(120); // Adjusted initial height
  const [isCheckpoint , setIsCheckpoint] = useState(false);
  useEffect(() => {
    setLineHeight(140 + checkpoints.length * 130); 
  }, [checkpoints]);

  const handleAddCheckpoint = () => {
    setCheckpoints([...checkpoints, checkpoints.length]);
  };

  return (
    <div className={style.container}>
      <div className={style.lineContainer} style={{ height: `${lineHeight}px` }}>
        <div className={style.line}></div>

        {checkpoints.map((_, index) => (
          <div key={index} className={style.checkpoint} style={{ top: `${index * 130}px` }}>
            <div className={style.flagContainer}>
              <Image src="/images/Trip/checkpoint.png" width={70} height={70} alt="Checkpoint" className={style.flag} />
            </div>
            <div className={`${style.box} ${index % 2 === 0 ? style.leftBox : style.rightBox}`}>
              <h3>Task {index + 1}</h3>
              <p>Complete this task to proceed.</p>
              <div className={style.connector}></div>
            </div>
          </div>
        ))}
      </div>
      <button className={style.addButton} onClick={handleAddCheckpoint} >
        +
      </button>
      <div>

      </div>
    </div>
  );
};

export default CheckpointDetail;
