"use client";

import { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";

import { FaStar, FaCheck } from "react-icons/fa";
import Link from "next/link";

import Button from "@/src/components/ui/button";

import axios from "@/src/lib/axiosInstance";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/me");

      if (data.success) setUser(data.data);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUser();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2 className="text-2xl">Manage My Account</h2>

          <div className="flex flex-row justify-between gap-5 py-5">
            <div className="p-5 border-2 rounded-lg flex flex-col gap-4 basis-1/2 justify-between">
              <h2 className="text-xl">Personal Profile</h2>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-[150px] h-[150px] rounded-lg"
              />
              <div className="text-xl">{user.name}</div>
              <div>{user.phoneNumber}</div>
              <div>{user.email}</div>

              <div className="py-5 flex flex-row justify-end">
                <Button type="outline" text="Edit"></Button>
              </div>
            </div>

            <div className="p-5 border-2 rounded-lg flex flex-col gap-4 basis-1/2 justify-between">
              <div className="space-y-5">
                <h2 className="text-xl">Address Book</h2>
                <div className="border-b-2 pb-5">
                  <div className="uppercase font-light  text-gray-500">
                    Default Shipping Address
                  </div>
                  {user.shipping ? (
                    <div className="py-2">
                      <h2 className="font-semibold">{user.shipping.name}</h2>
                      <div>{user.shipping.address}</div>
                      <div className="flex flex-row">
                        {user.district} - {user.state} - {user.area} -{" "}
                        {user.postcode}
                      </div>
                      <div>{user.shipping.phoneNumber}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-lg">No shipping address</div>
                      <div className="underline text-sm text-gray-400">
                        Add shipping address
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="uppercase font-light text-gray-500">
                    Default Billing Address
                  </div>
                  {user.billing ? (
                    <div className="py-2">
                      <h2 className="font-semibold">{user.billing.name}</h2>
                      <div>{user.billing.address}</div>
                      <div className="flex flex-row">
                        {user.district} - {user.state} - {user.area} -{" "}
                        {user.postcode}
                      </div>
                      <div>{user.billing.phoneNumber}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-lg">No billing address</div>
                      <div className="underline text-sm text-gray-400">
                        Add billing address
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="py-5 flex flex-row justify-end">
                <Button type="outline" text="Edit"></Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
