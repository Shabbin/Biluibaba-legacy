"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "@/src/lib/axiosInstance";

interface OrderProduct {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderId?: string;
  orderNumber?: string;
  createdAt: string;
  products?: OrderProduct[];
  total?: number;
  totalAmount?: number;
}

const Order: React.FC = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async (): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/auth/orders?type=${type || "all"}`);

      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [type]);

  const handleManageOrder = (orderId: string): void => {
    console.log("Manage order:", orderId);
    // Navigation to order details page can be added here
  };

  return (
    <div className="py-10">
      <div className="border rounded-lg shadow bg-white">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold mb-6">My Orders</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading orders...</div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No orders found</div>
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
                          ? new Date(order.createdAt).toLocaleDateString("en-GB")
                          : "N/A"}
                      </td>
                      <td className="py-6 px-2">
                        <div className="flex items-center gap-1">
                          {order.products?.length || 0} Items
                        </div>
                      </td>
                      <td className="py-6 px-2 font-semibold">
                        ৳{order.total || order.totalAmount || "0"}
                      </td>
                      <td className="py-6 px-2 text-right">
                        <button
                          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                          onClick={() => handleManageOrder(order._id)}
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
};

export default Order;
