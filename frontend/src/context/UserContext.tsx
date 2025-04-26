"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserContextType {
    userId: string | null;
    isAuthenticated: boolean;
    handleLogout: () => void;
    updateUserContext: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const updateUserContext = async () => {
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
        } catch (error) {
            toast.error("Failed to initialize user context");
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        updateUserContext();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setUserId(null);
        toast.success("Logged out successfully");
        router.replace("/login");
    };

    return (
        <UserContext.Provider value={{ userId, isAuthenticated, handleLogout, updateUserContext }}>
            {children}
        </UserContext.Provider>
    );
};

export const useData = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useData must be used within a UserProvider");
    }
    return context;
};
