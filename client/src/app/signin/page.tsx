"use client";

import React, { useState, Suspense, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Facebook, Google } from "@/src/components/svg";

import { useAuth } from "@/src/components/providers/AuthProvider";

import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";

import axiosInstance from "@/src/lib/axiosInstance";

type AuthType = "traditional" | "google" | "facebook";
type PasswordType = "password" | "text";

const Signin: React.FC = () => {
  const { fetchUserData } = useAuth();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordType, setPasswordType] = useState<PasswordType>("password");

  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [facebookLoading, setFacebookLoading] = useState<boolean>(false);

  const handleForm = async (authType: AuthType): Promise<void> => {
    if (authType === "traditional") {
      if (name === "" || name.length <= 3) {
        return toast.error(
          "Please provide a valid name! Name should be at least 4 characters long"
        ) as unknown as void;
      }
      if (phoneNumber === "" || phoneNumber.length < 11) {
        return toast.error("Please provide valid phone number.") as unknown as void;
      }
      if (email === "" || !email.includes("@")) {
        return toast.error("Please provide valid email") as unknown as void;
      }
      if (password === "" || password.length < 8) {
        return toast.error("Password should at least be 8 characters long!") as unknown as void;
      }
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

      if (data.success && authType !== "traditional") {
        window.location.href = data.url;
      } else if (data.success && authType === "traditional") {
        toast.success(
          "You have successfully created your account. Redirecting you back to page..."
        );
        await fetchUserData();
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setGoogleLoading(false);
      setFacebookLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handlePhoneKeyPress = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div className="py-20 bg-[#f8f8f8]">
      <div className="container md:mx-auto">
        <div className="flex flex-row justify-between">
          <img
            src="/login.png"
            alt="Login"
            className="basis-1/2 min-w-[400px] h-1/2 md:block hidden rounded-tl-2xl rounded-bl-2xl"
          />
          <div className="md:basis-1/2 basis-full bg-white p-8 flex flex-col justify-evenly md:mx-0 mx-5 rounded-2xl md:rounded-tl-none md:rounded-bl-none">
            <div>
              <h2 className="text-3xl font-bold">Signup</h2>
              <p className="my-5 text-xl text-gray-600 font-light">
                Get access to your Orders, Wishlist, Vet and Recommendations
              </p>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="text-lg font-bold">Name *</div>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                />

                <div className="text-lg font-bold">Phone Number *</div>
                <Input
                  type="text"
                  placeholder="Enter phone number"
                  pattern="[0-9]*"
                  value={phoneNumber}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setPhoneNumber(event.target.value)
                  }
                  onKeyPress={handlePhoneKeyPress}
                />

                <div className="text-lg font-bold">Email *</div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                />

                <div className="text-lg font-bold">Password *</div>
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
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setPassword(event.target.value)
                    }
                  />
                </div>
                <Button
                  type="default"
                  disabled={loading}
                  text="Create Account"
                  className="mt-5 w-full"
                  onClick={() => handleForm("traditional")}
                />

                <div className="py-5 text-center">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-500 font-bold">
                    Login
                  </Link>
                </div>

                <div className="flex flex-row flex-nowrap items-center my-5">
                  <div className="flex-grow block border-t border-gray-300"></div>
                  <div className="flex-none block mx-4 px-4 py-2.5 text-xl text-gray-300 font-bold uppercase">
                    or
                  </div>
                  <div className="flex-grow block border-t border-gray-500"></div>
                </div>

                <div>
                  <div className="flex flex-col items-center justify-between gap-5">
                    <Button
                      iconAlign="left"
                      type="outline"
                      disabled={googleLoading}
                      text="Signin with Google"
                      icon={<Google className="text-[1.5em]" />}
                      className="w-full basis-1/2"
                      onClick={() => handleForm("google")}
                    />
                    <Button
                      iconAlign="left"
                      type="outline"
                      disabled={facebookLoading}
                      text="Signin with Facebook"
                      icon={<Facebook className="text-[1.5em]" />}
                      className="w-full basis-1/2"
                      onClick={() => handleForm("facebook")}
                    />
                  </div>
                </div>

                <div className="py-5 text-center">
                  By continuing, you agree to Biluibaba&apos;s{" "}
                  <Link href="/login" className="text-blue-500 underline">
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link href="/login" className="text-blue-500 underline">
                    Privacy Policy.
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Signin />
    </Suspense>
  );
};

export default Page;
