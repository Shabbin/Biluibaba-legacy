"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

import axiosInstance from "@/src/lib/axiosInstance";

import { useAuth } from "@/src/components/providers/AuthProvider";

import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";
import Radio from "@/src/components/ui/radio";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Facebook, Google } from "@/src/components/svg";

const Login = () => {
  const router = useRouter();
  const { fetchUserData, user } = useAuth();
  const searchParams = useSearchParams();

  const from = searchParams.get("from");

  if (!from) router.push("/login?from=/");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  if (user) router.push("/");

  const login = async (authType) => {
    if (authType === "traditional") {
      if (email === "") return toast.error("Please provide valid email");
      if (password === "") return toast.error("Please provide valid password");
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
        toast.success(
          "You have successfully logged into your account. Redirecting you back to page..."
        );
        await fetchUserData();
        return router.push(from || "/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error) ||
        "Login failed. Please try again.";
    } finally {
      setLoading(false);
      setGoogleLoading(false);
      setFacebookLoading(false);
    }
  };

  return (
    <div className="py-20 bg-[#f8f8f8]">
      <div className="container mx-auto">
        <div className="flex flex-row justify-between">
          <img
            className="basis-1/2 min-w-[400px] h-1/2 md:block hidden rounded-tl-2xl rounded-bl-2xl"
            src="/login.png"
            alt="Login"
          />
          <div className="md:basis-1/2 basis-full bg-white p-8 flex flex-col justify-evenly md:mx-0 mx-5 rounded-2xl md:rounded-tl-none md:rounded-bl-none">
            <div>
              <h2 className="text-3xl font-bold">Login</h2>
              <p className="my-5 text-xl text-gray-600 font-light">
                Get access to your Orders, Wishlist, Vet and Recommendations
              </p>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <label className="font-bold">Email Address *</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email Address"
                />

                <label className="font-bold">Password *</label>
                <div className="relative block">
                  {passwordType === "password" ? (
                    <FaEyeSlash
                      size="1.5em"
                      className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
                      onClick={() => setPasswordType("text")}
                    />
                  ) : (
                    <FaEye
                      size="1.5em"
                      className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
                      onClick={() => setPasswordType("password")}
                    />
                  )}
                  <Input
                    type={passwordType}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>

                <div className="flex flex-row justify-between items-center my-2 mx-1">
                  <div className="flex flex-row items-center gap-2">
                    <Radio /> Remember Me
                  </div>
                  <Link href="/">Forgot Password?</Link>
                </div>

                <Button
                  type="default"
                  disabled={loading}
                  text="Login"
                  className="mt-5 w-full !font-bold"
                  onClick={() => login("traditional")}
                ></Button>

                <div className="py-5 text-center">
                  By continuing, you agree to Biluibaba's{" "}
                  <Link href="/login" className="text-blue-500 underline">
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link href="/login" className="text-blue-500 underline">
                    Privacy Policy.
                  </Link>
                </div>
              </div>

              <div className="flex flex-row flex-nowrap items-center my-5">
                <div className="flex-grow block border-t border-gray-300"></div>
                <div className="flex-none block mx-4 px-4 py-2.5 text-xl text-gray-500 font-bold uppercase">
                  or
                </div>
                <div className="flex-grow block border-t border-gray-300"></div>
              </div>

              <div>
                <div className="flex flex-col items-center justify-between gap-5">
                  <Button
                    iconAlign="left"
                    type="outline"
                    disabled={googleLoading}
                    text="Login with Google"
                    icon={<Google className="text-[1.5em]" />}
                    className="w-full basis-1/2"
                    onClick={() => login("google")}
                  />
                  <Button
                    iconAlign="left"
                    type="outline"
                    disabled={facebookLoading}
                    text="Login with Facebook"
                    icon={<Facebook className="text-[1.5em]" />}
                    className="w-full basis-1/2"
                    onClick={() => login("facebook")}
                  />
                </div>
              </div>

              <div className="py-5 text-center">
                New to Biluibaba?{" "}
                <Link href="/signin" className="text-blue-500 font-bold">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
