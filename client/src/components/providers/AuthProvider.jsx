"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
        console.log("Failed to fetch user data");
      }
    } catch (error) {
      console.log("Error fetching user data:");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
