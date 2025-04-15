'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './Feedback.module.css';
import useData from '@/hook/useData';

interface FeedbackProps {
    tripId: string;
}

interface User {
    _id: string;
    name: string;
    profile?: string;
}

interface Review {
    reviewBy: string;
    comment?: string;
    userInfo?: User; 
}

interface Trip {
    _id?: string;
    userId: string;
    cover_image?: string;
    image?: string[];
    tripName: string;
    source: string;
    state: string;
    city: string;
    destination: string;
    TotalBudget?: number;
    followedby?: string[];
    Earnbadge_point?: number;
    rating: number[];
    review: Review[];
    createdAt?: Date;
    updatedAt?: Date;
}

const Feedback: React.FC<FeedbackProps> = ({ tripId }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [ratings, setRatings] = useState<number[]>([]);
    const { userId } = useData();

    const fetchTripData = async () => {
        setLoading(true);
        try {
            const response = await axios.get<{ success: boolean; trip: Trip }>(
                'http://localhost:7050/api/v1/trip/getbyid',
                {
                    params: { trip_id: tripId },
                }
            );

            if (response.data.success) {
                const rawReviews = response.data.trip.review || [];

                const reviewsWithUserInfo = await Promise.all(
                    rawReviews.map(async (rev) => {
                        try {
                            const userRes = await axios.get<{ success: boolean; user: User }>(
                                'http://localhost:7050/api/v1/user/get-user',
                                { params: { user_id: rev.reviewBy } }
                            );
                            return {
                                ...rev,
                                userInfo: userRes.data.user,
                            };
                        } catch (err) {
                            console.error("Failed to fetch user info", err);
                            return rev;
                        }
                    })
                );

                setReviews(reviewsWithUserInfo);
                setRatings(response.data.trip.rating || []);
            }
        } catch (err) {
            console.error('Error fetching trip data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tripId) {
            fetchTripData();
        }
    }, [tripId]);

    const handleRatingClick = (value: number) => {
        setRating(value);
    };

    const handleSubmit = async () => {
        if (!tripId) return;
        setLoading(true);

        const payload = {
            TripId: tripId,
            rating,
            review: {
                reviewBy: userId,
                comment: review,
            },
        };

        try {
            const res = await fetch('http://localhost:7050/api/v1/trip/updateData', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            fetchTripData();
        } catch (err) {
            console.error(err);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.feedback_container}>
            <h1 className={style.rating_heading}>Rating and Reviews</h1>

            <div className={style.rating_div}>
                <p className={style.name}>Rate Your Experience*</p>
                <div className={style.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`${style.star} ${rating >= star ? style.filled : ''}`}
                            onClick={() => handleRatingClick(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <p className={style.name}>Feedback*</p>
                <input
                    type="text"
                    value={review}
                    placeholder="Write your feedback..."
                    className={style.feedback_input}
                    onChange={(e) => setReview(e.target.value)}
                />
            </div>

            <button onClick={handleSubmit} disabled={loading} className={style.submit_button}>
                {loading ? 'Submitting...' : 'Submit'}
            </button>

            <div className={style.reviews_section}>
                {reviews.length > 0 ? (
                    reviews.map((rev, index) => (
                        <div key={index} className={style.reviewCard}>
                            <div className={style.review_box}>
                                {rev.userInfo?.profile && (
                                    <img
                                        src={rev.userInfo.profile}
                                        alt={rev.userInfo.name}
                                        className={style.profilePic}
                                    />
                                )}
                                <p className={style.reviewerName}>
                                    <strong>I_am_{rev.userInfo?.name || 'Anonymous'}</strong>
                                </p>
                            </div>
                            <p className={style.comment}>{rev.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className={style.noReviews}>No reviews yet</p>
                )}
            </div>
        </div>
    );
};

export default Feedback;
