"use client";
import useUserData from '@/hook/useData';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import style from "./watchlist.module.css";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Trip {
  _id: string;
  destination: string;
  tripName: string;
  source: string;
  city: string;
}

const Watchlist = () => {
  const { userId } = useUserData();
  const router = useRouter();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchTrips = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:7050/api/v1/trip/getbyuserid?userId=${userId}`);
        setTrips(res.data.trips || []);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Failed to fetch trips. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [userId]);

  return (
    <div className={style.container}>
      <h1 className={style.heading}>My Trips</h1>

      {loading && <p className={style.loading}>Loading trips...</p>}
      {error && <p className={style.error}>{error}</p>}

      {!loading && !error && trips.length > 0 ? (
        <div className={style.cart}>
          {trips.map((trip) => (
            <div key={trip._id} className={style.box}>
              <div className={style.img_div}>
                <Image
                  src={"/images/Daskboard/Mytrip.jpg"}
                  className={style.img}
                  alt='Loading...'
                  height={2000}
                  width={2000}
                  priority
                />
              </div>
              <div className={style.data_div}>
                <p className={style.tripname}>{trip.tripName}</p>
                <div className={style.info}>
                  <span>Source</span> <span>{trip.source}</span>
                </div>
                <div className={style.info}>
                  <span>Destination</span> <span>{trip.destination}</span>
                </div>
                <div className={style.info}>
                  <span>City</span> <span>{trip.city}</span>
                </div>
              </div>
              <div className={style.btn_container}>
                <button
                  className={style.btn}
                  onClick={() => router.push(`/dashboard/trips/${trip._id}`)}
                >
                  Watch Trip
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className={style.no_trips}>No trips found.</p>
      )}
    </div>
  );
};

export default Watchlist;
