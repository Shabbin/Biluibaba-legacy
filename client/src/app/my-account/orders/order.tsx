"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "@/src/lib/axiosInstance";
import { OrderSkeleton, NoOrders } from "@/src/components/ui";
import { formatCurrency } from "@/src/lib/currency";

export default function Order() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/auth/orders?type=${type || "all"}`
      );

      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [type]);

  return (
    <div className="py-10">
      <div className="border rounded-lg shadow bg-white">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold mb-6">My Orders</h2>

          {loading ? (
            <div className="space-y-4">
              <OrderSkeleton />
              <OrderSkeleton />
              <OrderSkeleton />
            </div>
          ) : orders.length === 0 ? (
            <NoOrders />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-2 font-medium text-gray-700">
                      Order no
                    </th>
                    <th className="text-left py-4 px-2 font-medium text-gray-700">
                      Placed on
                    </th>
                    <th className="text-left py-4 px-2 font-medium text-gray-700">
                      Items
                    </th>
                    <th className="text-left py-4 px-2 font-medium text-gray-700">
                      Total
                    </th>
                    <th className="text-right py-4 px-2 font-medium text-gray-700"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order._id || index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-6 px-2 font-medium">
                        {order.orderNumber || order.orderId}
                      </td>
                      <td className="py-6 px-2 text-gray-600">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-GB"
                            )
                          : "N/A"}
                      </td>
                      <td className="py-6 px-2">
                        <div className="flex items-center gap-1">
                          {order.products?.length} Items
                        </div>
                      </td>
                      <td className="py-6 px-2 font-semibold">
                        ৳{formatCurrency(order.total || order.totalAmount || 0)}
                      </td>
                      <td className="py-6 px-2 text-right">
                        <button
                          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            // Handle manage order action
                            console.log("Manage order:", order._id);
                            // You can add navigation to order details page here
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
