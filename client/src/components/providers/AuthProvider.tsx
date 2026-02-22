"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User, AuthContextType } from "@/src/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
         setUser(null);
      }
    } catch (error) {
       setUser(null);
      console.log("Error fetching user data:");
    }
  };
const logout = async () => {
  // Immediately update UI
  setUser(null);

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.log("Logout failed:", error);
  }
};
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
<AuthContext.Provider value={{ user, setUser, fetchUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
