"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FaMapLocationDot,
  FaPenToSquare,
  FaFloppyDisk,
  FaXmark,
} from "react-icons/fa6";

import Button from "@/src/components/ui/button";
import { PageLoader } from "@/src/components/ui";
import Input from "@/src/components/ui/input";
import Select from "@/src/components/ui/select";

import axios from "@/src/lib/axiosInstance";
import LocationData from "../location.data";
import type { ApiAxiosError } from "@/src/types";

interface AddressData {
  state: string;
  area: string;
  district: string;
  postcode: string;
  address: string;
}

export default function AddressPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState<AddressData>({
    state: "",
    area: "",
    district: "Dhaka",
    postcode: "",
    address: "",
  });
  const [original, setOriginal] = useState<AddressData>({
    state: "",
    area: "",
    district: "Dhaka",
    postcode: "",
    address: "",
  });

  const fetchAddress = async () => {
    try {
      const { data } = await axios.get("/api/auth/me");
      if (data.success && data.data.shipping) {
        const shipping = data.data.shipping;
        const addr = {
          state: shipping.state || "",
          area: shipping.area || "",
          district: shipping.district || "Dhaka",
          postcode: shipping.postcode || "",
          address: shipping.address || "",
        };
        setAddress(addr);
        setOriginal(addr);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const handleSave = async () => {
    if (!address.district || !address.area || !address.address) {
      return toast.error("Please fill in all required fields");
    }

    setSaving(true);
    try {
      const { data } = await axios.post("/api/auth/update-profile", {
        name: undefined, // fetched from existing
        phoneNumber: undefined,
        shippingAddress: address,
      });

      // Need to send full profile update - fetch user first
      const userRes = await axios.get("/api/auth/me");
      if (userRes.data.success) {
        await axios.post("/api/auth/update-profile", {
          name: userRes.data.data.name,
          phoneNumber: userRes.data.data.phoneNumber,
          shippingAddress: address,
        });
      }

      toast.success("Address updated successfully");
      setOriginal(address);
      setEditing(false);
    } catch (error) {
      const err = error as ApiAxiosError;
      toast.error(err.response?.data?.error || "Failed to update address");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setAddress(original);
    setEditing(false);
  };

  if (loading) return <PageLoader />;

  const hasAddress = original.address || original.district || original.area;

  return (
    <div className="py-10">
      <div className="border rounded-lg shadow bg-white">
        <div className="px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-petzy-coral/10 flex items-center justify-center">
                <FaMapLocationDot className="text-petzy-coral text-lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-petzy-slate">Address Book</h2>
                <p className="text-sm text-gray-500">Manage your shipping address</p>
              </div>
            </div>
            {!editing && (
              <Button
                text="Edit Address"
                icon={<FaPenToSquare />}
                iconAlign="left"
                onClick={() => setEditing(true)}
                className="bg-petzy-coral text-white hover:bg-petzy-coral/90"
              />
            )}
          </div>

          {/* Address Content */}
          {!editing ? (
            hasAddress ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">District</p>
                  <p className="text-petzy-slate font-medium">{original.district || "Not set"}</p>
                </div>
                <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Area / Thana</p>
                  <p className="text-petzy-slate font-medium">{original.area || "Not set"}</p>
                </div>
                <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">State / Division</p>
                  <p className="text-petzy-slate font-medium">{original.state || "Not set"}</p>
                </div>
                <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Postcode</p>
                  <p className="text-petzy-slate font-medium">{original.postcode || "Not set"}</p>
                </div>
                <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Full Address</p>
                  <p className="text-petzy-slate font-medium">{original.address || "Not set"}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <FaMapLocationDot className="mx-auto text-5xl text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">No address saved</h3>
                <p className="text-sm text-gray-400 mb-6">Add your shipping address for faster checkout</p>
                <Button
                  text="Add Address"
                  onClick={() => setEditing(true)}
                  className="bg-petzy-coral text-white hover:bg-petzy-coral/90"
                />
              </div>
            )
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    District <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={address.district}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setAddress({ ...address, district: e.target.value })
                    }
                  >
                    <option value="">Select District</option>
                    {LocationData.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Area / Thana <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={address.area}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAddress({ ...address, area: e.target.value })
                    }
                    placeholder="e.g. Gulshan, Dhanmondi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    State / Division
                  </label>
                  <Input
                    value={address.state}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                    placeholder="e.g. Dhaka Division"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Postcode
                  </label>
                  <Input
                    value={address.postcode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAddress({ ...address, postcode: e.target.value })
                    }
                    placeholder="e.g. 1212"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={address.address}
                  onChange={(e) =>
                    setAddress({ ...address, address: e.target.value })
                  }
                  placeholder="House no, Road no, Area, Landmark..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-petzy-coral/50 focus:ring-2 focus:ring-petzy-coral/20 transition-all text-petzy-slate resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  text="Save Address"
                  icon={<FaFloppyDisk />}
                  iconAlign="left"
                  loading={saving}
                  onClick={handleSave}
                  className="bg-petzy-coral text-white hover:bg-petzy-coral/90"
                />
                <Button
                  text="Cancel"
                  icon={<FaXmark />}
                  iconAlign="left"
                  type="outline"
                  onClick={handleCancel}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
