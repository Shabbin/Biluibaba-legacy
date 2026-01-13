"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";
import Select from "@/src/components/ui/select";

import axios from "@/src/lib/axiosInstance";
import Location from "./location.data";

interface ShippingAddress {
  state: string;
  area: string;
  district: string;
  postcode: string;
  address: string;
  name?: string;
  phoneNumber?: string;
}

interface User {
  name: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  shipping?: ShippingAddress;
}

const Page: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [personalInfoToggle, setPersonalInfoToggle] = useState<boolean>(false);
  const [addressToggle, setAddressToggle] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    state: "",
    area: "",
    district: "Dhaka",
    postcode: "",
    address: "",
  });

  const fetchUser = async (): Promise<void> => {
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

  const onSubmit = async (): Promise<void> => {
    if (name === "") {
      toast.error("Name cannot be empty");
      return;
    }
    if (phoneNumber === "") {
      toast.error("Phone number cannot be empty");
      return;
    }

    if (addressToggle) {
      if (shippingAddress.state === "") {
        toast.error("Shipping address state cannot be empty");
        return;
      }
      if (shippingAddress.address === "") {
        toast.error("Shipping address cannot be empty");
        return;
      }
      if (shippingAddress.postcode === "") {
        toast.error("Shipping address postcode cannot be empty");
        return;
      }
      if (shippingAddress.district === "") {
        toast.error("Shipping address district cannot be empty");
        return;
      }
      if (shippingAddress.area === "") {
        toast.error("Shipping address area cannot be empty");
        return;
      }
    }

    setUpdateLoading(true);

    try {
      const { data } = await axios.post("/api/auth/update-profile", {
        name,
        phoneNumber,
        shippingAddress: addressToggle ? shippingAddress : null,
      });

      if (data.success) {
        fetchUser();
        setPersonalInfoToggle(false);
        setAddressToggle(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUser();
  }, []);

  // Update form fields when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhoneNumber(user.phoneNumber || "");
      if (user.shipping) {
        setShippingAddress({
          state: user.shipping.state || "",
          area: user.shipping.area || "",
          district: user.shipping.district || "",
          postcode: user.shipping.postcode || "",
          address: user.shipping.address || "",
        });
      }
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h2 className="text-2xl">Manage My Account</h2>

      <div className="flex flex-row justify-between gap-5 py-5">
        <div className="p-5 border-2 rounded-lg flex flex-col gap-4 basis-1/2 justify-between">
          <h2 className="text-xl">Personal Profile</h2>
          <img
            src={user.avatar}
            alt={user.name}
            className="w-[150px] h-[150px] rounded-lg"
          />
          {personalInfoToggle ? (
            <Input
              defaultValue={user.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          ) : (
            <div className="text-xl">{user.name}</div>
          )}
          {personalInfoToggle ? (
            <Input
              defaultValue={user.phoneNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPhoneNumber(e.target.value)
              }
            />
          ) : (
            <div>{user.phoneNumber}</div>
          )}
          <div>{user.email}</div>

          <div className="py-5 flex flex-row justify-end">
            {personalInfoToggle ? (
              <Button
                type="default"
                text="Submit"
                disabled={updateLoading}
                onClick={onSubmit}
              />
            ) : (
              <Button
                type="outline"
                text="Edit"
                onClick={() => setPersonalInfoToggle(true)}
              />
            )}
          </div>
        </div>

        <div className="p-5 border-2 rounded-lg flex flex-col gap-4 basis-1/2 justify-between">
          <div className="space-y-5">
            <h2 className="text-xl">Address Book</h2>
            <div className="border-b-2 pb-5">
              <div className="uppercase font-light text-gray-500">
                Default Shipping Address
              </div>
              {addressToggle ? (
                <div className="space-y-3">
                  <Input
                    placeholder="Address"
                    value={shippingAddress.address}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setShippingAddress({
                        ...shippingAddress,
                        address: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Area"
                    value={shippingAddress.area}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setShippingAddress({
                        ...shippingAddress,
                        area: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setShippingAddress({
                        ...shippingAddress,
                        state: e.target.value,
                      })
                    }
                  />
                  <Select
                    data={Location.map((location) => ({
                      value: location,
                      text: location,
                    }))}
                    value={shippingAddress.district}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setShippingAddress({
                        ...shippingAddress,
                        district: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Postcode"
                    value={shippingAddress.postcode}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setShippingAddress({
                        ...shippingAddress,
                        postcode: e.target.value,
                      })
                    }
                  />
                </div>
              ) : user.shipping ? (
                <div className="py-2">
                  <h2 className="font-semibold">{user.shipping.name}</h2>
                  <div>{user.shipping.address}</div>
                  <div className="flex flex-row">
                    {user.shipping.district} - {user.shipping.state} -{" "}
                    {user.shipping.area} - {user.shipping.postcode}
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
          </div>

          <div className="py-5 flex flex-row justify-end">
            {addressToggle ? (
              <Button
                type="default"
                text="Submit"
                disabled={updateLoading}
                onClick={onSubmit}
              />
            ) : (
              <Button
                type="outline"
                text="Edit"
                onClick={() => setAddressToggle(true)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
