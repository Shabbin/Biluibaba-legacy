"use client";

import React, { useState, useEffect, Suspense, ChangeEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import Input from "@/src/components/ui/input";
import Select from "@/src/components/ui/select";
import Textarea from "@/src/components/ui/textarea";
import Button from "@/src/components/ui/button";
import Radio from "@/src/components/ui/radio";

import axios from "@/src/lib/axiosInstance";

interface CartItem {
  id: string;
  src: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

interface ShippingRate {
  base: number;
  perKg: number;
}

interface ShippingRates {
  [key: number]: ShippingRate;
}

type PaymentMethod = "Cash on delivery" | "Online";

const regionOptions = [
  { value: 0, text: "Inside Dhaka (Regular)" },
  { value: 1, text: "Inside Dhaka (Express)" },
  { value: 2, text: "Dhaka to Savar/Narayanganj/Keraniganj/Gazipur (Regular)" },
  { value: 3, text: "Outside Dhaka (Regular)" },
];

const areaOptions = [
  { value: "Area 1", text: "Area 1" },
  { value: "Area 2", text: "Area 2" },
];

const shippingRates: ShippingRates = {
  0: { base: 100, perKg: 20 }, // Inside Dhaka (Regular)
  1: { base: 120, perKg: 20 }, // Inside Dhaka (Express)
  2: { base: 120, perKg: 20 }, // Dhaka to Savar/Narayanganj/Keraniganj/Gazipur (Regular)
  3: { base: 150, perKg: 20 }, // Outside Dhaka (Regular)
};

const Checkout: React.FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [region, setRegion] = useState<number>(0);
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [area, setArea] = useState<string>("Area 1");
  const [fullAddress, setFullAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [orderLoading, setOrderLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Online");
  const platformFee = 10;

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    const parsedCart: CartItem[] = cartData ? JSON.parse(cartData) : [];

    if (parsedCart.length === 0) {
      window.location.href = "/my-cart";
    } else {
      setCart(parsedCart);
      setLoading(false);
    }
  }, []);

  const subTotal = (): number => {
    return cart.reduce((total, item) => {
      return total + Number(item.quantity) * Number(item.price);
    }, 0);
  };

  const calculateShippingCost = (): number => {
    const totalWeight = cart.reduce((total, item) => {
      return total + Number(item.size) * Number(item.quantity);
    }, 0);

    let shippingCost = 0;
    const regionNum = Number(region);

    if (shippingRates.hasOwnProperty(regionNum)) {
      const { base: baseRate, perKg: perKgCharge } = shippingRates[regionNum];

      if (totalWeight > 1000) {
        const extraWeight = Math.ceil(totalWeight / 1000) - 1;
        shippingCost = baseRate + extraWeight * perKgCharge;
      } else {
        shippingCost = baseRate;
      }
    }

    return shippingCost;
  };

  const getRegionText = (regionValue: number): string => {
    const regionMap: { [key: number]: string } = {
      0: "Inside Dhaka (Regular)",
      1: "Inside Dhaka (Express)",
      2: "Dhaka to Savar/Narayanganj/Keraniganj/Gazipur (Regular)",
      3: "Outside Dhaka (Regular)",
    };
    return regionMap[regionValue] || "";
  };

  const handleSubmit = async (): Promise<void> => {
    setOrderLoading(true);

    try {
      if (fullName === "" || fullName.length < 3 || fullName.length > 50) {
        toast.error("Please enter a valid full name.");
        setOrderLoading(false);
        return;
      }
      if (phoneNumber === "" || phoneNumber.length > 30) {
        toast.error("Please enter a valid phone number.");
        setOrderLoading(false);
        return;
      }
      if (fullAddress === "" || fullAddress.length > 750) {
        toast.error("Please enter a valid full address.");
        setOrderLoading(false);
        return;
      }
      if (notes.length > 750) {
        toast.error("Notes cannot exceed 750 characters.");
        setOrderLoading(false);
        return;
      }

      const shippingCost = calculateShippingCost();

      const { data } = await axios.post("/api/order", {
        totalAmount: subTotal() + shippingCost + platformFee,
        product: cart,
        shippingCost,
        name: fullName,
        phoneNumber,
        region: getRegionText(region),
        area,
        fullAddress,
        notes,
        paymentMethod,
      });

      if (data.success) {
        if (paymentMethod === "Online") {
          window.location.href = data.url;
        } else {
          window.location.href = `/products/order?status=success&orderId=${data.orderId}`;
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleNameKeyPress = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (!/[a-zA-z\s]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handlePhoneKeyPress = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const shippingCost = calculateShippingCost();
  const totalAmount = subTotal() + shippingCost + platformFee;

  if (loading) {
    return null;
  }

  return (
    <div className="py-20 bg-neutral-100">
      <div className="container mx-auto">
        <div className="flex md:flex-row flex-col gap-10 md:mx-0 mx-5">
          <div className="basis-2/3 md:order-1 order-2">
            <div className="border rounded-lg my-5 bg-white">
              <div className="p-6 border-b-1 rounded-tr-lg rounded-tl-lg text-2xl font-medium">
                Shipping & Billing
              </div>

              <div className="p-6">
                <div>Full name *</div>
                <Input
                  type="text"
                  placeholder="Enter name"
                  className="mb-5"
                  value={fullName}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setFullName(event.target.value)
                  }
                  onKeyPress={handleNameKeyPress}
                />

                <div>Phone Number *</div>
                <Input
                  type="text"
                  placeholder="Enter phone number"
                  className="mb-5"
                  value={phoneNumber}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setPhoneNumber(event.target.value)
                  }
                  onKeyPress={handlePhoneKeyPress}
                />

                <div className="flex flex-row gap-5 mb-5">
                  <div className="basis-1/2">
                    <div>Region *</div>
                    <Select
                      data={regionOptions}
                      onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                        setRegion(Number(event.target.value))
                      }
                      value={region}
                    />
                  </div>
                  <div className="basis-1/2">
                    <div>Area *</div>
                    <Select
                      data={areaOptions}
                      value={area}
                      onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                        setArea(event.target.value)
                      }
                    />
                  </div>
                </div>

                <div>Full Address*</div>
                <Textarea
                  placeholder="Enter your street address here"
                  className="mb-5"
                  value={fullAddress}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setFullAddress(event.target.value)
                  }
                />

                <div>Notes</div>
                <Textarea
                  placeholder="Enter additional notes here"
                  className="mb-5"
                  value={notes}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setNotes(event.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="basis-1/3 md:my-5 my-0 md:order-2 order-1">
            <div className="bg-white rounded-lg p-5 mb-5">
              <div className="flex flex-row items-center justify-between border-dotted border-b-2 py-5">
                <div className="flex items-center gap-2">
                  <img src="/coupon.png" alt="coupon" className="w-8 h-8" />
                  <div>
                    <div className="text-sm uppercase">Whiskas</div>
                    <div className="text-xs text-green-500">Save ৳234 using this coupon</div>
                  </div>
                </div>
                <Button text="Apply" type="default" className="!py-2 !px-8" />
              </div>
              <div className="text-green-700 text-center cursor-pointer pt-5">
                View all Coupons &gt;
              </div>
            </div>

            <div className="border rounded-lg mb-5 bg-white">
              <div className="flex justify-between items-center px-6 py-5 border-b-1">
                <div className="font-medium text-lg">Ordered Items</div>
                <Link href="/my-cart" className="underline">
                  Edit Cart
                </Link>
              </div>
              {cart.map((product) => (
                <div key={product.id} className="flex flex-row my-5 gap-5 px-6">
                  <img
                    src={product.src}
                    alt={product.name}
                    className="w-[60px] h-[60px]"
                  />
                  <div className="flex flex-col flex-1 my-1">
                    <div className="mb-5">
                      <div>{product.name}</div>
                      <div>Size: {product.size}</div>
                    </div>
                    <div className="flex flex-row justify-between text-lg">
                      <div className="font-medium">
                        {product.quantity} x &#2547;{product.price}
                      </div>
                      <div className="font-bold">
                        &#2547;{product.quantity * product.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border rounded-lg bg-white">
              <div className="font-medium text-xl px-6 py-6 border-b-1 rounded-tr-2xl rounded-tl-2xl">
                Order Summary
              </div>
              <div className="p-6">
                <div className="flex flex-row items-center justify-between my-4 text-lg">
                  <div>Sub Total</div>
                  <div className="font-semibold">&#2547;{subTotal()}</div>
                </div>

                <div className="flex flex-row items-center justify-between my-4 text-lg">
                  <div>Shipping Cost</div>
                  <div className="font-semibold">&#2547;{shippingCost}</div>
                </div>

                <div className="flex flex-row items-center justify-between my-4 text-lg border-b-1 pb-5">
                  <div>Platform Fee</div>
                  <div className="font-semibold">&#2547;{platformFee}</div>
                </div>

                <div className="flex flex-row items-center justify-between text-lg border-b-1 pb-5 font-semibold">
                  <div>Total Amount</div>
                  <div>&#2547;{totalAmount}</div>
                </div>

                <div className="py-5">
                  <div className="flex items-center gap-2">
                    <Radio
                      name="payment"
                      checked={paymentMethod === "Cash on delivery"}
                      onChange={() => setPaymentMethod("Cash on delivery")}
                    />
                    <label>Cash on delivery</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio
                      name="payment"
                      checked={paymentMethod === "Online"}
                      onChange={() => setPaymentMethod("Online")}
                    />
                    <label>Pay Online</label>
                  </div>
                </div>

                <Button
                  type="default"
                  text="Checkout"
                  className="w-full"
                  disabled={orderLoading}
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Checkout />
    </Suspense>
  );
};

export default Page;
