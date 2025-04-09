"use client";

import React, { useEffect, useState } from "react";
import style from "./Explore.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSackDollar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/navigation";
import useCartStore from "@/app/store/useStore";
import Image from "next/image";

interface Trip {
  _id: string;
  tripName: string;
  source: string;
  state: string;
  city: string;
  destination: string;
  cover_image?: string;
  TotalBudget?: number;
}

const normalizeText = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const Explore: React.FC = () => {
  const [tripData, setTripData] = useState<Trip[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:7050/api/v1/trip/alltrip");
        setTripData(res.data);
      } catch (err) {
        setError("Failed to fetch trip data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTrips = tripData.filter((trip) => {
    if (!searchQuery.trim()) return true;

    const cityNormalized = normalizeText(trip.city);
    const queryNormalized = normalizeText(searchQuery);

    return cityNormalized.includes(queryNormalized);
  });

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
      </div>

      <div className={style.trip_div}>
        {loading ? (
          <p>Loading trips...</p>
        ) : error ? (
          <p>{error}</p>
        ) : filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <div key={trip._id} className={style.trip_card}>
              <Image
                src={
                  trip.cover_image && trip.cover_image.trim() !== ""
                    ? trip.cover_image
                    : "/images/Trip/CheckpointData.jpg"
                }
                alt={trip.tripName || "Trip Image"}
                height={500}
                width={500}
                style={{ objectFit: "cover" }}
                priority
                className={style.image}
              />
              <div className={style.trip_details}>
                <h3 className={style.trip_name}>{trip.tripName}</h3>

                <div className={style.trip_location}>
                  <p className={style.name}>State</p>
                  <span className={style.value}>{trip.state}</span>
                </div>
                <div className={style.trip_location}>
                  <p className={style.name}>City</p>
                  <span className={style.value}>{trip.city}</span>
                </div>
                <div className={style.trip_location}>
                  <p className={style.name}>Place</p>
                  <span className={style.value}>{trip.destination}</span>
                </div>
                <div className={style.trip_location}>
                  <p className={style.name}>Budget</p>
                  <span className={style.value}>₹{trip.TotalBudget}</span>
                </div>
              </div>
              <div className={style.card_buttons}>
                <button
                  className={style.quick_book}
                  onClick={() => router.push(`/explore/${trip._id}`)}
                >
                  Details
                </button>
                <button
                  className={style.add_cart}
                  onClick={() => addToCart(trip)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No trips found for "{searchQuery}"</p>
        )}
      </div>
    </>
  );
};

export default Explore;
