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
  const [appointments, setAppointments] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalAppointments, setTotalAppointments] = useState<number>(0);

  const fetchAppointments = async (pageCount = 0) => {
    try {
      const { data } = await axios.get(
        `/api/vet/appointments?count=${pageCount}&type=cancelled`
      );

      if (data.success) {
        setAppointments(data.appointments);
        setTotalAppointments(data.totalAppointments);

        const calculatedTotalPages = Math.ceil(
          data.totalAppointments / itemsPerPage
        );

        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        setCount(0);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong while fetching appointments",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAppointments(page - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchAppointments(count);
  }, []);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h2>Cancelled Appointments</h2>
        <p>Appointments that have been cancelled</p>
        <div className="header-accent" />
      </div>

      {appointments.length > 0 ? (
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <Table>
            <TableCaption className="py-4 text-muted-foreground">
              Showing {appointments.length} of {totalAppointments} cancelled appointments
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Date & Time</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="text-right font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.appointmentId} className="group">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {appointment.appointmentId}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-sm font-medium">{appointment.type}</span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(appointment.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    at {appointment.time}
                  </TableCell>
                  <TableCell>
                    {appointment.status == "confirmed" ? (
                      <span className="status-badge status-badge--success">Confirmed</span>
                    ) : appointment.status === "pending" ? (
                      <span className="status-badge status-badge--warning">Pending</span>
                    ) : appointment.status === "completed" ? (
                      <span className="status-badge status-badge--info">Completed</span>
                    ) : appointment.status === "cancelled" ? (
                      <span className="status-badge status-badge--danger">Cancelled</span>
                    ) : (
                      <span className="status-badge status-badge--neutral">{appointment.status}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(appointment.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/dashboard/appointments?id=${appointment.appointmentId}`}
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
          <h3>No cancelled appointments</h3>
          <p>Great news! No appointments have been cancelled.</p>
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

      {appointments.length === 0 && (
        <Table>
          <TableCaption>No upcoming appointments found</TableCaption>
        </Table>
      )}
    </div>
  );
}
