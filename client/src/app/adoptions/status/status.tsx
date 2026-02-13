"use client";

import { useSearchParams } from "next/navigation";

import Button from "@/src/components/ui/button";

export default function Page() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "";
  const id = searchParams.get("id") || "";

  return (
    <div className="py-20 bg-neutral-100">
      <div className="container mx-auto">
        <div className="flex md:flex-row flex-col justify-between">
          <div className="basis-1/2 bg-white p-8 flex flex-col justify-evenly border-t-1 border-l-1 border-b-1 shadow">
            <div className="flex flex-col gap-5 py-5">
              <img
                src="/adoption-image.png"
                alt="adoption-time"
                className="w-[50px]"
              />
              <div className="text-red-500 text-3xl font-semibold">
                {status === "processing"
                  ? "On Review"
                  : status === "success"
                  ? "On Process"
                  : "Order Failed"}
              </div>
              <div className="text-4xl font-semibold">
                {status === "processing"
                  ? "Your application is on review!"
                  : status === "success"
                  ? "Your payment is sucessful."
                  : "Sorry the payment did not go through"}
              </div>
              <div className="text-3xl">
                {status === "processing"
                  ? "After some verification you will get the result."
                  : status === "success"
                  ? "After some verification you will get the result."
                  : "Please try again!"}
              </div>
            </div>
            {status === "failed" ? (
              <Button
                text="Return to checkout"
                className="!py-5"
                type="default"
                onClick={() => (window.location.href = "/adoptions/checkout")}
              />
            ) : (
              <Button
                text="Return to home"
                className="!py-5"
                type="default"
                onClick={() => (window.location.href = "/")}
              />
            )}
            {/* {loading ? (
              <div>Verifying order status...</div>
            ) : (
            )} */}
          </div>
          {status === "processing" ? (
            <img
              src="/adoption-review.png"
              alt="adoption-processing"
              className="basis-1/2 min-w-[400px] h-1/2 border-t-1 border-r-1 border-b-1 shadow"
            />
          ) : status === "success" ? (
            <img
              src="/adoption-success.png"
              alt="adoption-processing"
              className="basis-1/2 min-w-[400px] h-1/2 border-t-1 border-r-1 border-b-1 shadow"
            />
          ) : (
            <img
              src="/adoption-failed.png"
              alt="adoption-processing"
              className="basis-1/2 min-w-[400px] h-1/2 border-t-1 border-r-1 border-b-1 shadow"
            />
          )}
        </div>
      </div>
    </div>
  );
}
