import { useState, useEffect } from "react";
import { GetUser } from "../connection/userConnection";
import toast from "react-hot-toast";


const useUserData = () => {
  const [user, setUser] = useState({
    name: "",
    profile: "",
    banner: "",
    bio: "",
    phone_no: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      let user_id = localStorage.getItem("user_id");
      if (user_id) {
        try {
          const parsedId = JSON.parse(user_id);
          if (parsedId?.value) {
            user_id = parsedId.value;
          }

          const response = await GetUser(user_id);

          if (response.success) {
            setUser({
              name: response.user.name || "",
              profile: response.user.profile || "",
              banner: response.user.banner || "",
              bio: response.user.bio || "",
              phone_no:response.user.phone_no || "",
            });
          }
        } catch (error) {
          toast.error("Some error occurred");
        }
      }
    };

    fetchUserData();
  }, []);

  return user;
};

export default useUserData;