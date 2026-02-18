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
    <div className="space-y-6">
      <div className="page-header">
        <h2>Pending Orders</h2>
        <p>Orders waiting for your action</p>
        <div className="header-accent" />
      </div>

      {orders.length > 0 ? (
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <Table>
            <TableCaption className="py-4 text-muted-foreground">
              {orders.length} pending order{orders.length !== 1 ? "s" : ""}
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
                    {order.status == true ? (
                      <span className="status-badge status-badge--success">Completed</span>
                    ) : (
                      <span className="status-badge status-badge--warning">Pending</span>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          </div>
          <h3>All caught up!</h3>
          <p>No pending orders at the moment. New orders will appear here.</p>
        </div>
      )}
    </div>
  );
}
