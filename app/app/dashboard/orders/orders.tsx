"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  Pencil,
  User,
  ShoppingBag,
  Mail,
  ArrowLeft,
  MapPin,
  Loader2,
  StickyNote,
  Package,
  Calendar,
} from "lucide-react";

import { toast } from "@/hooks/use-toast";

import axios from "@/lib/axios";
import { formatCurrency } from "@/lib/currency";

export default function Order() {
  const search = useSearchParams();
  const orderID = search.get("orderID");

  const [order, setOrder] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/vendor/order/${orderID}`);

      setOrder(data.order);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong while fetching order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-[#FF8A80]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <Link
            href="/dashboard/orders/all"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full bg-[#FF8A80]" />
              <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
            </div>
            <span className="font-mono text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {order.orderId}
            </span>
            {order.paymentStatus == true ? (
              <span className="status-badge--success">Paid</span>
            ) : (
              <span className="status-badge--warning">Payment Pending</span>
            )}
            {order.status == "delivered" ? (
              <span className="status-badge--success">Delivered</span>
            ) : order.status === "pending" ? (
              <span className="status-badge--warning">Pending</span>
            ) : order.status === "cancelled" ? (
              <span className="status-badge--danger">Cancelled</span>
            ) : order.status === "dispatched" ? (
              <span className="status-badge--info">Dispatched</span>
            ) : order.status === "refunded" ? (
              <span className="status-badge--purple">Refunded</span>
            ) : (
              <span className="status-badge--default">{order.status}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 ml-5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary — Left Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-[#FF8A80]" />
              <h2 className="text-lg font-semibold">Order Items</h2>
            </div>

            <div className="space-y-3">
              {order.products.map((product: any) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40"
                >
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Qty: {product.quantity} × {formatCurrency(product.price)} BDT
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(product.price * product.quantity)} BDT
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-border/60">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-[#FF6B61]">
                  {formatCurrency(
                    order.products
                      .map((product: any) => product.price * product.quantity)
                      .reduce((acc: number, curr: number) => acc + curr, 0)
                  )}{" "}
                  BDT
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar — Right Column */}
        <div className="space-y-4">
          {/* Notes */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Notes</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {order.notes.length > 0 ? order.notes : "No notes added"}
            </p>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
            <h3 className="font-semibold mb-3">Customer</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FF8A80]/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-[#FF8A80]" />
                </div>
                <p className="text-sm font-medium">{order.userId.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">{order.userId.invoiceIDs.length} previous orders</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground break-all">{order.userId.email}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Shipping Address</h3>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{order.fullAddress}</p>
              <p>{order.area}</p>
              <p className="font-medium text-foreground">{order.region}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
