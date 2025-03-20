"use client";
import { useState, useEffect } from "react";
import style from "./checkpoint.module.css";
import Image from "next/image";
import CheckpointForm from "./CheckpointForm";

const CheckpointDetail = () => {
  const [checkpoints, setCheckpoints] = useState<number[]>([]);
  const [lineHeight, setLineHeight] = useState(120);
  const [isCheckpoint, setIsCheckpoint] = useState(false);

  useEffect(() => {
    setLineHeight(140 + checkpoints.length * 130);
  }, [checkpoints]);

  const handleAddCheckpoint = () => {
    setCheckpoints([...checkpoints, checkpoints.length]);
    setIsCheckpoint((prev) => !prev);
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
      <div className={isCheckpoint ? style.form_div : style.form_close}>
        <CheckpointForm />
      </div>
    </div>
  );
};

export default CheckpointDetail;
