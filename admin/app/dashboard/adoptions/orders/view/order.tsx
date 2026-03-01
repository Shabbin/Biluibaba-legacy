"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import axios from "@/lib/axios";
import { formatDate } from "@/lib/time";

import { Loader2, User } from "lucide-react";

export default function Page() {
  const search = useSearchParams();
  const orderId = search.get("id");

  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<any>(null);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/admin/adoptions/order/${orderId}`);

      if (data.success) setOrder(data.order);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching order",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrder();
  }, []);

  return (
    <div className="py-5">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div>
          <div className="flex flex-row gap-4">
            <h2 className="text-2xl mb-4">Adoption Order ID: #{orderId}</h2>
            <p>
              <span className="px-4 py-1 bg-green-100 text-green-900 rounded font-bold">
                Payment Completed
              </span>
            </p>
            <p>
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
            </p>
          </div>
          <p>{formatDate(order.createdAt)}</p>

          <div className="flex flex-row gap-5">
            <div className="basis-2/3">
              <div className="p-5 rounded my-5 border">
                <h2 className="text-xl">Order Summary</h2>
                <p className="mb-2">
                  <strong>Payment:</strong> {order.payment} BDT
                </p>
                <p className="mb-2 text-wrap">
                  <strong>Name:</strong> {order.name}
                </p>
                <p className="mb-2">
                  <strong>Phone Number:</strong> {order.phoneNumber}
                </p>
                <p className="mb-2">
                  <strong>Area:</strong> {order.area}
                </p>
                <p className="mb-2 break-all">
                  <strong>Address:</strong> {order.address}
                </p>
                <p className="mb-2 break-all">
                  <strong>Adoption Reason:</strong> {order.whyAdopt}
                </p>
                <p className="mb-2 break-all">
                  <strong>Pet Proof:</strong> {order.petProof}
                </p>
                <p className="mb-2 break-all">
                  <strong>Taking care of pet:</strong> {order.takeCareOfPet}
                </p>
              </div>
            </div>
            <div className="basis-1/3">
              <div className="bg-white p-5 rounded my-5 border flex flex-col gap-5">
                <h3 className="text-xl font-semibold mb-4">Adoption Details</h3>
                <div className="flex flex-row items-center gap-2">
                  <img
                    src={order.adoptionId.images[0].path}
                    className="w-32"
                    alt={order.adoptionId.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' fill='%23ddd'%3E%3Crect width='128' height='128'/%3E%3Ctext x='50%25' y='50%25' fill='%23999' font-size='12' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
                  />
                  <div className="text-xl">{order.adoptionId.name}</div>
                </div>
                <Button asChild>
                  <Link
                    href={`/dashboard/adoptions/view?id=${order.adoptionId.adoptionId}`}
                  >
                    View Adoption Post
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
