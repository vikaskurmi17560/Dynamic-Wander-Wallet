"use client";

import React from "react";
import useCartStore from "@/app/store/useStore";
import { useRouter } from "next/navigation";
import styles from "./watchlist.module.css";

const Cart: React.FC = () => {
  const { cart, removeFromCart } = useCartStore();
  const router = useRouter();

  return (
    <>
      <div className={styles.main}>
        <div className={styles.heading}>My Cart</div>
        <div className={styles.cartContainer}>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((trip) => (
              <div key={trip._id} className={styles.nft}>
                <div className={styles.main}>
                  <img
                    className={styles.tokenImage}
                    src="/images/Trip/CheckpointData.jpg"
                    alt={trip.tripName}
                  />
                  <h2 className={styles.tripname}>{trip.tripName}</h2>
                  <p className={styles.description}>Explore the beauty of {trip.city}, {trip.state}.</p>
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
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
