"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import style from "./Reels.module.css";
import { FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import CommentLike from "./CommentLike";
import FollowButton from "@/app/explore/FollowButton";
import { useData } from "@/context/UserContext";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  profile?: string;
}

export interface Post {
  _id: string;
  image: string;
  description: string;
  tags: string[];
  location: string;
  createdAt: string;
  postedBy: string;
  postedUser?: User;
}

const videoExtensions = ["mp4", "webm", "mov", "avi", "mkv"];

const isVideo = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase();
  return extension ? videoExtensions.includes(extension) : false;
};

const Reels = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [muted, setMuted] = useState(true);
  const [pausedIndex, setPausedIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
  const { userId } = useData();
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://dynamic-wander-wallet.onrender.com/api/v1/post/getallpost");
        const postsData: Post[] = response.data;
        const videoPosts = postsData.filter((post) => isVideo(post.image));

        const postsWithUsers = await Promise.all(
          videoPosts.map(async (post) => {
            try {
              const userRes = await axios.get("https://dynamic-wander-wallet.onrender.com/api/v1/user/get-user", {
                params: { user_id: post.postedBy },
              });
              return { ...post, postedUser: userRes.data.user };
            } catch {
              return post;
            }
          })
        );

        setPosts(postsWithUsers);

        setTimeout(() => {
          const firstVideo = videoRefs.current[0];
          if (firstVideo) firstVideo.play();
        }, 300);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const cards = container.querySelectorAll(`.${style.videoCard}`);
        let closestCardIndex = 0;
        let closestOffset = Infinity;

        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const offset = Math.abs(rect.top);
          if (offset < closestOffset) {
            closestOffset = offset;
            closestCardIndex = index;
          }
        });

        cards[closestCardIndex].scrollIntoView({ behavior: "smooth" });

        videoRefs.current.forEach((video, idx) => {
          if (!video) return;
          if (idx === closestCardIndex) {
            video.play();
          } else {
            video.pause();
          }
        });
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play();
      setPausedIndex(null);
    } else {
      video.pause();
      setPausedIndex(index);
    }
  };

  const toggleMute = () => {
    setMuted((prev) => {
      const newMuted = !prev;
      videoRefs.current.forEach((video) => {
        if (video) video.muted = newMuted;
      });
      return newMuted;
    });
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className={style.reelsWrapper} ref={containerRef}>
      {posts.map((post, index) => (
        <div key={post._id} className={style.videoCard}>
          <div className={style.videoWrapper}>
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={post.image}
              className={style.video}
              muted={muted}
              loop
              playsInline
              preload="metadata"
              onClick={() => togglePlay(index)}
            />

            {pausedIndex === index && (
              <div className={style.centerControl}>
                <FaPause />
              </div>
            )}

            <div className={style.soundControl} onClick={toggleMute}>
              {muted ? <FaVolumeMute /> : <FaVolumeUp />}
            </div>

            <div className={style.textOverlay}>
              <div className={style.profile_div}>
                {post.postedUser?.profile && (
                  <img
                    src={post.postedUser.profile}
                    alt="Profile"
                    className={style.profile_img}
                    onClick={() => {
                      if (post.postedUser?._id === userId) {
                        router.push('/profile');
                      } else {
                        router.push(`/explore/profile/${post.postedUser?._id}`);
                      }
                    }}
                  />
                )}
                <span className={style.profile_name}>
                  i_am_{post.postedUser?.name || "Unknown"}
                </span>

                {userId && post.postedUser?._id !== userId && (
                  <FollowButton
                    userId={post.postedUser?._id}
                    currentUserId={userId}
                  />
                )}
              </div>

              <div className={style.desp}>
                {expanded[post._id] ? (
                  <p style={{ whiteSpace: "pre-wrap" }} onClick={() => toggleExpand(post._id)}>
                    {post.description}
                  </p>
                ) : (
                  <>
                    <p className={style.truncatedText}>{post.description}</p>
                    {post.description.length > 10 && (
                      <button
                        onClick={() => toggleExpand(post._id)}
                        className={style.more_less}
                      >
                        ...More
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className={style.rightPanel}>
            <CommentLike
              postId={post._id}
              isCommentOpen={openCommentPostId === post._id}
              onToggle={() =>
                setOpenCommentPostId((prev) => (prev === post._id ? null : post._id))
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reels;
