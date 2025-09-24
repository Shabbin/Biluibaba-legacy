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
        `/api/vet/appointments?count=${pageCount}&type=all`
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
    <div className="p-5">
      <h2 className="text-4xl">Cancelled Appointments</h2>

      {appointments.length > 0 && (
        <Table>
          <TableCaption>A list of cancelled appointments</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Appointment ID #</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.appointmentId}>
                <TableCell>{appointment.appointmentId}</TableCell>
                <TableCell className="capitalize">{appointment.type}</TableCell>
                <TableCell>
                  {new Date(appointment.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {appointment.time}
                </TableCell>
                <TableCell className="capitalize">
                  {appointment.status == "confirmed" ? (
                    <span className="px-4 py-1 bg-green-100 text-green-900 rounded">
                      Confirmed
                    </span>
                  ) : appointment.status === "pending" ? (
                    <span className="px-4 py-1 bg-yellow-100 text-yellow-900 rounded">
                      Pending
                    </span>
                  ) : appointment.status === "completed" ? (
                    <span className="px-4 py-1 bg-blue-100 text-blue-900 rounded">
                      Completed
                    </span>
                  ) : appointment.status === "cancelled" ? (
                    <span className="px-4 py-1 bg-red-100 text-red-900 rounded">
                      Cancelled
                    </span>
                  ) : (
                    <span className="px-4 py-1 bg-gray-100 text-gray-900 rounded">
                      {appointment.status}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(appointment.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/appointments?id=${appointment.appointmentId}`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    View Appointment
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
