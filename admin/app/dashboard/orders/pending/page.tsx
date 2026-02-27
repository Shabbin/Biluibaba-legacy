"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import axios from "@/lib/axios";
import { formatCurrency } from "@/lib/currency";

export default function Page() {
  const [orders, setOrders] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalOrders, setTotalOrders] = useState<number>(0);

  const fetchOrders = async (pageCount = 0) => {
    try {
      const { data } = await axios.get(
        `/api/admin/orders?count=${pageCount}&type=pending`
      );

      if (data.success) {
        setOrders(data.orders);
        setTotalOrders(data.totalOrders);

        const calculatedTotalPages = Math.ceil(data.totalOrders / itemsPerPage);

        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        setCount(pageCount);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong while fetching orders",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchOrders(page - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchOrders(count);
  }, []);

  return (
    <>
      <div className="page-header">
        <h2>Pending Orders</h2>
        <p>Orders awaiting processing or fulfillment</p>
        <div className="header-accent" />
      </div>

      {orders.length > 0 ? (
        <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
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
                  {order.status == "delivered" ? (
                    <span className="status-badge status-badge--success">
                      Order Completed
                    </span>
                  ) : order.status === "pending" ? (
                    <span className="status-badge status-badge--warning">
                      Order Pending
                    </span>
                  ) : order.status === "cancelled" ? (
                    <span className="status-badge status-badge--danger">
                      Order Cancelled
                    </span>
                  ) : order.status === "dispatched" ? (
                    <span className="status-badge status-badge--info">
                      Order Dispatched
                    </span>
                  ) : order.status === "refunded" ? (
                    <span className="status-badge status-badge--purple">
                      Order Refunded
                    </span>
                  ) : (
                    <span className="status-badge status-badge--neutral">
                      Unknown Status
                    </span>
                  )}
                </TableCell>
                <TableCell>{formatCurrency(order.totalAmount)} BDT</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/orders?orderID=${order.orderId}`}
                    className={buttonVariants({ variant: "outline" }) + " rounded-lg"}
                  >
                    View Order
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      ) : (
        <div className="empty-state">
          <ShoppingCart className="empty-state-icon" />
          <h3>No pending orders</h3>
          <p>There are no pending orders to display at this time.</p>
        </div>
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {/* First page always shown */}
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(1)}
              isActive={currentPage === 1}
              className="cursor-pointer"
            >
              1
            </PaginationLink>
          </PaginationItem>

          {/* Show ellipsis if current page is > 3 */}
          {currentPage > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Show pages around current page */}
          {Array.from({ length: totalPages })
            .slice(1, totalPages)
            .map((_, index) => {
              const pageNumber = index + 2; // +2 because index starts at 0 and we're starting from page 2

              // Show current page and one before/after
              if (
                pageNumber === currentPage ||
                pageNumber === currentPage - 1 ||
                pageNumber === currentPage + 1
              ) {
                // Don't show page 1 again (it's always shown above)
                if (pageNumber === 1) return null;

                // Don't show last page here (it will be shown separately)
                if (pageNumber === totalPages) return null;

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}

          {/* Show ellipsis if needed */}
          {currentPage < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Last page always shown if there's more than 1 page */}
          {totalPages > 1 && (
            <PaginationItem>
              <PaginationLink
                onClick={() => handlePageChange(totalPages)}
                isActive={currentPage === totalPages}
                className="cursor-pointer"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
