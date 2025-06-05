"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaBookmark,
  FaEllipsisH,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import style from "./commentlike.module.css";
import useData from "@/hook/useData";
import Image from "next/image";

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  user?: {
    name: string;
    profile?: string;
  };
}

interface Props {
  postId: string;
  isCommentOpen: boolean;
  onToggle: () => void;
}

const CommentLike: React.FC<Props> = ({ postId, isCommentOpen, onToggle }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { userId, user } = useData();

  useEffect(() => {
    if (postId && userId) {
      fetchLikes();
      fetchComments();
    }
  }, [postId, userId]);



  const fetchLikes = async () => {
    try {
      const res = await axios.get(
        `https://dynamic-wander-wallet.onrender.com/api/v1/post/like/getalldata`,
        { params: { post_id: postId } }
      );
      const allLikes = res.data.likes;
      setLikeCount(allLikes.length);
      const isLikedByUser = allLikes.some(
        (like: any) =>
          like.likedBy === userId || like.likedBy?._id === userId
      );
      setLiked(isLikedByUser);
    } catch (error) {
      console.error("Failed to fetch likes", error);
    }
  };


  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `https://dynamic-wander-wallet.onrender.com/api/v1/post/comment/getbypost?post_id=${postId}`
      );
      setComments(res.data.comments || []);
    } catch (error) {
      // console.error("Failed to fetch comments", error);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const res = await axios.post(
        `https://dynamic-wander-wallet.onrender.com/api/v1/post/like/create`,
        {
          post_id: postId,
          user_id: userId,
        }
      );
      if (res.data.message === "Post liked successfully") {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else if (res.data.message === "Like removed successfully") {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`https://dynamic-wander-wallet.onrender.com/api/v1/post/comment/create`, {
        post_id: postId,
        user_id: userId,
        text: newComment,
      });
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.commentLikeWrapper}>
        <div onClick={handleLikeToggle} className={style.button}>
          {liked ? <FaHeart color="red" style={{ fontSize: "1.6em" }} /> : <FaRegHeart style={{ fontSize: "1.6em" }} />}
          <span className={style.number}>{likeCount}</span>
        </div>
        <button className={style.button} onClick={onToggle}>
          <FaComment style={{ fontSize: "1.6em" }} />
          <span className={style.number}>{comments?.length}</span>
        </button>
        <button className={style.button}><FaShare style={{ fontSize: "1.6em" }} /></button>
        <button className={style.button}><FaBookmark style={{ fontSize: "1.6em" }} /></button>
        <button className={style.button}><FaEllipsisH style={{ fontSize: "1.6em" }} /></button>
      </div>

      {isCommentOpen && (
        <div className={style.comment_div}>
          <div className={style.comment_heading}>Comments</div>
          <div className={style.comments}>
            {comments?.map((c) => (
              <div key={c._id} className={style.comment}>
                <Image
                  src={c.user?.profile || "/images/profilelogo.png"}
                  alt="Profile"
                  width={500}
                  height={500}
                  priority
                  className={style.comment_photo}
                />
                <p className={style.comment_desp}>
                  <strong>i_am_{c.user?.name || "Anonymous"}_ig</strong>
                  <span className={style.comment_text}>{c?.text}</span>
                </p>
              </div>
            ))}
          </div>
          <div className={style.commentSection}>
            <Image
              src={user.profile || "/images/profilelogo.png"}
              alt="Profile"
              width={500}
              height={500}
              priority
              className={style.profile_photo}
            />
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={style.input}
            />
            <button onClick={handleAddComment} className={style.post_btn}>
              Post
            </button>
          </div>
          <FontAwesomeIcon
            icon={faXmark}
            className={style.cross}
            onClick={onToggle}
          />
        </div>
      )}
    </div>
  );
};

export default CommentLike;
