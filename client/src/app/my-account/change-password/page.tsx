"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FaLock, FaEye, FaEyeSlash, FaShieldHalved } from "react-icons/fa6";

import Button from "@/src/components/ui/button";
import axios from "@/src/lib/axiosInstance";
import type { ApiAxiosError } from "@/src/types";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordRules = [
    { label: "At least 8 characters", valid: newPassword.length >= 8 },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(newPassword) },
    { label: "Contains lowercase letter", valid: /[a-z]/.test(newPassword) },
    { label: "Contains a number", valid: /[0-9]/.test(newPassword) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill in all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords don't match");
    }

    if (newPassword.length < 8) {
      return toast.error("New password must be at least 8 characters");
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });

      if (data.success) {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      const err = error as ApiAxiosError;
      toast.error(err.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10">
      <div className="border rounded-lg shadow bg-white max-w-2xl">
        <div className="px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-petzy-coral/10 flex items-center justify-center">
              <FaShieldHalved className="text-petzy-coral text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-petzy-slate">Change Password</h2>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaLock className="text-sm" />
                </div>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-petzy-coral/50 focus:ring-2 focus:ring-petzy-coral/20 transition-all text-petzy-slate"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaLock className="text-sm" />
                </div>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-petzy-coral/50 focus:ring-2 focus:ring-petzy-coral/20 transition-all text-petzy-slate"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password strength indicators */}
              {newPassword && (
                <div className="mt-3 space-y-1.5">
                  {passwordRules.map((rule, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full ${rule.valid ? "bg-emerald-500" : "bg-gray-300"}`} />
                      <span className={rule.valid ? "text-emerald-600" : "text-gray-400"}>{rule.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaLock className="text-sm" />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-petzy-coral/50 focus:ring-2 focus:ring-petzy-coral/20 transition-all text-petzy-slate"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1.5">Passwords don&apos;t match</p>
              )}
            </div>

            <div className="pt-2">
              <Button
                text="Update Password"
                loading={loading}
                type="submit"
                className="bg-petzy-coral text-white hover:bg-petzy-coral/90 w-full !py-3"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
