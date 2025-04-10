'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import style from "./hotels.module.css";
import useData from '@/hook/useData';

const Hotels = () => {
  const { userId } = useData();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const checkpointId = searchParams.get("checkpointId");
  const router = useRouter();

  type Location = {
    latitude: number | null;
    longitude: number | null;
    placeName: string;
  };

  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    placeName: 'Fetching...',
  });


  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const placeName = await getPlaceName(latitude, longitude);
          setLocation({ latitude, longitude, placeName });
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const getPlaceName = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      return data.display_name || 'Unknown Location';
    } catch {
      return 'Unknown Location';
    }
  };

  const [formData, setFormData] = useState({
    trip_id: tripId,
    checkpoint_id: checkpointId,
    name: '',
    location: { latitude: 0, longitude: 0 },
    rating: 3.0,
    description: '',
    pricePerNight: [{ hotel_type: '', price: 0 }],
    contact: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      pricePerNight: prev.pricePerNight.map((price, index) =>
        index === 0 ? { ...price, [name]: value } : price
      ),
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // console.log("Trip ID:", tripId);
    // console.log("Checkpoint ID:", checkpointId);

    if (!tripId || !checkpointId) {
      console.error("Error: trip_id or checkpoint_id is missing!");
      return;
    }

    const updatedFormData = {
      ...formData,
      trip_id: tripId,
      checkpoint_id: checkpointId,
      location: {
        latitude: location.latitude ?? 0,
        longitude: location.longitude ?? 0
      }
    };

    console.log("Submitting Data:", updatedFormData);

    try {
      const response = await axios.post(
        `http://localhost:7050/api/v1/hotel/create?userId=${userId}`,
        updatedFormData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };



  return (
    <div className={style.main}>
      <div className={style.form_div}>
        <h2 className={style.form_heading}>Hotel Checkpoint</h2>
        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.box}>
            <label className={style.label}>
              <p className={style.content}>Latitude</p>
              <input type="text" value={location.latitude || ''} className={style.input} readOnly />
            </label>

            <label className={style.label}>
              <p className={style.content}>Longitude</p>
              <input type="text" value={location.longitude || ''} className={style.input} readOnly />
            </label>

            <label className={style.label}>
              <p className={style.content}>Address</p>
              <input type="text" value={location.placeName} className={style.input} readOnly />
            </label>
          </div>
          <label className={style.label}>
            <p className={style.content}>Hotel Name*</p>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={style.input} placeholder='Enter the Hotel name' required />
          </label>

          <div className={style.box}>
            <label className={style.label}>
              <p className={style.content}>Rating</p>
              <input type="number" name="rating" value={formData.rating === 3.0 ? "" : formData.rating} onChange={handleChange} placeholder='Enter the rating' className={style.input} />
            </label>
            <label className={style.label}>
              <p className={style.content}>Hotel Type*</p>
              <select name="hotel_type" value={formData.pricePerNight[0].hotel_type} onChange={handlePriceChange} className={style.input} required>
                <option value="">Select the type</option>
                <option value="luxury">Luxury</option>
                <option value="3-star">3-star</option>
                <option value="1-star">1-star</option>
                <option value="dormitory">Dormitory</option>
              </select>
            </label>

            <label className={style.label}>
              <p className={style.content}>Price Per Night*</p>
              <input type="number" name="price" value={formData.pricePerNight[0].price === 0 ? "" : formData.pricePerNight[0].price} onChange={handlePriceChange} className={style.input} placeholder='Enter the price' required />
            </label>
          </div>
          <div className={style.textarea_div}>
            <label className={style.labels}>
              <p className={style.content}>Description</p>
              <textarea name="description" value={formData.description} onChange={handleChange} className={style.textarea} maxLength={500} placeholder="Enter some Extra Info"></textarea>
            </label>

            <label className={style.labels}>
              <p className={style.content}>Contact</p>
              <textarea name="contact" value={formData.contact} onChange={handleChange} className={style.textarea} maxLength={500} placeholder="How to communicate with them"></textarea>
            </label>
          </div>
          <div className="flex justify-end mt-4">
            <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={() => router.back()}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => router.back()}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Hotels;
