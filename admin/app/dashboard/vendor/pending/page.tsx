"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

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

export default function Page() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalVendors, setTotalVendors] = useState<number>(0);

  const fetchVendors = async (pageCount = 0) => {
    try {
      const { data } = await axios.get(
        `/api/admin/vendors?count=${pageCount}&status=pending`
      );

      if (data.success) {
        setVendors(data.vendors);
        setTotalVendors(data.totalVendors);

        const calculatedTotalPages = Math.ceil(
          data.totalVendors / itemsPerPage
        );

        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        setCount(pageCount);
      }
    } catch (error) {
      toast({
        title: "Error fetching vendors",
        description: "There was an error fetching the pending vendors.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchVendors(page - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchVendors(count);
  }, [count]);

  return (
    <>
      <div className="page-header">
        <h2>Pending Vendors</h2>
        <p>Vendor accounts awaiting approval</p>
        <div className="header-accent" />
      </div>

      {vendors.length > 0 ? (
        <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
          <Table>
            <TableCaption>A list of all your pending vendors</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor ID #</TableHead>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Vendor Status</TableHead>
                <TableHead>Vendor Number</TableHead>
                <TableHead>Vendor Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor: any) => (
                <TableRow key={vendor._id}>
                  <TableCell>{vendor._id}</TableCell>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>
                    {vendor.status === "approved" ? (
                      <span className="status-badge status-badge--success">
                        Approved
                      </span>
                    ) : (
                      <span className="status-badge status-badge--warning">
                        Pending
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{vendor.phoneNumber}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>
                    {new Date(vendor.createdAt).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/vendor/view?id=${vendor._id}`}
                      className={buttonVariants({ variant: "outline" }) + " rounded-lg"}
                    >
                      View Profile
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
            <ShoppingBag />
          </div>
          <h3>No vendors found</h3>
          <p>There are no pending vendor applications at this time.</p>
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
