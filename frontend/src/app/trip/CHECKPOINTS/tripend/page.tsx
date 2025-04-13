"use client";

import { useSearchParams, useRouter } from "next/navigation";
import style from "./tripend.module.css";
import Image from "next/image";
const TripEnd = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tripName = searchParams.get("tripName") || "Your Trip";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-lg">
                <h1 className="text-3xl font-bold text-blue-600">🚀 Trip Successfully Ended!</h1>
                <p className="text-lg text-gray-600 mt-3">Your journey has been completed successfully.</p>

                <div className="mt-5 p-4 bg-gray-200 rounded-lg">
                    <p className="text-gray-800 font-semibold">📍 <span className="text-blue-500">{tripName}</span></p>
                </div>

                <p className="text-md text-gray-500 mt-4">
                    We hope you had a smooth and enjoyable trip. You can review your trip history or plan a new adventure anytime!
                </p>

                <div className={style.btn_div}>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
                    >
                        📌 Go to Dashboard
                    </button>
                    <button
                        onClick={() => router.push("/trip")}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
                    >
                        ✈️ Plan a New Trip
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700"
                    >
                        🏠 Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TripEnd;
