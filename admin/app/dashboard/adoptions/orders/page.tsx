"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import axios from "@/lib/axios";
import { formatDate } from "@/lib/time";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableCaption,
  TableHeader,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Loader2 } from "lucide-react";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalOrders, setTotalOrders] = useState<number>(0);

  const fetchOrders = async (pageCount = 0) => {
    try {
      const { data } = await axios.get(
        `/api/admin/adoptions/order?count=${pageCount}`
      );

      if (data.success) {
        console.log(data);
        setOrders(data.orders);
        setTotalOrders(data.totalOrders);

        const calculatedTotalPages = Math.ceil(data.totalOrders / itemsPerPage);

        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        setCount(pageCount);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching adoptions orders",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchOrders(page - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders(count); // Start with first page (count=0)
  }, []);

  return (
    <div className="py-5">
      <h2 className="text-4xl">Adoption Orders</h2>

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          <Table className="my-5">
            <TableCaption>List of all adoption orders</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Pet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created by</TableHead>
                <TableHead>Created on</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell className="flex flex-row items-center gap-2">
                    <img
                      src={order.adoptionId.images[0].path}
                      className="w-8 h-8 rounded-full"
                      alt={order.adoptionId.name}
                    />
                    <div>{order.adoptionId.name}</div>
                  </TableCell>
                  <TableCell>
                    {order.status === "Pending" ? (
                      <span className="px-4 py-1 bg-yellow-100 text-yellow-900 font-bold rounded">
                        Pending
                      </span>
                    ) : order.status === "Accepted" ? (
                      <span className="px-4 py-1 bg-green-100 text-green-900 font-bold rounded">
                        Accepted
                      </span>
                    ) : (
                      <span className="px-4 py-1 bg-red-100 text-red-900 font-bold rounded">
                        Rejected
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="flex flex-row items-center gap-2">
                    <img
                      src={order.userId.avatar}
                      className="w-8 h-8 rounded-full"
                      alt={order.userId.name}
                    />
                    <div>{order.userId.name}</div>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Button asChild>
                      <Link
                        href={`/dashboard/adoptions/orders/view?id=${order.orderId}`}
                      >
                        View Order
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
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
      )}
    </div>
  );
}
