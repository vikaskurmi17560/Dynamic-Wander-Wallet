"use client";

import React, { useEffect, useState } from "react";
import style from "./Explore.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/navigation";
import useCartStore from "@/app/store/useStore";

interface Trip {
  _id: string;
  tripName: string;
  source: string;
  state: string;
  city: string;
  destination: string;
}

const Explore: React.FC = () => {
  const [tripData, setTripData] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { addToCart } = useCartStore();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:7050/api/v1/trip/alltrip");
        console.log("Fetched Data:", res.data);
        setTripData(res.data);
      } catch (error) {
        console.error("Error fetching trip data:", error);
        setError("Failed to fetch trip data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <>
      <div className={style.main}>
        {/* Search Bar */}
        <div className={style.search_box}>
          <input type="text" placeholder="Enter the City" className={style.input} />
          <div className={style.search_div}>
            <FontAwesomeIcon icon={faSearch} className={style.search_icon} />
          </div>
        </div>
      </div>


      <div className={style.trip_div}>
        {loading ? (
          <p>Loading trips...</p>
        ) : error ? (
          <p>{error}</p>
        ) : tripData.length > 0 ? (
          tripData.map((trip) => (
            <div key={trip._id} className={style.trip_card}>
              <img
                src="/images/Trip/CheckpointData.jpg"
                alt="Loading..."
                className={style.image}
              />
              <div className={style.trip_details}>
                <h3 className={style.trip_name}>{trip.tripName}</h3>
                <div className={style.trip_location}>
                  <p className={style.name}>State </p> <span className={style.value}>{trip.state}</span>
                </div>
                <div className={style.trip_location}>
                  <p className={style.name}>City</p> <span className={style.value}>{trip.city}</span>
                </div>
                <div className={style.trip_location}>
                  <p className={style.name}>Place</p> <span className={style.value}>{trip.destination}</span>
                </div>
              </div>

              <div className={style.card_buttons}>
                <button
                  className={style.quick_book}
                  onClick={() => router.push(`/explore/${trip._id}`)}
                >
                  Details
                </button>
                <button className={style.add_cart}
                  onClick={() => addToCart(trip)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No trips available</p>
        )}
      </div>
    </>
  );
};

export default Explore;
