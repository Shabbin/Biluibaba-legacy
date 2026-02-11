"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Button from "@/src/components/ui/button";

export default function Page() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (status === "success") localStorage.setItem("cart", "[]");
  }, []);

  return (
    <div className="py-20">
      <div className="container mx-auto">
        <div className="flex flex-row justify-between">
          <div className="basis-1/2 bg-white p-8 flex flex-col justify-evenly border shadow">
            <div className="flex flex-col gap-5">
              <img
                src="/adoption-image.png"
                alt="order-success"
                className="w-[50px]"
              />

              {orderId && <div className="text-2xl">Order ID: #{orderId}</div>}
              <div className="text-red-500 text-3xl">
                {status === "success" ? "On Process!" : "Order Failed!"}
              </div>
              <div className="text-3xl">
                Your order is{" "}
                {status === "success" ? "on review!" : "cancelled!"}
              </div>
              <div className="text-2xl">
                {status === "success"
                  ? "After some verification you will get the result."
                  : "Your order failed because of some issues. Please try again!"}
              </div>
            </div>
            {status === "success" ? (
              <Button
                text="Return to home"
                type="default"
                onClick={() => (window.location.href = "/")}
              />
            ) : (
              <Button
                text="Return to checkout"
                type="default"
                onClick={() => (window.location.href = "/checkout")}
              />
            )}
          </div>
          {status === "success" ? (
            <img
              src="/adoption-success.png"
              alt="Order success"
              className="basis-1/2 min-w-[400px] h-1/2"
            />
          ) : (
            <img
              src="/adoption-failed.png"
              alt="Order failed"
              className="basis-1/2 min-w-[400px] h-1/2"
            />
          )}
        </div>
      </div>
    </div>
  );
}
