export interface User {
    _id: string;
    name: string;
    email: string;
    phone_no: string;
    gender?: string;
    profile?: string;
    banner?: string;
    bio?: string;
    posts: any[];
    followers: {
      _id: string;
      name: string;
      profile?: string;
    }[];
    following: {
      _id: string;
      name: string;
      profile?: string;
    }[];
    badge_point: number;
    total_trip: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export const getUser = async (userId: string): Promise<User | null> => {
    try {
        const res = await fetch(`http://localhost:7050/api/v1/user/get-user?user_id=${userId}`);
      const data = await res.json();
  
      if (data.success) {
        return data.user;
      } else {
        console.error("Failed to fetch user:", data.message);
        return null;
      }
    } catch (error) {
      console.error("API error:", error);
      return null;
    }
  };
  