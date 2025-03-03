"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import style from "./Feedback.module.css";

const Feedback = () => {
  const wanderWalletFeedback = [
    "Wander Wallet has completely transformed how I plan my trips. I was able to create a detailed itinerary, book hotels and transportation seamlessly, and even save videos and photos of my travels to share with friends.",
    "This app is incredible! I planned my entire vacation using Wander Wallet. The ability to create my own trip plan, book hotels, vehicles, and activities in one place saved me so much time and hassle.",
    "Wander Wallet is a must-have for anyone who loves traveling. I was able to explore different destinations using the flip card feature, which made discovering new places fun and engaging.",
    "I used Wander Wallet to plan a family vacation, and I couldn’t be happier with the experience. The app’s interface is user-friendly, making it easy to book hotels and local transportation.",
    "This app goes beyond just trip planning. Wander Wallet feels like a social media platform tailored for travelers. I loved browsing through other users' travel stories for inspiration.",
    "Planning a trip used to be stressful, but Wander Wallet changed that completely. I could browse destinations, select the best hotels and transportation, and save all my trip details in one convenient place.",
    "I never thought planning a vacation could be this easy! With Wander Wallet, I explored various destinations through their interactive cards, booked hotels and cars without any issues, and created posts to share my journey with friends.",
    "Wander Wallet helped me plan an unforgettable trip to Kerala. The app’s trip planner allowed me to customize every detail, from selecting activities to booking hotels.",
    "I absolutely love Wander Wallet! It’s more than just a booking app—it’s a complete travel companion. I planned my entire trip, booked hotels and local transport, and shared posts just like on Instagram.",
    "Traveling has never been easier thanks to Wander Wallet. I planned my entire trip, booked everything, and saved my itinerary for quick access. I especially liked being able to upload and share videos from my journey.",
    "Wander Wallet made my solo travel experience so much smoother. The ability to plan my trip, book accommodations, and find activities all in one app was a game-changer.",
    "I loved using Wander Wallet to explore different travel options. The interactive flip cards helped me discover hidden gems and plan the perfect trip.",
    "This app has everything a traveler needs. From booking hotels to organizing itineraries, Wander Wallet is my go-to travel planner now.",
    "Wander Wallet made group trip planning effortless. My friends and I could collaborate on our itinerary, book everything seamlessly, and stay organized throughout our vacation.",
    "I was impressed by how easy it was to keep track of my travel expenses using Wander Wallet. The budgeting tool helped me stay within my limits without missing out on experiences.",
    "Wander Wallet is the best travel app I’ve ever used! It made my honeymoon planning so much easier, and I was able to book everything in just a few taps.",
    "I never leave for a trip without Wander Wallet. It helps me organize my plans, find great deals on hotels, and explore new activities stress-free.",
    "This app saved me so much time! Instead of using multiple apps to book hotels, transportation, and activities, I had everything in one place with Wander Wallet.",
    "Wander Wallet’s user-friendly interface and rich features make it a must-have for travelers. I love how I can create and save itineraries with ease.",
    "I recommended Wander Wallet to all my travel buddies. It’s such a convenient way to plan, book, and share travel experiences in one seamless platform.",
    "From business trips to leisure travel, Wander Wallet has been my go-to travel planner. I love how organized and efficient it makes the whole process.",
    "Wander Wallet took the hassle out of vacation planning. The app’s ability to suggest activities and accommodations based on my interests was a great touch.",
    "I love how I can create custom travel lists on Wander Wallet. Whether it’s must-visit spots or packing checklists, the app keeps everything in one place.",
    "The best part about Wander Wallet is how it connects travelers. I enjoyed reading other users’ experiences and getting tips for my next adventure.",
    "Wander Wallet’s real-time updates on travel bookings helped me stay on top of my schedule without any stress. Highly recommend it for frequent travelers.",
    "This app is perfect for last-minute trip planners like me! I was able to quickly find and book hotels, transportation, and experiences with no hassle.",
    "Wander Wallet made it super easy to plan my backpacking trip. I could see all my bookings and travel details in one organized view.",
    "I love the feature that lets me save and revisit past trips. Wander Wallet keeps all my memories and itineraries neatly stored for future reference.",
    "I was able to track my spending while traveling with Wander Wallet’s budget planner. It helped me enjoy my vacation without overspending.",
    "Thanks to Wander Wallet, I discovered amazing offbeat destinations that I wouldn’t have found otherwise. The app truly enhanced my travel experience."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % wanderWalletFeedback.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [wanderWalletFeedback.length]);

  const getClassName = (index) => {
    if (index === currentIndex) return style.active;
    if (index === (currentIndex - 1 + wanderWalletFeedback.length) % wanderWalletFeedback.length) return style.leftBlur;
    if (index === (currentIndex + 1) % wanderWalletFeedback.length) return style.rightBlur;
    return style.hidden;
  };

  return (
    <div className={style.main}>
      <div className={style.heading_div}>
        <p className={style.heading}>Loved by thousands of people</p>
        <p className={style.heading_desp}>
          Here's what some of our users have to say about Dynamic Wander Wallet.
        </p>
      </div>

      <div className={style.carousel_container}>
        {wanderWalletFeedback.map((feedback, index) => (
          <div key={index} className={`${style.feedback_card} ${getClassName(index)}`}>
            <Image
              src="/images/ProfileIcon.webp"
              alt="Profile Icon"
              width={60}
              height={60}
              className={style.profile_icon}
            />
            <p className={style.feedback_text}>{feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;