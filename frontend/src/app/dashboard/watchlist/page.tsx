"use client";

import React from "react";
import useCartStore from "@/app/store/useStore";
import { useRouter } from "next/navigation";
import styles from "./watchlist.module.css";
import Image from "next/image";

type Trip = {
  _id: string;
  tripName: string;
  city: string;
  state: string;
  cover_image?: string;
};

const Cart: React.FC = () => {
  const { cart, removeFromCart } = useCartStore();
  const router = useRouter();


  const uniqueCart: Trip[] = Array.from(
    new Map(cart.map((trip: Trip) => [trip._id, trip])).values()
  );

  return (
    <div className={styles.main}>
      <div className={styles.heading}>My Cart</div>
      <div className={styles.cartContainer}>
        {uniqueCart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          uniqueCart.map((trip, index) => (
            <div key={`${trip._id}-${index}`} className={styles.nft}>
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
                className={styles.tokenImage}
              />
              <h2 className={styles.tripname}>{trip.tripName}</h2>
              <p className={styles.description}>
                Explore the beauty of {trip.city}, {trip.state}.
              </p>
              <div className={styles.buttons}>
                <button
                  className={styles.detailsBtn}
                  onClick={() => router.push(`/explore/${trip._id}`)}
                >
                  View Details
                </button>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(trip._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cart;
