"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { Pencil, User, ShoppingBag, Mail, Loader2, MapPin } from "lucide-react";

import { toast } from "@/hooks/use-toast";

import axios from "@/lib/axios";
import { formatCurrency } from "@/lib/currency";

export default function Order() {
  const search = useSearchParams();
  const orderID = search.get("orderID");

  const [order, setOrder] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  const updateOrderStatus = async () => {
    setStatusLoading(true);
    if (status === "") {
      toast({
        title: "Error",
        description: "Please select a status to update",
        variant: "destructive",
      });
      return setStatusLoading(false);
    }
    try {
      const { data } = await axios.post(`/api/admin/orders/status/`, {
        status: status,
        id: order.orderId,
      });

      setOrder(data.order);
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong while updating order status",
        variant: "destructive",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/admin/orders/${orderID}`);

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

  return (
    <div className="p-5">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          <div className="page-header">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight">Order Details</h2>
              <p className="text-sm text-muted-foreground">
                Order #{order.orderId} · {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {order.paymentStatus === true ? (
                <span className="status-badge status-badge-approved">
                  Payment Completed
                </span>
              ) : (
                <span className="status-badge status-badge-pending">
                  Payment Pending
                </span>
              )}
              {order.status === "delivered" ? (
                <span className="status-badge status-badge-approved">
                  Order Completed
                </span>
              ) : order.status === "pending" ? (
                <span className="status-badge status-badge-pending">
                  Order Pending
                </span>
              ) : order.status === "cancelled" ? (
                <span className="status-badge status-badge-rejected">
                  Order Cancelled
                </span>
              ) : order.status === "dispatched" ? (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700">
                  Order Dispatched
                </span>
              ) : order.status === "refunded" ? (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-purple-50 text-purple-700">
                  Order Refunded
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700">
                  Unknown Status
                </span>
              )}
            </div>
          </div>

          <div className="flex md:flex-row flex-col gap-6 mt-6">
            <div className="basis-2/3 flex flex-col gap-4">
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-semibold">Order Summary</h3>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {order.products.map((product: any) => {
                    return (
                      <div
                        key={product.productId}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex flex-row items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Qty: {product.quantity} × {formatCurrency(product.price)} BDT
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Vendor: {product.vendor.name} · {product.vendor.email}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Pickup: {product.vendor.address.pickupAddress}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold">
                              {formatCurrency(product.price * product.quantity)} BDT
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border bg-primary/5 p-4 flex items-center justify-between">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(order.totalAmount)} BDT
                </span>
              </div>
            </div>

            <div className="basis-1/3 flex flex-col gap-4">
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Notes</h3>
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {order.notes.length > 0 ? order.notes : "No notes"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-sm font-semibold">Customer</h3>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex flex-row items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{order.userId.name}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{order.userId.invoiceIDs.length} previous orders</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{order.userId.email}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Shipping Address</h3>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="p-4 flex flex-col gap-1">
                  <p className="text-sm">{order.fullAddress}</p>
                  <p className="text-sm text-muted-foreground">{order.area}</p>
                  <p className="text-sm text-muted-foreground">{order.region}</p>
                </div>
              </div>

              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-sm font-semibold">Update Status</h3>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="pending">Order Pending</SelectItem>
                        <SelectItem value="dispatched">
                          Order Dispatched
                        </SelectItem>
                        <SelectItem value="delivered">
                          Successfully delivered
                        </SelectItem>
                        <SelectItem value="cancelled">
                          Order Cancelled
                        </SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Button className="mt-1" onClick={() => updateOrderStatus()}>
                    {statusLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Update Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
