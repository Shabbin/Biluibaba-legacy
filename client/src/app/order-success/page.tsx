"use client";

import Button from "@/src/components/ui/button";

const Page = (): JSX.Element => {
  return (
    <div className="py-10">
      <div className="container mx-auto text-center">
        <img
          src="/order-success.png"
          alt="order success"
          className="w-[500px] mx-auto"
        />
        <div className="text-3xl font-bold my-5">Your order is confirmed!</div>
        <p className="text-xl">
          We&apos;ll send you a shipping confirmation email as soon as your order
          ships.
        </p>
        <Button
          text="Continue Shopping"
          type="default"
          className="my-5"
          onClick={() => (window.location.href = "/products")}
        />
      </div>
    </div>
  );
};

export default Page;
