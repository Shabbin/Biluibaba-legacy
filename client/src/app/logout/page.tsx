"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/src/lib/axiosInstance";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const { data } = await axios.get("/api/auth/logout");

        if (data.success) {
          router.push("/login");
        }
      } catch (error) {
        console.error(error);
        router.push("/my-account");
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-xl font-semibold text-petzy-slate">Logging out...</div>
        <div className="mt-4 w-12 h-12 border-4 border-petzy-coral border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
