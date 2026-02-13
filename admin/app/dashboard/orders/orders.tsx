"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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

import { Pencil, User, ShoppingBag, Mail, Loader2 } from "lucide-react";

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
      console.log(data);
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
        <div className="">Fetching Order data...</div>
      ) : (
        <div>
          <div className="flex md:flex-row flex-col md:items-center items-start gap-5">
            <h2 className="text-2xl">Order ID: {order.orderId}</h2>
            <p>
              {order.paymentStatus === true ? (
                <span className="px-4 py-1 bg-green-100 text-green-900 rounded">
                  Payment Completed
                </span>
              ) : (
                <span className="px-4 py-1 bg-yellow-100 text-yellow-900  rounded">
                  Payment Pending
                </span>
              )}
            </p>
            <p>
              {order.status == "delivered" ? (
                <span className="px-4 py-1 bg-green-100 text-green-900 rounded">
                  Order Completed
                </span>
              ) : order.status === "pending" ? (
                <span className="px-4 py-1 bg-yellow-100 text-yellow-900 rounded">
                  Order Pending
                </span>
              ) : order.status === "cancelled" ? (
                <span className="px-4 py-1 bg-red-100 text-red-900 rounded">
                  Order Cancelled
                </span>
              ) : order.status === "dispatched" ? (
                <span className="px-4 py-1 bg-blue-100 text-blue-900 rounded">
                  Order Dispatched
                </span>
              ) : order.status === "refunded" ? (
                <span className="px-4 py-1 bg-purple-100 text-purple-900 rounded">
                  Order Refunded
                </span>
              ) : (
                <span className="px-4 py-1 bg-gray-100 text-gray-900 rounded">
                  Unknown Status
                </span>
              )}
            </p>
          </div>
          <p className="my-5">{new Date(order.createdAt).toLocaleString()}</p>

          <div className="flex md:flex-row flex-col gap-5">
            <div className="basis-2/3">
              <h2 className="text-xl py-5">Order Summary</h2>

              {order.products.map((product: any) => {
                return (
                  <div
                    key={product.productId}
                    className="border p-5 rounded-xl my-2"
                  >
                    <div className="flex flex-row items-center justify-between">
                      <h3 className="text-lg">{product.name}</h3>
                      <p>{formatCurrency(product.price)} BDT</p>
                    </div>
                    <p className="my-2">Quantity: {product.quantity}</p>
                    <p className="my-2">
                      Total: {formatCurrency(product.price * product.quantity)} BDT
                    </p>
                    <div className="my-2">
                      Vendor: {product.vendor.name} | {product.vendor.email}
                    </div>
                    <div className="my-2">
                      Pickup Address: {product.vendor.address.pickupAddress}
                    </div>
                  </div>
                );
              })}

              <div className="flex items-end text-2xl font-bold py-4">
                <div>Total: {formatCurrency(order.totalAmount)} BDT</div>
              </div>
            </div>
            <div className="basis-1/3 flex flex-col gap-5">
              <div className="border p-5 rounded-xl">
                <div className="flex flex-row items-center justify-between">
                  <h3 className="text-lg">Notes</h3>
                  <Pencil />
                </div>
                <p className="my-2">
                  {order.notes.length > 0 ? order.notes : "No notes"}
                </p>
              </div>

              <div className="border p-5 rounded-xl">
                <h3 className="text-lg">Customer</h3>

                <div className="my-2 flex flex-col gap-2">
                  <div className="flex flex-row items-center gap-2">
                    <User />
                    <p>{order.userId.name}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <ShoppingBag />
                    <p>{order.userId.invoiceIDs.length} previous orders</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Mail />
                    <p>{order.userId.email}</p>
                  </div>
                </div>
              </div>

              <div className="border p-5 rounded-xl">
                <div className="flex flex-row items-center justify-between">
                  <h3 className="text-lg">Shipping Address</h3>
                  <Pencil />
                </div>
                <div className="my-2 flex flex-col gap-2">
                  <div>{order.fullAddress}</div>
                  <div>{order.area}</div>
                  <div>{order.region}</div>
                </div>
              </div>

              <div className="border p-5 rounded-xl">
                <h3 className="text-lg">Update Status</h3>
                <div className="my-4 flex flex-col gap-2">
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

                  <Button className="mt-2" onClick={() => updateOrderStatus()}>
                    {statusLoading && <Loader2 />}
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
