"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Vendor = {
  id?: string;
  status?: string;
  name?: string;
  isVerified?: boolean;
  type?: string;
  storeName?: string;
};

const AuthContext = createContext<Vendor>({});

export const AuthProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [user, setUser] = useState<Vendor>({});

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();

      if (data.user) setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
