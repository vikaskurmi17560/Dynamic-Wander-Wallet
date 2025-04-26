"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { GetUser } from "../connection/userConnection";
import toast from "react-hot-toast";

const useData = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState({
    name: "",
    profile: "",
    banner: "",
    bio: "",
    phone_no: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("user_id");

    if (!token || !storedUserId) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const parsedUserId = JSON.parse(storedUserId)?.value || null;
      if (!parsedUserId) {
        setIsAuthenticated(false);
        return;
      }

      setUserId(parsedUserId);
      setIsAuthenticated(true);

      const fetchUserData = async () => {
        try {
          const response = await GetUser(parsedUserId); 
          if (response.success) {
            setUser({
              name: response.user.name || "",
              profile: response.user.profile || "",
              banner: response.user.banner || "",
              bio: response.user.bio || "",
              phone_no: response.user.phone_no || "",
            });
          }
        } catch (error) {
          toast.error("Some error occurred while fetching user data");
        }
      };

      fetchUserData();
    } catch (err) {
      console.error("Error parsing user_id:", err);
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_image");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    router.replace("/login");
  };
  return { userId, user, isAuthenticated, handleLogout };
};

export default useData;
