"use client";

import { useState } from "react";
import { FaBell, FaBellSlash, FaCheck, FaTrash } from "react-icons/fa6";
import Button from "@/src/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "promo" | "system";
  read: boolean;
  date: string;
}

export default function NotificationsPage() {
  // Notifications will be populated from API when backend supports it
  // For now, show a clean empty state with the explanation
  const [notifications] = useState<Notification[]>([]);

  return (
    <div className="py-10">
      <div className="border rounded-lg shadow bg-white">
        <div className="px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-petzy-coral/10 flex items-center justify-center">
                <FaBell className="text-petzy-coral text-lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-petzy-slate">Notifications</h2>
                <p className="text-sm text-gray-500">Stay updated with your orders and deals</p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
                <FaBellSlash className="text-4xl text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">No notifications yet</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                When you receive order updates, promotional offers, or important announcements, they&apos;ll appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border transition-all ${
                    notification.read
                      ? "border-gray-100 bg-white"
                      : "border-petzy-coral/20 bg-petzy-coral/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-petzy-coral flex-shrink-0" />
                        )}
                        <h4 className="font-semibold text-petzy-slate text-sm">
                          {notification.title}
                        </h4>
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                          notification.type === "order"
                            ? "bg-blue-50 text-blue-600"
                            : notification.type === "promo"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {notification.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
