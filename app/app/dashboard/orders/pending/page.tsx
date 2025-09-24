"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";

import axios from "@/lib/axios";

export default function Page() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        "/api/vendor/orders?count=0&type=pending"
      );
      setOrders(data.orders.orderIDs);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong while fetching orders",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-4xl">Pending Orders</h2>

      {orders.length > 0 && (
        <Table>
          <TableCaption>A list of pending orders</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID #</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>
                  {" "}
                  {order.status == true ? (
                    <span className="px-4 py-1 bg-green-100 text-green-900 font-bold rounded">
                      Completed
                    </span>
                  ) : (
                    <span className="px-4 py-1 bg-yellow-100 text-yellow-900 font-bold rounded">
                      Pending
                    </span>
                  )}
                </TableCell>
                <TableCell>{order.totalAmount} BDT</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/orders?orderID=${order.orderId}`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    View Order
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
