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
  const [products, setProducts] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  const fetchProducts = async (pageCount = 1) => {
    try {
      const { data } = await axios.get(
        `/api/vendor/products?count=${pageCount}&type=published`
      );
      if (data.success) {
        setProducts(data.products);
        setTotalProducts(data.totalProducts);

        const calculatedTotalPages = Math.ceil(
          data.totalProducts / itemsPerPage
        );

        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        setCount(pageCount);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong while fetching products",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts(page - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchProducts(count);
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-4xl">Published Products</h2>

      {products.length > 0 ? (
        <Table>
          <TableCaption>A list of all your published products</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID #</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Product Status</TableHead>
              <TableHead>Product Rating</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: any) => (
              <TableRow key={product.productId}>
                <TableCell>{product.productId}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {product.status == true ? (
                    <span className="px-4 py-1 bg-green-100 text-green-900 font-bold rounded">
                      Published
                    </span>
                  ) : (
                    <span className="px-4 py-1 bg-yellow-100 text-yellow-900 font-bold rounded">
                      Pending
                    </span>
                  )}
                </TableCell>
                <TableCell>{product.ratings}</TableCell>
                <TableCell>
                  {new Date(product.createdAt).toLocaleString("en-US", {
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
                    href={`/dashboard/products/view?id=${product.productId}`}
                    className={buttonVariants({ variant: "default" })}
                  >
                    View Product
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="font-bold text-gray-700 text-center py-5">
          No published products found.
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
    </div>
  );
}
