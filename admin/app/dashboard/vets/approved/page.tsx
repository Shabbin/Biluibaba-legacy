"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Stethoscope } from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Page() {
  const [vets, setVets] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalVets, setTotalVets] = useState<number>(0);

  const fetchVets = async (pageCount = 0) => {
    try {
      const { data } = await axios.get(
        `/api/admin/vets?count=${pageCount}&status=approved`
      );

      if (data.success) {
        setVets(data.vets);
        setTotalVets(data.totalVets);

        const calculatedTotalPages = Math.ceil(data.totalVets / itemsPerPage);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        setCount(pageCount);
      }
    } catch (error) {
      toast({
        title: "Error fetching vets",
        description: "There was an error fetching the approved vets.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchVets(page - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchVets(count);
  }, []);

  return (
    <>
      <div className="page-header">
        <h2>Approved Vets</h2>
        <p>All approved veterinarian accounts on the platform</p>
        <div className="header-accent" />
      </div>

      {vets.length > 0 ? (
        <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
          <Table>
            <TableCaption>A list of all approved veterinarians</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Vet</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vets.map((vet: any) => (
                <TableRow key={vet._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 ring-2 ring-primary/10">
                        <AvatarImage src={vet.profilePicture} alt={vet.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#FF8A80] to-[#FF6B61] text-white text-xs font-bold">
                          {vet.name?.charAt(0)?.toUpperCase() || "V"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium text-sm">{vet.name}</span>
                        {vet.degree && (
                          <p className="text-xs text-muted-foreground">{vet.degree}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{vet.email}</TableCell>
                  <TableCell className="text-sm">{vet.phoneNumber}</TableCell>
                  <TableCell className="text-sm">{vet.hospital || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{vet.ratings?.toFixed(1) || "0.0"}</span>
                      <span className="text-xs text-muted-foreground">({vet.totalReviews || 0})</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(vet.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/vets/view?id=${vet._id}`}
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
            <Stethoscope />
          </div>
          <h3>No vets found</h3>
          <p>There are no approved veterinarians on the platform yet.</p>
        </div>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(1)}
              isActive={currentPage === 1}
              className="cursor-pointer"
            >
              1
            </PaginationLink>
          </PaginationItem>

          {currentPage > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {Array.from({ length: totalPages })
            .slice(1, totalPages)
            .map((_, index) => {
              const pageNumber = index + 2;
              if (
                pageNumber === currentPage ||
                pageNumber === currentPage - 1 ||
                pageNumber === currentPage + 1
              ) {
                if (pageNumber === 1 || pageNumber === totalPages) return null;
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

          {currentPage < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

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
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
