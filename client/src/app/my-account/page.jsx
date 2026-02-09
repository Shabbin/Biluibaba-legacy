"use client";

import { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import toast from "react-hot-toast";

import { FaStar, FaCheck } from "react-icons/fa";
import Link from "next/link";

import Button from "@/src/components/ui/button";
import { PageLoader } from "@/src/components/ui";

import axios from "@/src/lib/axiosInstance";
import Input from "@/src/components/ui/input";

import Location from "./location.data";
import Select from "@/src/components/ui/select";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [personalInfoToggle, setPersonalInfoToggle] = useState(false);
  const [addressToggle, setAddressToggle] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    state: "",
    area: "",
    district: "Dhaka",
    postcode: "",
    address: "",
  });

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

  const onSubmit = async () => {
    if (name === "") return toast.error("Name cannot be empty");
    if (phoneNumber === "") return toast.error("Phone number cannot be empty");

    if (addressToggle) {
      if (shippingAddress.state === "")
        return toast.error("Shipping address state cannot be empty");
      if (shippingAddress.address === "")
        return toast.error("Shipping address cannot be empty");
      if (shippingAddress.postcode === "")
        return toast.error("Shipping address postcode cannot be empty");
      if (shippingAddress.district === "")
        return toast.error("Shipping address district cannot be empty");
      if (shippingAddress.area === "")
        return toast.error("Shipping address area cannot be empty");
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

  return (
    <div>
      {loading ? (
        <PageLoader />
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
              {personalInfoToggle ? (
                <Input
                  defaultValue={user.name}
                  onChange={(e) => setName(e.target.value)}
                />
              ) : (
                <div className="text-xl">{user.name}</div>
              )}
              {personalInfoToggle ? (
                <Input
                  defaultValue={user.phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
                    onClick={() => onSubmit()}
                  ></Button>
                ) : (
                  <Button
                    type="outline"
                    text="Edit"
                    onClick={() => setPersonalInfoToggle(true)}
                  ></Button>
                )}
              </div>
            </div>

            <div className="p-5 border-2 rounded-lg flex flex-col gap-4 basis-1/2 justify-between">
              <div className="space-y-5">
                <h2 className="text-xl">Address Book</h2>
                <div className="border-b-2 pb-5">
                  <div className="uppercase font-light  text-gray-500">
                    Default Shipping Address
                  </div>
                  {addressToggle ? (
                    <div className="space-y-3">
                      <Input
                        placeholder="Address"
                        value={shippingAddress.address}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            address: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Area"
                        value={shippingAddress.area}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            area: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="State"
                        value={shippingAddress.state}
                        onChange={(e) =>
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
                        onChange={() =>
                          setShippingAddress({
                            ...shippingAddress,
                            district: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Postcode"
                        value={shippingAddress.postcode}
                        onChange={(e) =>
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
                    onClick={() => onSubmit()}
                  ></Button>
                ) : (
                  <Button
                    type="outline"
                    text="Edit"
                    onClick={() => setAddressToggle(true)}
                  ></Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
