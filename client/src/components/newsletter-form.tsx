"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import axios from "@/src/lib/axiosInstance";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return toast.error("Please enter your email address");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return toast.error("Please enter a valid email address");

    setLoading(true);
    try {
      const { data } = await axios.post("/api/contact/newsletter", { email });
      if (data.success) {
        toast.success(data.data || "Subscribed successfully!");
        setEmail("");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="flex-1 px-5 py-3 rounded-xl bg-white border border-petzy-slate/10 focus:outline-none focus:border-petzy-coral/50 focus:ring-2 focus:ring-petzy-coral/20 transition-all text-petzy-slate"
        onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
      />
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="px-8 py-3 bg-petzy-coral text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-petzy-coral/30 hover:shadow-petzy-coral/40 active:scale-95 disabled:opacity-60"
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
    </div>
  );
}
