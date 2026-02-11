"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

import axiosInstance from "@/src/lib/axiosInstance";
import { useAuth } from "@/src/components/providers/AuthProvider";

import Button from "@/src/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc"; // Standard Google Icon color
import { FaFacebook } from "react-icons/fa6";

const Login = () => {
  const router = useRouter();
  const { fetchUserData, user } = useAuth();
  const searchParams = useSearchParams();

  const from = searchParams.get("from");

  if (!from && typeof window !== "undefined") {
    // router.push is better than redirect logic inside render
    // preventing infinite loops if handled in useEffect usually, 
    // but keeping your logic flow roughly the same:
    // router.replace("/login?from=/"); 
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  if (user) router.push("/");

  const login = async (authType) => {
    if (authType === "traditional") {
      if (email === "") return toast.error("Please provide a valid email");
      if (password === "") return toast.error("Please provide a password");
      setLoading(true);
    } else if (authType === "google") {
      setGoogleLoading(true);
    } else if (authType === "facebook") {
      setFacebookLoading(true);
    }

    try {
      let { data } = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { type: authType, email, password, from: from || "/" }
      );

      if (data.success && authType !== "traditional") {
        window.location.href = data.url;
      } else if (data.success && authType === "traditional") {
        toast.success("Successfully logged in!");
        await fetchUserData();
        return router.push(from || "/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
      setGoogleLoading(false);
      setFacebookLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* --- LEFT SIDE: IMAGE & BRANDING --- */}
        <div className="hidden md:block md:w-1/2 relative bg-petzy-slate">
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-90"
            src="/login.png" // Ensure this image is high quality
            alt="Petzy Login"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-12 text-white z-10">
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-lg text-gray-200 leading-relaxed">
              Get access to your Orders, Wishlist, Expert Vet Consultations, and personalized recommendations for your furry friend.
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 bg-white flex flex-col justify-center">
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-bold text-petzy-slate mb-2">Login to Account</h2>
            <p className="text-petzy-slate-light">Please enter your details to continue.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-petzy-slate mb-2 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-petzy-slate focus:outline-none focus:ring-2 focus:ring-petzy-coral/20 focus:border-petzy-coral transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-petzy-slate mb-2 ml-1">Password</label>
              <div className="relative">
                <input
                  type={passwordType}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-petzy-slate focus:outline-none focus:ring-2 focus:ring-petzy-coral/20 focus:border-petzy-coral transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setPasswordType(passwordType === "password" ? "text" : "password")}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-petzy-slate transition-colors"
                >
                  {passwordType === "password" ? <FaEyeSlash size="1.2em" /> : <FaEye size="1.2em" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-petzy-slate">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded text-petzy-coral focus:ring-petzy-coral border-gray-300" 
                />
                Remember Me
              </label>
              <Link href="/forgot-password" className="text-petzy-coral font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="default"
              disabled={loading}
              text={loading ? "Logging in..." : "Login"}
              className="w-full !py-3.5 text-lg shadow-lg shadow-petzy-coral/20 hover:shadow-petzy-coral/40"
              onClick={() => login("traditional")}
            />
          </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium uppercase tracking-wider">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                disabled={googleLoading}
                onClick={() => login("google")}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-bold text-petzy-slate"
              >
                <FcGoogle size="1.5em" />
                Google
              </button>
              <button
                disabled={facebookLoading}
                onClick={() => login("facebook")}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 hover:text-[#1877F2] transition-all text-sm font-bold text-petzy-slate"
              >
                <FaFacebook size="1.5em" className="text-[#1877F2]" />
                Facebook
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              New to Biluibaba?{" "}
              <Link href="/signin" className="text-petzy-coral font-bold hover:underline">
                Create an account
              </Link>
            </div>

            <div className="text-xs text-center text-gray-400 mt-6 leading-relaxed">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-petzy-slate">Terms of Use</Link> and{" "}
              <Link href="/privacy" className="underline hover:text-petzy-slate">Privacy Policy</Link>.
            </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;