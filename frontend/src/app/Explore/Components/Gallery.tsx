"use client"

import { useEffect, useState } from "react";
import style from "../[id]/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface GalleryProps {
    uploadedData: { image: string[] };
    setIsUrl: (url: string) => void;
    isUrl: string;
}

const Gallery: React.FC<GalleryProps> = ({ uploadedData, setIsUrl, isUrl }) => {
    const [isGallery, setIsGallery] = useState(false);
    useEffect(() => {
        if (isGallery) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isGallery]);
    const handleGallery = () => {
        if (!uploadedData.image || uploadedData.image.length === 0) {
            alert("No photos available.");
            return;
        }

        const validImages = uploadedData.image.filter(img => img && img.trim() !== "");
        if (validImages.length === 0) {
            alert("No valid photos found.");
            return;
        }

        setIsUrl(validImages[0]);
        setIsGallery((prev) => !prev);
    };

    return (
        <>
            <div className={style.gallery}>
                <button className={style.button} onClick={handleGallery}>
                    🖼️ <span>Gallery</span>
                </button>
            </div>


            {isGallery && (
                <div className={style.watch_div}>
                    <div className={style.photo_div}>
                        <img
                            src={isUrl}
                            alt="Selected"
                            className={style.image_show}
                        />
                        <div className={style.small_image_div}>
                            {uploadedData.image && uploadedData.image.length > 0 && (
                                <div className={style.thumbnail_wrapper}>
                                    {uploadedData.image.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url}
                                            alt={`Gallery ${idx + 1}`}
                                            style={{
                                                width: 150,
                                                height: 100,
                                                objectFit: "cover",
                                                borderRadius: 6,
                                                flexShrink: 0,
                                                cursor: "pointer",
                                                border: url === isUrl ? "4px solid white" : "none",
                                                boxShadow: url === isUrl ? "0 0 8px rgba(255,255,255,0.8)" : "none",
                                            }}
                                            onClick={() => setIsUrl(url)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className={style.cross_icon}
                        onClick={() => setIsGallery(false)}
                    />
                </div>
            )}
        </>
    );
};

export default Gallery;
