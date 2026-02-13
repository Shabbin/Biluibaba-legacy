"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { Pencil, User, ShoppingBag, Mail } from "lucide-react";

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

  return (
    <div className="p-5">
      {loading ? (
        <div className="">Fetching Order data...</div>
      ) : (
        <div>
          <div className="flex flex-row items-center gap-5">
            <h2 className="text-2xl">Order ID: {order.orderId}</h2>
            <p>
              {order.paymentStatus == true ? (
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
          <p>{new Date(order.createdAt).toLocaleString()}</p>

          <div className="flex flex-row gap-5">
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
                  </div>
                );
              })}

              <div className="flex items-end text-2xl font-bold py-4">
                <div>
                  Total:{" "}
                  {formatCurrency(
                    order.products
                    .map((product: any) => product.price * product.quantity)
                    .reduce((acc: number, curr: number) => acc + curr, 0)
                  )}
                  BDT
                </div>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
