"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

import { FaFacebook, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Facebook, Google } from "@/src/components/svg";

import { useAuth } from "@/src/components/providers/AuthProvider";

import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";

import axiosInstance from "@/src/lib/axiosInstance";

const Signin = () => {
  const { fetchUserData } = useAuth();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");

  const [loading, setLoading] = useState(false);
  const [googleLoaading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  const router = useRouter();

  const handleForm = async (authType) => {
    if (authType === "traditional") {
      if (name === "" || name.length <= 3)
        return toast.error(
          "Please provide a valid name! Name should be at least 4 characters long"
        );
      if (phoneNumber === "" || phoneNumber.length < 11)
        return toast.error("Please provide valid phone number.");
      if (email === "" || !email.includes("@"))
        return toast.error("Please provide valid email");
      if (password === "" || password.length < 8)
        return toast.error("Password should at least be 8 characters long!");

      setLoading(true);
    } else if (authType === "google") {
      setGoogleLoading(true);
    } else if (authType === "facebook") {
      setFacebookLoading(true);
    }

    try {
      let { data } = await axiosInstance.post("/api/auth/register", {
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
        return router.push("/");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setGoogleLoading(false);
      setFacebookLoading(false);
      return toast.error("Something went wrong. Please try again.");
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
                  onChange={(event) => setName(event.target.value)}
                />

                <div className="text-lg font-bold">Phone Number *</div>
                <Input
                  type="text"
                  placeholder="Enter phone number"
                  pattern="[0-9]*"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />

                <div className="text-lg font-bold">Email *</div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <Button
                  type="default"
                  disabled={loading}
                  text="Create Account"
                  className="mt-5 w-full"
                  onClick={() => handleForm("traditional")}
                ></Button>

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
                      disabled={googleLoaading}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense>
      <Signin />
    </Suspense>
  );
};

export default Page;
