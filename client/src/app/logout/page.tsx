"use client";

import { useEffect } from "react";
import axios from "@/src/lib/axiosInstance";

export default function Logout(): JSX.Element {
  useEffect(() => {
    const performLogout = async (): Promise<void> => {
      try {
        const { data } = await axios.get("/api/auth/logout");

        if (data.success) {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error(error);
        window.location.href = "/my-account";
      }
    };

    performLogout();
  }, []);

  return <div>Logging out...</div>;
}
