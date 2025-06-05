"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import style from "./profile.module.css";
import axios from 'axios';
import Image from 'next/image';
import { FaPhotoVideo, FaFilm, FaRoute } from 'react-icons/fa';
import ProfilePost from './ProfilePost';
import ProfileReel from './Reel/ProfileReel';
import ProfileTrip from './Trip/ProfileTrip';
import SuggestedUsers from './SuggestedUsers';
import { useData } from '@/context/UserContext';

interface User {
  _id: string;
  name: string;
  email: string;
  phone_no: string;
  gender?: string;
  profile?: string;
  banner?: string;
  bio?: string;
  posts: any[];
  followers: {
    _id: string;
    name: string;
    profile?: string;
  }[];
  following: {
    _id: string;
    name: string;
    profile?: string;
  }[];
  badge_point: number;
  total_trip: number;
  createdAt: string;
  updatedAt: string;
}

interface Trip {
  _id: string;
  destination: string;
  tripName: string;
  source: string;
  city: string;
  cover_image?: string;
  TotalBudget?: number;
  createdAt: string;
}

const Profile = () => {
  const [post, setPost] = useState(true);
  const [videos, setVideos] = useState(false);
  const [others, setOthers] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const router = useRouter();
  const [isShow, setIsShow] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { userId, isAuthenticated } = useData();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`https://dynamic-wander-wallet.onrender.com/api/v1/user/get-user?user_id=${userId}`);
        const data = await res.json();
        const response = await axios.get(`https://dynamic-wander-wallet.onrender.com/api/v1/trip/getbyuserid?userId=${userId}`);
        setTrips(response.data.trips || []);

        if (data.success) {
          setUserData(data.user);
        } else {
          console.error("Failed to fetch user:", data.message);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    if (userId && isAuthenticated) {
      fetchUser();
    }
  }, [userId, isAuthenticated, isFormOpen, isShow]);

  if (!isAuthenticated || !userData) return null;

  return (
    <main className={style.main}>
      <section className={style.container}>
        <section
          style={{ backgroundImage: `url(${userData.banner || '/RedBackground.webp'})` }}
          className={style.profile_photo_container}
        >
          <div className={style.photo_div}>
            <img src={userData.profile || "/images/profileIcon.webp"} alt="profile" className={style.profile_photo} />
          </div>
        </section>

        <section className={style.profile_container_data}>
          <div className={style.profile_data_div}>
            <div className={style.profile_name_div}>
              <div className={style.profile_name}>i_am_{userData.name}</div>
              <div className={style.profile_bio}>
                {userData.bio?.trim() === '' ? 'Please insert your bio' : userData.bio}
              </div>
            </div>

          </div>
          <div className={style.profile_follow_div}>
            <div className={style.profile_follow}>
              <div className={style.follow_div}>
                <p className={style.follow_number}>{userData?.posts?.length ?? 0}</p>
                <p className={style.follow_name}>Posts</p>
              </div>
              <div className={style.follow_div}>
                <p className={style.follow_number}>{userData?.followers?.length ?? 0}</p>
                <p className={style.follow_name}>Followers</p>
              </div>
              <div className={style.follow_div}>
                <p className={style.follow_number}>{userData?.following?.length ?? 0}</p>
                <p className={style.follow_name}>Following</p>
              </div>
              <div className={style.follow_div}>
                <p className={style.follow_number}>{Math.max(userData?.total_trip ?? 0, 0)}</p>
                <p className={style.follow_name}>Trips</p>
              </div>
            </div>

            {isShow && <SuggestedUsers onClose={() => setIsShow(false)} />}
          </div>
        </section>
        <div className={style.button_div}>
          <button
            className={style.edit_btn}
            onClick={() => router.push("/profile/editprofile")}>
            Edit Profile
          </button>

          <button onClick={() => setIsShow((prev) => !prev)} className={style.edit_btn}>Suggestion for you</button>
        </div>
      </section>

      <section className={style.trip_story_div}>
        {[...trips]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((trip) => (
            <div key={trip._id} className={style.story_image_div}>
              <Image
                src={trip.cover_image || "/images/Daskboard/Mytrip.jpg"}
                alt='Loading....'
                width={500}
                height={500}
                className={style.img}
              />
              <p className={style.story_city}>{trip.city}</p>
            </div>
          ))}
      </section>

      <section className={style.container_combine}>
        <div className={style.heading_container}>
          <div
            className={`${style.box} ${post ? style.onclick : 'border-none'}`}
            onClick={() => {
              setPost(true);
              setVideos(false);
              setOthers(false);
            }}
          >
            <FaPhotoVideo className="inline mr-1" /> Post
          </div>
          <div
            className={`${style.box} ${videos ? style.onclick : 'border-none'}`}
            onClick={() => {
              setVideos(true);
              setPost(false);
              setOthers(false);
            }}
          >
            <FaFilm className="inline mr-1" /> Reels
          </div>
          <div
            className={`${style.box} ${others ? style.onclick : 'border-none'}`}
            onClick={() => {
              setOthers(true);
              setPost(false);
              setVideos(false);
            }}
          >
            <FaRoute className="inline mr-1" /> Trips
          </div>
        </div>

        <div className={style.profile_post_data}>
          {post && <ProfilePost userId={userId} />}
          {videos && <ProfileReel userId={userId} />}
          {others && <ProfileTrip isDisabled={false} userId={userId} />}
        </div>
      </section>
    </main>
  );
};

export default Profile;
