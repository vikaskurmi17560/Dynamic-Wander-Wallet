import React from "react";
import Image from "next/image";
import style from "../[id]/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface Hotel {
    name: string;
    rating: number;
    description?: string;
    contact?: string;
    pricePerNight: { price: number; hotel_type: string }[];
}

interface Restaurant {
    restaurant_name: string;
    rating: number;
    description?: string;
    contact?: string;
    location: { name: string };
    prices: { meal_price: number; meal_type: string }[];
}

interface Props {
    isHotel: Hotel[];
    isHotelDetail: Hotel | null;
    setIsHotelDetail: (hotel: Hotel | null) => void;
    isRestaurant: Restaurant[];
    isRestaurantDetail: Restaurant | null;
    setIsRestaurantDetail: (restaurant: Restaurant | null) => void;
}

const HotelAndRestaurantDetails: React.FC<Props> = ({
    isHotel,
    isHotelDetail,
    setIsHotelDetail,
    isRestaurant,
    isRestaurantDetail,
    setIsRestaurantDetail,
}) => {
    return (
        <>
            <div className={style.hotel_buttons}>
                {isHotel?.length ? (
                    isHotel.map((hotel, idx) => (
                        <p
                            key={idx}
                            className={style.hotel_btn}
                            onClick={() => setIsHotelDetail(hotel)}
                        >
                            {idx + 1}
                        </p>
                    ))
                ) : (
                    <p className={style.modal_value}>No hotels found</p>
                )}
            </div>

            {isHotelDetail && (
                <div className={style.hotel_details}>
                    <div className={style.hotel_box}>
                        <h3 className={style.hotel_heading}>Hotel Detail</h3>
                        <div className={style.box}>
                            <span className={style.hotel_name}>Hotel Name</span>
                            <span className={style.hotel_value}>{isHotelDetail.name}</span>
                        </div>
                        <div className={style.box}>
                            <span className={style.hotel_name}>Hotel Rating ⭐</span>
                            <span className={style.hotel_value}>{isHotelDetail.rating}</span>
                        </div>
                        <div className={style.box}>
                            <span className={style.hotel_name}>Hotel Type</span>
                            <span className={style.hotel_value}>
                                {isHotelDetail.pricePerNight[0]?.hotel_type || "N/A"}
                            </span>
                        </div>
                        <div className={style.box}>
                            <span className={style.hotel_name}>Hotel (one night price)</span>
                            <span className={style.hotel_value}>
                                ₹{isHotelDetail.pricePerNight[0]?.price || "N/A"}
                            </span>
                        </div>
                        <div className={style.box}>
                            <span className={style.hotel_name}>Description</span>
                            <span className={style.hotel_value}>
                                {isHotelDetail.description || "N/A"}
                            </span>
                        </div>
                        <div className={style.box}>
                            <span className={style.hotel_name}>Contact</span>
                            <span className={style.hotel_value}>
                                {isHotelDetail.contact || "N/A"}
                            </span>
                        </div>
                        <FontAwesomeIcon
                            icon={faTimes}
                            className={style.cross}
                            onClick={() => setIsHotelDetail(null)}
                        />
                    </div>
                </div>
            )}

            <strong className={style.modal_name}>Restaurant</strong>

            <div className={style.hotel_buttons}>
                {isRestaurant?.length ? (
                    isRestaurant.map((restaurant, idx) => (
                        <p
                            key={idx}
                            className={style.hotel_btn}
                            onClick={() => setIsRestaurantDetail(restaurant)}
                        >
                            {idx + 1}
                        </p>
                    ))
                ) : (
                    <p className={style.modal_value}>No Restaurant found</p>
                )}
            </div>

            {isRestaurantDetail && (
                <div className={style.hotel_details}>
                    <div className={style.hotel_box}>
                        <h3 className={style.hotel_heading}>Restaurant Detail</h3>
                        <div className={style.box}>
                            <span className={style.hotel_name}>Restaurant Name</span>
                            <span className={style.hotel_value}>
                                {isRestaurantDetail.restaurant_name}
                            </span>
                        </div>
                        <div className={style.box}>
                            <span className={style.hotel_name}>Restaurant Rating ⭐</span>
                            <span className={style.hotel_value}>
                                {isRestaurantDetail.rating}
                            </span>
                        </div>
                        <div className={style.box}>
                            <span className={style.hotel_name}>Location</span>
                            <span className={style.hotel_value}>
                                {isRestaurantDetail.location.name}
                            </span>
                        </div>
                        <div className={style.box}>
                            <span className={style.hotel_name}>Meal Type</span>
                            <span className={style.hotel_value}>
                                {isRestaurantDetail.prices[0]?.meal_type || "N/A"}
                            </span>
                        </div>
                        <div className={style.box}>
                            <span className={style.hotel_name}>Meal</span>
                            <span className={style.hotel_value}>
                                ₹{isRestaurantDetail.prices[0]?.meal_price || "N/A"}
                            </span>
                        </div>
                        <div className={style.box}>
                            <span className={style.hotel_name}>Description</span>
                            <span className={style.hotel_value}>
                                {isRestaurantDetail.description || "N/A"}
                            </span>
                        </div>
                        <div className={style.box}>
                            <span className={style.hotel_name}>Contact</span>
                            <span className={style.hotel_value}>
                                {isRestaurantDetail.contact || "N/A"}
                            </span>
                        </div>
                        <FontAwesomeIcon
                            icon={faTimes}
                            className={style.cross}
                            onClick={() => setIsRestaurantDetail(null)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default HotelAndRestaurantDetails;
