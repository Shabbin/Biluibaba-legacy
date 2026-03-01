"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FaPenToSquare, FaFloppyDisk, FaXmark, FaCamera } from "react-icons/fa6";

import Button from "@/src/components/ui/button";
import { PageLoader } from "@/src/components/ui";
import Input from "@/src/components/ui/input";
import Select from "@/src/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";

import axios from "@/src/lib/axiosInstance";
import LocationData from "./location.data"; // Ensure this import path is correct
import type { User, ApiAxiosError } from "@/src/types";

interface FormData {
  name: string;
  phoneNumber: string;
  state: string;
  area: string;
  district: string;
  postcode: string;
  address: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Edit Modes
  const [editProfile, setEditProfile] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

  // Form States
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phoneNumber: "",
    state: "",
    area: "",
    district: "Dhaka",
    postcode: "",
    address: "",
  });

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/me");
      if (data.success) {
        setUser(data.data);
        setFormData({
          name: data.data.name || "",
          phoneNumber: data.data.phoneNumber || "",
          state: data.data.shipping?.state || "",
          area: data.data.shipping?.area || "",
          district: data.data.shipping?.district || "Dhaka",
          postcode: data.data.shipping?.postcode || "",
          address: data.data.shipping?.address || "",
        });
      }
    } catch (error) {
      console.error(error);
      const axiosError = error as ApiAxiosError;
      toast.error(axiosError.response?.data?.error || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleUpdate = async (section: string) => {
    if (section === "profile") {
       if (!formData.name) return toast.error("Name is required");
       if (!formData.phoneNumber) return toast.error("Phone number is required");
    }
    
    if (section === "address") {
       if (!formData.name) return toast.error("Please set your name in Personal Profile first");
       if (!formData.address || !formData.district || !formData.postcode) {
         return toast.error("Please fill all address fields");
       }
    }

    setUpdateLoading(true);

    try {
      const payload = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        shippingAddress: {
           state: formData.state,
           area: formData.area,
           district: formData.district,
           postcode: formData.postcode,
           address: formData.address
        }
      };

      const { data } = await axios.post("/api/auth/update-profile", payload);

      if (data.success) {
        toast.success("Profile updated successfully!");
        setEditProfile(false);
        setEditAddress(false);
        fetchUser(); // Refresh data
      }
    } catch (error) {
      console.error(error);
      const axiosError = error as ApiAxiosError;
      toast.error(axiosError.response?.data?.error || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      return toast.error("Only JPG, JPEG, and PNG files are allowed");
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("File size must be less than 5MB");
    }

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await axios.post("/api/auth/update-avatar", formData);

      if (data.success) {
        toast.success("Profile picture updated!");
        fetchUser();
      }
    } catch (error) {
      console.error(error);
      const axiosError = error as ApiAxiosError;
      toast.error(axiosError.response?.data?.error || "Failed to upload avatar");
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- Personal Profile Card --- */}
      <div className="bg-white rounded-[2rem] shadow-soft p-8 md:p-10 border border-gray-100">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-2xl font-bold text-petzy-slate">Personal Profile</h2>
          {!editProfile && (
            <button 
              onClick={() => setEditProfile(true)}
              className="text-petzy-coral font-bold hover:bg-petzy-coral/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaPenToSquare /> Edit
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
           {/* Avatar */}
           <div className="shrink-0 relative group">
              <Avatar className="w-32 h-32 rounded-2xl shadow-md">
                <AvatarImage 
                  src={user?.avatar} 
                  alt={user?.name || "Avatar"} 
                  className="object-cover rounded-2xl"
                />
                <AvatarFallback className="bg-gradient-to-br from-petzy-coral to-petzy-coral/70 text-white text-4xl font-bold rounded-2xl">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              >
                {avatarUploading ? (
                  <div className="w-6 h-6 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                ) : (
                  <FaCamera className="text-white text-xl" />
                )}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={handleAvatarUpload}
              />
           </div>

           {/* Details / Form */}
           <div className="flex-grow w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {editProfile ? (
                 <>
                   <div>
                      <label className="block text-sm font-bold text-petzy-slate mb-2">Full Name</label>
                      <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-petzy-slate mb-2">Phone Number</label>
                      <Input value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                   </div>
                   <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-petzy-slate mb-2">Email Address</label>
                      <Input value={user?.email} disabled className="bg-gray-100 cursor-not-allowed opacity-70" />
                   </div>
                   
                   <div className="md:col-span-2 flex gap-3 mt-4">
                      <Button 
                        onClick={() => handleUpdate("profile")} 
                        text={updateLoading ? "Saving..." : "Save Changes"}
                        disabled={updateLoading}
                        icon={<FaFloppyDisk />}
                      />
                      <Button 
                        type="outline" 
                        onClick={() => { setEditProfile(false); fetchUser(); }} 
                        text="Cancel"
                        icon={<FaXmark />}
                      />
                   </div>
                 </>
              ) : (
                 <>
                   <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</span>
                      <p className="text-lg font-medium text-petzy-slate">{user?.name}</p>
                   </div>
                   <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</span>
                      <p className="text-lg font-medium text-petzy-slate">{user?.email}</p>
                   </div>
                   <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</span>
                      <p className="text-lg font-medium text-petzy-slate">{user?.phoneNumber || "N/A"}</p>
                   </div>
                 </>
              )}
           </div>
        </div>
      </div>

      {/* --- Address Book Card --- */}
      <div className="bg-white rounded-[2rem] shadow-soft p-8 md:p-10 border border-gray-100">
        <div className="flex justify-between items-start mb-8">
          <div>
             <h2 className="text-2xl font-bold text-petzy-slate">Address Book</h2>
             <p className="text-sm text-petzy-slate-light mt-1">Default Shipping Address</p>
          </div>
          {!editAddress && (
            <button 
              onClick={() => setEditAddress(true)}
              className="text-petzy-coral font-bold hover:bg-petzy-coral/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaPenToSquare /> Edit
            </button>
          )}
        </div>

        {editAddress ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              <div className="md:col-span-2">
                 <label className="block text-sm font-bold text-petzy-slate mb-2">Address Line</label>
                 <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="House, Road, Block" />
              </div>
              <div>
                 <label className="block text-sm font-bold text-petzy-slate mb-2">Division / State</label>
                 <Input value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-bold text-petzy-slate mb-2">District</label>
                 <Select 
                    data={LocationData.map(l => ({ value: l, text: l }))} 
                    value={formData.district} 
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, district: e.target.value})} 
                 />
              </div>
              <div>
                 <label className="block text-sm font-bold text-petzy-slate mb-2">Area</label>
                 <Input value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-bold text-petzy-slate mb-2">Postcode</label>
                 <Input value={formData.postcode} onChange={(e) => setFormData({...formData, postcode: e.target.value})} />
              </div>

              <div className="md:col-span-2 flex gap-3 mt-4">
                  <Button 
                    onClick={() => handleUpdate("address")} 
                    text={updateLoading ? "Saving..." : "Save Address"}
                    disabled={updateLoading}
                    icon={<FaFloppyDisk />}
                  />
                  <Button 
                    type="outline" 
                    onClick={() => { setEditAddress(false); fetchUser(); }} 
                    text="Cancel"
                    icon={<FaXmark />}
                  />
               </div>
           </div>
        ) : (
           <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              {user?.shipping ? (
                 <div className="space-y-2">
                    <p className="font-bold text-lg text-petzy-slate">{user.name}</p>
                    <p className="text-petzy-slate-light">{user.shipping.address}</p>
                    <p className="text-petzy-slate-light">
                       {user.shipping.area}, {user.shipping.district} - {user.shipping.postcode}
                    </p>
                    <p className="text-petzy-slate-light">{user.shipping.state}</p>
                    <div className="pt-2 mt-2 border-t border-gray-200 inline-block text-sm font-bold text-petzy-coral bg-petzy-coral/10 px-3 py-1 rounded-full">
                       {user.phoneNumber}
                    </div>
                 </div>
              ) : (
                 <div className="text-center py-8 text-gray-400">
                    <p>No shipping address set.</p>
                    <button onClick={() => setEditAddress(true)} className="text-petzy-coral font-bold hover:underline mt-2">Add Address</button>
                 </div>
              )}
           </div>
        )}

      </div>
    </div>
  );
}