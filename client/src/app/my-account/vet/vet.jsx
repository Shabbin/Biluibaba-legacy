"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "@/src/lib/axiosInstance";

export default function VetBookings() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/auth/vet?type=${type || "all"}`);

      if (data.success) setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [type]);

  return (
    <div className="py-10">
      <div className="border rounded-lg shadow bg-white">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading bookings...</div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No bookings found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-2 font-medium text-gray-500">
                      Booking no
                    </th>
                    <th className="text-left py-4 px-2 font-medium text-gray-500">
                      Services
                    </th>
                    <th className="text-left py-4 px-2 font-medium text-gray-500">
                      Items
                    </th>
                    <th className="text-left py-4 px-2 font-medium text-gray-500">
                      Placed on
                    </th>
                    <th className="text-left py-4 px-2 font-medium text-gray-500">
                      Total
                    </th>
                    <th className="text-right py-4 px-2 font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr
                      key={booking._id || index}
                      className="border-b border-gray-100"
                    >
                      <td className="py-6 px-2 font-medium">
                        {booking.bookingNumber || booking.id || "10253"}
                      </td>
                      <td className="py-6 px-2">
                        <div className="font-medium text-gray-900">
                          {booking.serviceType || "Vet Online"}
                        </div>
                      </td>
                      <td className="py-6 px-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={booking.vet.profilePicture}
                            alt={booking.vet.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-gray-700">
                            {booking.vet.name || "Dr Billu"}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-2 text-gray-600">
                        {booking.createdAt
                          ? new Date(booking.createdAt).toLocaleDateString(
                              "en-GB"
                            )
                          : "17/04/2024"}
                      </td>
                      <td className="py-6 px-2 font-semibold">
                        ৳{booking.total || booking.amount || "500"}
                      </td>
                      <td className="py-6 px-2 text-right">
                        <button
                          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            // Handle manage booking action
                            console.log("Manage booking:", booking._id);
                            // You can add navigation to booking details page here
                          }}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
