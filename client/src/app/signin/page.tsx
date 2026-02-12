"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";

import { useAuth } from "@/src/components/providers/AuthProvider";
import Button from "@/src/components/ui/button";
import axiosInstance from "@/src/lib/axiosInstance";

const SignupContent = () => {
  const { fetchUserData } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  const handleRegister = async (authType) => {
    if (authType === "traditional") {
      if (name.length <= 3) return toast.error("Name must be at least 4 characters long");
      if (phoneNumber.length < 11) return toast.error("Please provide a valid phone number");
      if (!email.includes("@")) return toast.error("Please provide a valid email");
      if (password.length < 8) return toast.error("Password must be at least 8 characters long");
      setLoading(true);
    } else if (authType === "google") {
      setGoogleLoading(true);
    } else if (authType === "facebook") {
      setFacebookLoading(true);
    }

    try {
      const { data } = await axiosInstance.post("/api/auth/register", {
        type: authType,
        name,
        email,
        password,
        phoneNumber,
      });

      if (data.success) {
        if (authType !== "traditional") {
          window.location.href = data.url;
        } else {
          toast.success("Account created successfully!");
          await fetchUserData();
          router.push("/");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
      setGoogleLoading(false);
      setFacebookLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* --- LEFT SIDE: IMAGE --- */}
        <div className="hidden md:block md:w-1/2 relative bg-petzy-slate">
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-90"
            src="/login.png" // Reusing the login image or a dedicated signup one
            alt="Petzy Signup"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-12 text-white z-10">
            <h2 className="text-4xl font-bold mb-4">Join the Family</h2>
            <p className="text-lg text-gray-200 leading-relaxed">
              Create an account to track orders, book expert vets, and get personalized care tips for your pets.
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 bg-white flex flex-col justify-center">
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-bold text-petzy-slate mb-2">Create Account</h2>
            <p className="text-petzy-slate-light">Enter your details to get started.</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-petzy-slate mb-2 ml-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-petzy-slate focus:outline-none focus:ring-2 focus:ring-petzy-coral/20 focus:border-petzy-coral transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-petzy-slate mb-2 ml-1">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 017xxxxxxxx"
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-petzy-slate focus:outline-none focus:ring-2 focus:ring-petzy-coral/20 focus:border-petzy-coral transition-all"
                onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
              />
            </div>

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
                  placeholder="Min. 8 characters"
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

            {/* Signup Button */}
            <Button
              type="default"
              disabled={loading}
              text={loading ? "Creating Account..." : "Sign Up"}
              className="w-full !py-3.5 text-lg shadow-lg shadow-petzy-coral/20 hover:shadow-petzy-coral/40 mt-4"
              onClick={() => handleRegister("traditional")}
              icon={null}
              iconAlign={null}
            />
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium uppercase tracking-wider">Or register with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              disabled={googleLoading}
              onClick={() => handleRegister("google")}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-bold text-petzy-slate"
            >
              <FcGoogle size="1.5em" />
              Google
            </button>
            <button
              disabled={facebookLoading}
              onClick={() => handleRegister("facebook")}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 hover:text-[#1877F2] transition-all text-sm font-bold text-petzy-slate"
            >
              <FaFacebook size="1.5em" className="text-[#1877F2]" />
              Facebook
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-petzy-coral font-bold hover:underline">
              Log in
            </Link>
          </div>

          <div className="text-xs text-center text-gray-400 mt-6 leading-relaxed">
             By signing up, you agree to our{" "}
             <Link href="/terms" className="underline hover:text-petzy-slate">Terms</Link> and{" "}
             <Link href="/privacy" className="underline hover:text-petzy-slate">Privacy Policy</Link>.
          </div>

        </div>
      </div>
    </div>
  );
};

const Signup = () => {
  return (
    <Suspense>
      <SignupContent />
    </Suspense>
  );
};

export default Signup;