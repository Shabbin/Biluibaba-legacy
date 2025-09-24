"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import axios from "@/src/lib/axiosInstance";

import Button from "@/src/components/ui/button";

import { LuLoader } from "react-icons/lu";

export default function Page() {
  const search = useSearchParams();
  const orderId = search.get("id");

  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await axios.get(
        "/api/adoptions/application?id=" + orderId
      );

      if (data.success) setOrderDetails(data.order);

      console.log(data);
    } catch (error) {
      toast.error("Failed to fetch order details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (status) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/adoptions/application", {
        id: orderId,
        status,
      });

      if (data.success) {
        toast.success("Application status updated successfully");
        setTimeout(() => {
          fetchOrderDetails();
        }, 3000);
      }
    } catch (error) {
      toast.error("Failed to update application status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrderDetails();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-10">
      {loading ? (
        <LuLoader className="animate-spin" size="2em"></LuLoader>
      ) : orderDetails.status === "Pending" ? (
        <>
          <h2 className="text-5xl md:w-1/2 w-full text-center">
            Do you want to accept this application from?
          </h2>
          <div className="flex md:flex-row gap-5 items-center">
            <Button
              type="default"
              text="Yes"
              onClick={() => onSubmit("Accepted")}
              className="basis-1/2 md:w-auto w-full"
            />
            <Button
              type="outline"
              text="No"
              onClick={() => onSubmit("Rejected")}
              className="basis-1/2 md:w-auto w-full"
            />
          </div>
        </>
      ) : (
        <div>
          {orderDetails.status === "Accepted" ? (
            <div className="text-2xl text-green-500">
              This application has already been accepted!
            </div>
          ) : (
            <div className="text-2xl text-red-500">
              This application has been rejected!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
