"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import Button from "@/src/components/ui/button";

export default function Page() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (status === "success") {
      localStorage.setItem("cart", "[]");
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("cart-updated"));
    }
  }, [status]);

  const isSuccess = status === "success";

  return (
    <div className="py-20 bg-neutral-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            {/* Status Banner */}
            <div
              className={`py-10 px-8 text-center ${
                isSuccess
                  ? "bg-gradient-to-br from-green-50 to-emerald-50"
                  : "bg-gradient-to-br from-red-50 to-orange-50"
              }`}
            >
              <div
                className={`w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center ${
                  isSuccess ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {isSuccess ? (
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-10 h-10 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              <h1
                className={`text-3xl font-bold mb-2 ${
                  isSuccess ? "text-green-800" : "text-red-800"
                }`}
              >
                {isSuccess ? "Order Placed Successfully!" : "Order Failed"}
              </h1>
              <p
                className={`text-lg ${
                  isSuccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {isSuccess
                  ? "Thank you for your purchase."
                  : "Something went wrong with your order."}
              </p>
            </div>

            {/* Order Details */}
            <div className="p-8">
              {orderId && (
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-500">Order ID</div>
                    <div className="font-bold text-lg text-gray-900">
                      #{orderId}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(orderId);
                    }}
                    className="text-sm text-petzy-coral hover:underline font-medium"
                  >
                    Copy ID
                  </button>
                </div>
              )}

              {isSuccess ? (
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-blue-500 mt-0.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        What happens next?
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        Your order is being reviewed. After verification, it
                        will be processed and shipped to your address. You can
                        track your order status from your account.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 p-3 bg-red-50/50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        Payment could not be completed
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        Your order failed due to a payment issue. No charges
                        were made. Please try again or use a different payment
                        method.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {isSuccess ? (
                  <>
                    <Link href="/" className="flex-1">
                      <Button
                        text="Continue Shopping"
                        type="default"
                        className="w-full !py-3"
                      />
                    </Link>
                    <Link href="/my-account/orders" className="flex-1">
                      <Button
                        text="View My Orders"
                        type="outline"
                        className="w-full !py-3"
                      />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/checkout" className="flex-1">
                      <Button
                        text="Try Again"
                        type="default"
                        className="w-full !py-3"
                      />
                    </Link>
                    <Link href="/" className="flex-1">
                      <Button
                        text="Back to Home"
                        type="outline"
                        className="w-full !py-3"
                      />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
