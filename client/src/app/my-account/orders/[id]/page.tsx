"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaBox,
  FaTruck,
  FaCircleCheck,
  FaBan,
  FaRotateLeft,
  FaClock,
  FaCopy,
} from "react-icons/fa6";

import Button from "@/src/components/ui/button";
import { PageLoader } from "@/src/components/ui";
import axios from "@/src/lib/axiosInstance";
import { formatCurrency } from "@/src/lib/currency";
import type { ApiAxiosError } from "@/src/types";

interface OrderProduct {
  id: {
    _id: string;
    name: string;
    slug: string;
    images: { filename: string; path: string }[];
  } | string;
  name: string;
  quantity: number;
  price: number;
  vendor: string;
}

interface OrderDetail {
  _id: string;
  orderId: string;
  status: string;
  products: OrderProduct[];
  paymentMethod: string;
  paymentStatus: boolean;
  totalAmount: number;
  shippingCost: number;
  name: string;
  phoneNumber: string;
  region: string;
  area: string;
  fullAddress: string;
  notes: string;
  deliveryStatus: string;
  deliveryTrackingCode: string;
  cancellationReason: string;
  returnReason: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  pending: { label: "Pending", icon: <FaClock />, color: "text-amber-600", bg: "bg-amber-50" },
  dispatched: { label: "Dispatched", icon: <FaTruck />, color: "text-blue-600", bg: "bg-blue-50" },
  delivered: { label: "Delivered", icon: <FaCircleCheck />, color: "text-emerald-600", bg: "bg-emerald-50" },
  cancelled: { label: "Cancelled", icon: <FaBan />, color: "text-red-600", bg: "bg-red-50" },
  returned: { label: "Return Requested", icon: <FaRotateLeft />, color: "text-purple-600", bg: "bg-purple-50" },
  refunded: { label: "Refunded", icon: <FaRotateLeft />, color: "text-purple-600", bg: "bg-purple-50" },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [showReturnReason, setShowReturnReason] = useState(false);
  const [reason, setReason] = useState("");

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/order/${orderId}`);
      if (data.success) setOrder(data.order);
    } catch (error) {
      const err = error as ApiAxiosError;
      toast.error(err.response?.data?.error || "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleCancel = async () => {
    if (!reason.trim()) return toast.error("Please provide a reason for cancellation");
    setCancelLoading(true);
    try {
      const { data } = await axios.post("/api/order/cancel", {
        orderId: order?.orderId,
        reason,
      });
      if (data.success) {
        toast.success("Order cancelled successfully");
        setShowCancelReason(false);
        setReason("");
        fetchOrder(); // Refresh
      }
    } catch (error) {
      const err = error as ApiAxiosError;
      toast.error(err.response?.data?.error || "Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!reason.trim()) return toast.error("Please provide a reason for return");
    setReturnLoading(true);
    try {
      const { data } = await axios.post("/api/order/return", {
        orderId: order?.orderId,
        reason,
      });
      if (data.success) {
        toast.success("Return request submitted");
        setShowReturnReason(false);
        setReason("");
        fetchOrder();
      }
    } catch (error) {
      const err = error as ApiAxiosError;
      toast.error(err.response?.data?.error || "Failed to submit return request");
    } finally {
      setReturnLoading(false);
    }
  };

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderId);
      toast.success("Order ID copied!");
    }
  };

  if (loading) return <PageLoader />;

  if (!order) {
    return (
      <div className="py-10">
        <div className="text-center py-20">
          <FaBox className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Order not found</h3>
          <p className="text-sm text-gray-400 mb-6">This order doesn&apos;t exist or you don&apos;t have access.</p>
          <Link href="/my-account/orders?type=all">
            <Button text="View All Orders" className="bg-petzy-coral text-white" />
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;

  return (
    <div className="py-10">
      {/* Back Button */}
      <button
        onClick={() => router.push("/my-account/orders?type=all")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-petzy-coral mb-6 transition-colors"
      >
        <FaArrowLeft className="text-xs" /> Back to Orders
      </button>

      {/* Order Header */}
      <div className="border rounded-lg shadow bg-white mb-6">
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-petzy-slate">Order #{order.orderId}</h2>
                <button onClick={copyOrderId} className="text-gray-400 hover:text-petzy-coral transition-colors">
                  <FaCopy className="text-sm" />
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bg} ${status.color} font-semibold text-sm`}>
              {status.icon}
              {status.label}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products */}
        <div className="lg:col-span-2 border rounded-lg shadow bg-white">
          <div className="px-6 py-6">
            <h3 className="text-lg font-bold text-petzy-slate mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.products.map((product, index) => {
                const productData = typeof product.id === "object" ? product.id : null;
                const imageUrl = productData?.images?.[0]?.path;

                return (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                        <FaBox className="text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {productData?.slug ? (
                        <Link href={`/products/${productData.slug}`} className="font-medium text-petzy-slate hover:text-petzy-coral transition-colors line-clamp-1">
                          {product.name}
                        </Link>
                      ) : (
                        <p className="font-medium text-petzy-slate line-clamp-1">{product.name}</p>
                      )}
                      <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                    </div>
                    <p className="font-semibold text-petzy-slate whitespace-nowrap">
                      ৳{formatCurrency(product.price * product.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-petzy-slate">৳{formatCurrency(order.totalAmount - order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-petzy-slate">৳{formatCurrency(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                <span className="text-petzy-slate">Total</span>
                <span className="text-petzy-coral">৳{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Shipping Info */}
          <div className="border rounded-lg shadow bg-white">
            <div className="px-6 py-6">
              <h3 className="text-lg font-bold text-petzy-slate mb-4">Shipping Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Name</p>
                  <p className="text-petzy-slate font-medium">{order.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Phone</p>
                  <p className="text-petzy-slate font-medium">{order.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Address</p>
                  <p className="text-petzy-slate font-medium">{order.fullAddress}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Region</p>
                  <p className="text-petzy-slate font-medium">{order.region}, {order.area}</p>
                </div>
                {order.notes && (
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Notes</p>
                    <p className="text-petzy-slate font-medium">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border rounded-lg shadow bg-white">
            <div className="px-6 py-6">
              <h3 className="text-lg font-bold text-petzy-slate mb-4">Payment</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-petzy-slate">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-semibold ${order.paymentStatus ? "text-emerald-600" : "text-amber-600"}`}>
                    {order.paymentStatus ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Info */}
          {order.deliveryTrackingCode && (
            <div className="border rounded-lg shadow bg-white">
              <div className="px-6 py-6">
                <h3 className="text-lg font-bold text-petzy-slate mb-4">Delivery Tracking</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Tracking Code</p>
                    <p className="text-petzy-coral font-mono font-medium">{order.deliveryTrackingCode}</p>
                  </div>
                  {order.deliveryStatus && (
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Status</p>
                      <p className="text-petzy-slate font-medium capitalize">{order.deliveryStatus}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Cancellation/Return Reason */}
          {(order.cancellationReason || order.returnReason) && (
            <div className="border rounded-lg shadow bg-white">
              <div className="px-6 py-6">
                <h3 className="text-lg font-bold text-petzy-slate mb-4">
                  {order.cancellationReason ? "Cancellation Reason" : "Return Reason"}
                </h3>
                <p className="text-sm text-gray-600">
                  {order.cancellationReason || order.returnReason}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          {(order.status === "pending" || order.status === "delivered") && (
            <div className="border rounded-lg shadow bg-white">
              <div className="px-6 py-6">
                <h3 className="text-lg font-bold text-petzy-slate mb-4">Actions</h3>

                {order.status === "pending" && !showCancelReason && (
                  <Button
                    text="Cancel Order"
                    icon={<FaBan />}
                    iconAlign="left"
                    type="custom"
                    onClick={() => setShowCancelReason(true)}
                    className="w-full !justify-start !rounded-xl text-red-600 bg-red-50 hover:bg-red-100 !py-3 !text-sm"
                  />
                )}

                {order.status === "delivered" && !showReturnReason && (
                  <Button
                    text="Request Return"
                    icon={<FaRotateLeft />}
                    iconAlign="left"
                    type="custom"
                    onClick={() => setShowReturnReason(true)}
                    className="w-full !justify-start !rounded-xl text-purple-600 bg-purple-50 hover:bg-purple-100 !py-3 !text-sm"
                  />
                )}

                {(showCancelReason || showReturnReason) && (
                  <div className="space-y-3 mt-3">
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder={showCancelReason ? "Why are you cancelling this order?" : "Why are you returning this order?"}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-petzy-coral/50 focus:ring-2 focus:ring-petzy-coral/20 transition-all text-petzy-slate text-sm resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        text="Submit"
                        loading={cancelLoading || returnLoading}
                        onClick={showCancelReason ? handleCancel : handleReturn}
                        className="bg-petzy-coral text-white hover:bg-petzy-coral/90 flex-1"
                        size="sm"
                      />
                      <Button
                        text="Cancel"
                        type="outline"
                        size="sm"
                        onClick={() => {
                          setShowCancelReason(false);
                          setShowReturnReason(false);
                          setReason("");
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
