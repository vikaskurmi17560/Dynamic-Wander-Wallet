"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct router import
import { GetUser } from "../connection/userConnection";
import toast from "react-hot-toast";

const useUserData = () => {
  const router = useRouter();
  
  const [user, setUser] = useState({
    name: "",
    profile: "",
    banner: "",
    bio: "",
    phone_no: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // ✅ Set isAuthenticated from localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Convert token existence to boolean

    const fetchUserData = async () => {
      let user_id = localStorage.getItem("user_id");

      if (!user_id || !token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const parsedId = JSON.parse(user_id);
        if (parsedId?.value) {
          user_id = parsedId.value;
        }

        setIsAuthenticated(true);
        const response = await GetUser(user_id);

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
        toast.error("Some error occurred");
      }
    };

    fetchUserData();
  }, []);

  // ✅ Define handleLogout outside useEffect
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_image");

    setIsAuthenticated(false); // ✅ Update state immediately
    toast.success("Logged out successfully");

    router.replace("/login"); // Redirect to login
  };

  return { user, isAuthenticated, handleLogout };
};

export default useUserData;
