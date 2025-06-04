import React, { useEffect, useRef, useState } from "react";
import styles from "./ScratchCard.module.css";

interface ScratchCardProps {
    width?: number;
    height?: number;
    rewardText: string;
    onComplete?: () => void;
    threshold?: number;
}

const ScratchCard: React.FC<ScratchCardProps> = ({
    width = 240,
    height = 260,
    rewardText,
    onComplete,
    threshold = 60,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [startedScratching, setStartedScratching] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#d4af37";
        ctx.fillRect(0, 0, width, height);
    }, [width, height]);

    const handlePointerDown = () => {
        setIsDrawing(true);
        setStartedScratching(true);
    };

    const handlePointerUp = () => setIsDrawing(false);

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawing || completed) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2, false);
        ctx.fill();

        checkScratchPercentage();
    };

    const checkScratchPercentage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparentPixels++;
        }

        const percent = (transparentPixels / (pixels.length / 4)) * 100;

        if (percent > threshold && !completed) {
            setCompleted(true);
            if (onComplete) onComplete();
        }
    };

    return (
        <div className={styles.container} style={{ width, height, position: "relative" }}>
            {completed && (
                <div className={styles.rewardText}>{rewardText}</div>
            )}

            {!startedScratching && !completed && (
                <div className={styles.overlayMessage}>
                    <p>Scratch card</p>
                    <p> 🎉</p>
                </div>
            )}

            <canvas
                ref={canvasRef}
                className={styles.canvas}
                width={width}
                height={height}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerUp}
            />
        </div>
    );
};

export default ScratchCard;
