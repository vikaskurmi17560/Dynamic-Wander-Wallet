'use client';

import React, { useRef, useState, useEffect } from 'react';
import styles from './VideoPreview.module.css';

interface VideoPreviewProps {
    src: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlayPause = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className={styles.videoPreviewWrapper}>
            <video
                ref={videoRef}
                src={src}
                className={styles.preview}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                muted={isMuted}
            />
            <div className={styles.controls}>
                <button onClick={togglePlayPause}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={toggleMute}>
                    {isMuted ? 'Unmute' : 'Mute'}
                </button>
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
        </div>
    );
};

export default VideoPreview;
