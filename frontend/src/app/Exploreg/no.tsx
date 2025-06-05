'use client';

import React, { useEffect, useState } from "react";
import style from "./Explore.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/navigation";
import useCartStore from "@/app/store/useStore";
import Image from "next/image";
import FollowButton from "./FollowButton";
import { useData } from "@/context/UserContext";

interface Trip {
  _id: string;
  tripName: string;
  source: string;
  state: string;
  city: string;
  destination: string;
  cover_image?: string;
  TotalBudget?: number;
  rating?: number[];
  createdAt?: string;
  numberMembers: string;
  userId: string;
}

const normalizeText = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const Explore: React.FC = () => {
  const [tripData, setTripData] = useState<Trip[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: any }>({});
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { userId } = useData();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://dynamic-wander-wallet.onrender.com/api/v1/trip/alltrip");
        const sortedTrips = res.data.sort(
          (a: Trip, b: Trip) =>
            new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
        );
        setTripData(sortedTrips);
      } catch (err) {
        setError("Failed to fetch trip data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      const uniqueUserIds = [...new Set(tripData.map((trip) => trip.userId))];
      const profiles: { [key: string]: any } = {};

      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          try {
            const res = await axios.get("https://dynamic-wander-wallet.onrender.com/api/v1/user/get-user", {
              params: { user_id: userId },
            });
            profiles[userId] = res.data.user;
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
          }
        })
      );

      setUserProfiles(profiles);
    };

    if (tripData.length > 0) {
      fetchUserProfiles();
    }
  }, [tripData]);

  const filteredTrips = tripData.filter((trip) => {
    const cityNormalized = normalizeText(trip.city);
    const queryNormalized = normalizeText(searchQuery);
    const stateMatch = selectedState ? trip.state === selectedState : true;

    return (
      (cityNormalized.includes(queryNormalized) || !searchQuery.trim()) && stateMatch
    );
  });

  const calculateAverageRating = (ratings?: number[]): number => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, r) => sum + r, 0);
    return parseFloat((total / ratings.length).toFixed(1));
  };

  return (
    <>
      <div className={style.main}>
        <div className={style.search_box}>
          <input
            type="text"
            placeholder="Enter the City"
            className={style.input}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className={style.search_div}>
            <FontAwesomeIcon icon={faSearch} className={style.search_icon} />
          </div>
        </div>

        <div className={style.count_div}>
          <div className={style.total_count}>
            <p className={style.count_h}>Total No. of Trips</p>
            <p>{tripData.length}</p>
          </div>
          <div className={style.total_count}>
            <p className={style.count_h}>Total No. of Trips (Filtered by City)</p>
            <p>{filteredTrips.length}</p>
          </div>
          <div>
            <select
              className={style.bystate}
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={style.trip_div}>
        {loading ? (
          <p>Loading trips...</p>
        ) : error ? (
          <p>{error}</p>
        ) : filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => {
            const user = userProfiles[trip.userId];
            return (
              <div key={trip._id} className={style.trip_card_container}>
                {user && (
                  <div className={style.user_profile} >
                    <Image
                      src={user.profile || "/images/profilelogo.png"}
                      alt={user.name || "User"}
                      height={50}
                      width={50}
                      className={style.profile_pic}
                      onClick={() => {
                        if (user._id === userId) {
                          router.push('/profile');
                        } else {
                          router.push(`/explore/profile/${user._id}`);
                        }
                      }}
                    />
                    <div className={style.profile_div}>
                      <div>
                        <p className={style.user_name}>{user.name}</p>
                        <span className={style.place}>{trip.destination}</span>
                      </div>
                      {
                        user._id !== userId &&
                        <FollowButton userId={user._id} currentUserId={userId} />
                      }
                    </div>
                  </div>
                )}
                <div className={style.trip_card}>
                  <Image
                    src={trip.cover_image && trip.cover_image.trim() !== "" ? trip.cover_image : "/images/Trip/CheckpointData.jpg"}
                    alt={trip.tripName || "Trip Image"}
                    height={500}
                    width={500}
                    style={{ objectFit: "cover" }}
                    priority
                    className={style.image}
                  />
                  <div className={style.trip_details}>
                    <h3 className={style.trip_name}>{trip.tripName}</h3>
                    <div className={style.trip_location}><p className={style.name}>State</p><span className={style.value}>{trip.state}</span></div>
                    <div className={style.trip_location}><p className={style.name}>City</p><span className={style.value}>{trip.city}</span></div>

                    <div className={style.trip_location}><p className={style.name}>Budget</p><span className={style.value}>₹{trip.TotalBudget}</span></div>
                    <div className={style.trip_location}><p className={style.name}>Members</p><span className={style.value}>{trip.numberMembers}</span></div>
                    <div className={style.trip_location}>
                      <p className={style.name}>Rating</p>
                      <span className={style.value}>
                        <FontAwesomeIcon icon={faStar} style={{ color: "#facc15" }} />{" "}
                        {calculateAverageRating(trip.rating)}
                      </span>
                    </div>
                  </div>
                  <div className={style.card_buttons}>
                    <button className={style.quick_book} onClick={() => router.push(`/explore/${trip._id}`)}>
                      Details
                    </button>
                    <button className={style.add_cart} onClick={() => addToCart(trip)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No trips found for "{searchQuery}"</p>
        )}
      </div>
    </>
  );
};

export default Explore;
