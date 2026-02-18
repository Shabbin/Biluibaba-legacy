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
import { formatCurrency } from "@/lib/currency";

export default function Page() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/vendor/orders?count=0&type=all");
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
    <div className="space-y-6">
      <div className="page-header">
        <h2>All Orders</h2>
        <p>Complete history of all your orders</p>
        <div className="header-accent" />
      </div>

      {orders.length > 0 ? (
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <Table>
            <TableCaption className="py-4 text-muted-foreground">
              {orders.length} total orders
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Order ID</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Payment</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="text-right font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderId} className="group">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {order.orderId}
                  </TableCell>
                  <TableCell>
                    {order.status == "delivered" ? (
                      <span className="status-badge status-badge--success">Completed</span>
                    ) : order.status === "pending" ? (
                      <span className="status-badge status-badge--warning">Pending</span>
                    ) : order.status === "cancelled" ? (
                      <span className="status-badge status-badge--danger">Cancelled</span>
                    ) : order.status === "dispatched" ? (
                      <span className="status-badge status-badge--info">Dispatched</span>
                    ) : order.status === "refunded" ? (
                      <span className="status-badge status-badge--purple">Refunded</span>
                    ) : (
                      <span className="status-badge status-badge--neutral">{order.status}</span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(order.totalAmount)} BDT</TableCell>
                  <TableCell className="text-sm capitalize">{order.paymentMethod}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/dashboard/orders?orderID=${order.orderId}`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
          </div>
          <h3>No orders yet</h3>
          <p>Orders will appear here once customers start purchasing your products.</p>
        </div>
      )}
    </div>
  );
}
