"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

import axiosInstance from "@/src/lib/axiosInstance";

import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";

import { FaFacebook, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

const Signin = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [loading, setLoading] = useState(false);

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
    }

    setLoading(true);

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
        return (window.location.href = from);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return toast.error("Something went wrong. Please try again.");
    }
    localStorage.setItem("token", true);
    router.push(from);
  };

  return (
    <div className="py-20">
      <div className="container md:mx-auto">
        <div className="flex md:flex-row flex-col gap-10 items-center">
          <div className="basis-1/2 md:px-0 px-5">
            <div className="text-3xl my-10 font-bold">Signin</div>

            <div className="my-5 font-bold text-lg">Signin with</div>
            <div className="flex flex-row items-center justify-between gap-5">
              <Button
                type="default"
                disabled={loading}
                icon={<FaFacebook size="1.5em" className="text-white" />}
                className="w-full basis-1/2"
                onClick={() => handleForm("facebook")}
              />
              <Button
                type="default"
                disabled={loading}
                icon={
                  <FaGoogle size="1.5em" className="text-white flex-grow" />
                }
                className="w-full basis-1/2"
                onClick={() => handleForm("facebook")}
              />
            </div>

            <div className="flex flex-row flex-nowrap items-center my-5">
              <div className="flex-grow block border-t border-gray-500"></div>
              <div className="flex-none block mx-4 px-4 py-2.5 text-xl text-gray-500 font-bold">
                or continue with
              </div>
              <div className="flex-grow block border-t border-gray-500"></div>
            </div>
            <div className="flex flex-row items-center flex-wrap gap-x-8 gap-y-3">
              <div className="md:w-1/2 w-full md:-m-2 md:p-2">
                <div className="text-lg">Name *</div>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="md:w-1/2 w-full md:-m-2 md:p-2">
                <div className="text-lg">Phone Number *</div>
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
              </div>
              <div className="md:w-1/2 w-full md:-m-2 md:p-2">
                <div className="text-lg">Email *</div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="md:w-1/2 w-full md:-m-2 md:p-2">
                <div className="text-lg">Password *</div>
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
              </div>
            </div>

            <Button
              text="Sign In"
              disabled={loading}
              type="default"
              className="w-full my-5"
              onClick={() => handleForm("traditional")}
            />

            <div className="text-center my-10 font-bold text-gray-600">
              Already Registered with phone number?{" "}
              <Link
                href={`/signin?from=${from}`}
                className="underline text-black"
              >
                Sign in with phone number
              </Link>
            </div>
          </div>
          <img
            src="/signin.png"
            alt="signin"
            className="basis-1/2 w-[500px] rounded-3xl md:p-0 p-2"
          />
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
