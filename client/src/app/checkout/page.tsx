"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaUserPlus,
  FaMapLocationDot,
  FaCheck,
  FaTag,
  FaXmark,
  FaTruck,
  FaCreditCard,
  FaMoneyBill,
  FaCircleInfo,
} from "react-icons/fa6";

import Input from "@/src/components/ui/input";
import Select from "@/src/components/ui/select";
import Textarea from "@/src/components/ui/textarea";
import Button from "@/src/components/ui/button";

import { useAuth } from "@/src/components/providers/AuthProvider";
import axios from "@/src/lib/axiosInstance";
import { formatCurrency } from "@/src/lib/currency";

import LocationData from "@/src/app/my-account/location.data";

interface CartItem {
  id?: string;
  quantity: number;
  price: number;
  name: string;
  src: string;
  size?: number;
  vendorId?: string;
}

interface UserAddress {
  state: string;
  area: string;
  district: string;
  postcode: string;
  address: string;
}

interface AppliedCoupon {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discount: number;
}

interface AvailableCoupon {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  expiresAt: string | null;
}

type DeliveryMode = "self" | "other";

const SHIPPING_RATES: Record<
  number,
  { base: number; perKg: number; label: string }
> = {
  0: { base: 100, perKg: 20, label: "Inside Dhaka (Regular)" },
  1: { base: 120, perKg: 20, label: "Inside Dhaka (Express)" },
  2: {
    base: 120,
    perKg: 20,
    label: "Dhaka to Savar/Narayanganj/Keraniganj/Gazipur (Regular)",
  },
  3: { base: 150, perKg: 20, label: "Outside Dhaka (Regular)" },
};

const PLATFORM_FEE = 10;

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Delivery mode
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("self");

  // User saved address
  const [savedAddress, setSavedAddress] = useState<UserAddress | null>(null);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [addressLoading, setAddressLoading] = useState(true);

  // Manual form (for "other" mode)
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [region, setRegion] = useState(0);
  const [district, setDistrict] = useState("Dhaka");
  const [fullAddress, setFullAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [orderLoading, setOrderLoading] = useState(false);

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null
  );
  const [availableCoupons, setAvailableCoupons] = useState<AvailableCoupon[]>(
    []
  );
  const [showCoupons, setShowCoupons] = useState(false);
  const [couponsLoading, setCouponsLoading] = useState(false);

  // ---------- CALCULATIONS ----------

  const subTotal = useCallback(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.price),
      0
    );
  }, [cart]);

  const shippingCost = useCallback(() => {
    let totalWeight = 0;
    cart.forEach(
      (item) => (totalWeight += Number(item.size || 0) * Number(item.quantity))
    );

    const rate = SHIPPING_RATES[region];
    if (!rate) return 0;

    if (totalWeight > 1000) {
      const extraWeight = Math.ceil(totalWeight / 1000) - 1;
      return rate.base + extraWeight * rate.perKg;
    }
    return rate.base;
  }, [cart, region]);

  const couponDiscount = appliedCoupon?.discount || 0;
  const totalAmount = subTotal() + shippingCost() + PLATFORM_FEE - couponDiscount;

  // ---------- DATA LOADING ----------

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (storedCart.length === 0) {
      router.replace("/my-cart");
      return;
    }
    setCart(storedCart);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const { data } = await axios.get("/api/auth/me");
        if (data.success && data.data) {
          setUserName(data.data.name || "");
          setUserPhone(data.data.phoneNumber || "");
          if (data.data.shipping && data.data.shipping.address) {
            setSavedAddress(data.data.shipping);
          }
        }
      } catch {
        // User may not be logged in or address fetch failed silently
      } finally {
        setAddressLoading(false);
      }
    };
    fetchUserAddress();
  }, []);

  // Re-validate coupon when subtotal changes
  useEffect(() => {
    if (appliedCoupon) {
      const st = subTotal();
      let discount = 0;
      if (appliedCoupon.discountType === "percentage") {
        discount = Math.round((st * appliedCoupon.discountValue) / 100);
      } else {
        discount = appliedCoupon.discountValue;
      }
      if (discount > st) discount = st;
      setAppliedCoupon((prev) =>
        prev ? { ...prev, discount } : null
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTotal]);

  // ---------- COUPON HANDLERS ----------

  const fetchAvailableCoupons = async () => {
    setCouponsLoading(true);
    try {
      const { data } = await axios.get("/api/coupon/active");
      if (data.success) setAvailableCoupons(data.coupons);
    } catch {
      // Silently fail
    } finally {
      setCouponsLoading(false);
    }
  };

  const handleApplyCoupon = async (code?: string) => {
    const codeToApply = code || couponCode;
    if (!codeToApply.trim()) return toast.error("Please enter a coupon code");

    setCouponLoading(true);
    try {
      const { data } = await axios.post("/api/coupon/validate", {
        code: codeToApply,
        subtotal: subTotal(),
      });
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponCode(data.coupon.code);
        setShowCoupons(false);
        toast.success(
          `Coupon applied! You save ৳${formatCurrency(data.coupon.discount)}`
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Invalid coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  const toggleCouponsView = () => {
    if (!showCoupons && availableCoupons.length === 0) {
      fetchAvailableCoupons();
    }
    setShowCoupons(!showCoupons);
  };

  // ---------- ORDER SUBMISSION ----------

  const getShippingInfo = () => {
    if (deliveryMode === "self" && savedAddress) {
      return {
        name: userName,
        phoneNumber: userPhone,
        region: savedAddress.district || "Dhaka",
        area: savedAddress.area || savedAddress.district || "Dhaka",
        fullAddress: `${savedAddress.address}${savedAddress.area ? ", " + savedAddress.area : ""}${savedAddress.district ? ", " + savedAddress.district : ""}${savedAddress.postcode ? " - " + savedAddress.postcode : ""}${savedAddress.state ? ", " + savedAddress.state : ""}`,
      };
    }
    return {
      name: fullName,
      phoneNumber,
      region: SHIPPING_RATES[region]?.label || "Unknown Region",
      area: district,
      fullAddress,
    };
  };

  const validateForm = (): boolean => {
    if (deliveryMode === "self") {
      if (!savedAddress || !savedAddress.address) {
        toast.error("Please add an address in your address book first.");
        return false;
      }
      if (!userName || userName.length < 3) {
        toast.error("Your profile name is missing. Please update your profile.");
        return false;
      }
      if (!userPhone) {
        toast.error(
          "Your phone number is missing. Please update your profile."
        );
        return false;
      }
      return true;
    }

    if (!fullName || fullName.length < 3 || fullName.length > 50) {
      toast.error("Please enter a valid full name (3-50 characters).");
      return false;
    }
    if (!phoneNumber || phoneNumber.length < 7 || phoneNumber.length > 30) {
      toast.error("Please enter a valid phone number.");
      return false;
    }
    if (!fullAddress || fullAddress.length > 750) {
      toast.error("Please enter a valid full address.");
      return false;
    }
    if (notes.length > 750) {
      toast.error("Notes cannot exceed 750 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setOrderLoading(true);
    try {
      const shipping = getShippingInfo();

      const { data } = await axios.post("/api/order", {
        totalAmount,
        product: cart,
        shippingCost: shippingCost(),
        name: shipping.name,
        phoneNumber: shipping.phoneNumber,
        region: shipping.region,
        area: shipping.area,
        fullAddress: shipping.fullAddress,
        notes,
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
      });

      if (data.success) {
        if (paymentMethod === "Online") {
          window.location.href = data.url;
        } else {
          // Clear cart for COD orders
          localStorage.setItem("cart", "[]");
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new Event("cart-updated"));
          window.location.href =
            "/products/order?status=success&orderId=" + data.orderId;
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setOrderLoading(false);
    }
  };

  // ---------- RENDER ----------

  if (loading) {
    return (
      <div className="py-20 bg-neutral-50 min-h-screen">
        <div className="container mx-auto flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-petzy-coral"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-neutral-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-1">
            Complete your order by filling in the details below
          </p>
        </div>

        <div className="flex lg:flex-row flex-col gap-8">
          {/* ==================== LEFT COLUMN ==================== */}
          <div className="lg:basis-2/3 lg:order-1 order-2 space-y-6">
            {/* --- Delivery Mode Selector --- */}
            <div className="border rounded-xl bg-white shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FaTruck className="text-petzy-coral" />
                  Delivery Information
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Who will receive this order?
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode("self")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      deliveryMode === "self"
                        ? "border-petzy-coral bg-red-50/50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        deliveryMode === "self"
                          ? "bg-petzy-coral text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <FaUser className="text-sm" />
                    </div>
                    <div className="text-left">
                      <div
                        className={`font-semibold ${
                          deliveryMode === "self"
                            ? "text-petzy-coral"
                            : "text-gray-700"
                        }`}
                      >
                        For Myself
                      </div>
                      <div className="text-xs text-gray-500">
                        Use my saved address
                      </div>
                    </div>
                    {deliveryMode === "self" && (
                      <FaCheck className="ml-auto text-petzy-coral" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMode("other")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      deliveryMode === "other"
                        ? "border-petzy-coral bg-red-50/50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        deliveryMode === "other"
                          ? "bg-petzy-coral text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <FaUserPlus className="text-sm" />
                    </div>
                    <div className="text-left">
                      <div
                        className={`font-semibold ${
                          deliveryMode === "other"
                            ? "text-petzy-coral"
                            : "text-gray-700"
                        }`}
                      >
                        For Someone Else
                      </div>
                      <div className="text-xs text-gray-500">
                        Enter new address
                      </div>
                    </div>
                    {deliveryMode === "other" && (
                      <FaCheck className="ml-auto text-petzy-coral" />
                    )}
                  </button>
                </div>

                {/* --- For Myself: Show Saved Address Card --- */}
                {deliveryMode === "self" && (
                  <div>
                    {addressLoading ? (
                      <div className="flex items-center justify-center py-10">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-petzy-coral"></div>
                      </div>
                    ) : savedAddress && savedAddress.address ? (
                      <div className="border-2 border-petzy-coral rounded-xl p-5 bg-red-50/30">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-petzy-coral/10 flex items-center justify-center mt-0.5">
                              <FaMapLocationDot className="text-petzy-coral" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {userName}
                              </div>
                              <div className="text-sm text-gray-600 mt-0.5">
                                {userPhone}
                              </div>
                              <div className="text-sm text-gray-600 mt-2">
                                {savedAddress.address}
                              </div>
                              <div className="text-sm text-gray-500 mt-0.5">
                                {[
                                  savedAddress.area,
                                  savedAddress.district,
                                  savedAddress.postcode,
                                  savedAddress.state,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-petzy-coral bg-white px-3 py-1 rounded-full border border-petzy-coral/20 text-xs font-semibold">
                            <FaCheck className="text-[10px]" /> Selected
                          </div>
                        </div>
                        <Link
                          href="/my-account/address"
                          className="text-sm text-petzy-coral hover:underline mt-3 inline-block"
                        >
                          Edit Address &rarr;
                        </Link>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                        <FaMapLocationDot className="text-4xl text-gray-300 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-700 mb-1">
                          No saved address found
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Add an address to your account to use quick checkout
                        </p>
                        <Link href="/my-account/address">
                          <Button
                            text="Add Address"
                            type="default"
                            className="!py-2 !px-6"
                          />
                        </Link>
                      </div>
                    )}

                    {/* Notes field even for self mode */}
                    {savedAddress && savedAddress.address && (
                      <div className="mt-5">
                        <label className="text-sm font-medium text-gray-700">
                          Order Notes{" "}
                          <span className="text-gray-400 font-normal">
                            (Optional)
                          </span>
                        </label>
                        <Textarea
                          placeholder="Any special instructions for your order..."
                          className="mt-1.5"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* --- For Someone Else: Manual Form --- */}
                {deliveryMode === "other" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter recipient's name"
                          className="mt-1.5"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          onKeyPress={(e) => {
                            if (!/[a-zA-Z\s]/.test(e.key)) e.preventDefault();
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Phone Number *
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter phone number"
                          className="mt-1.5"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          onKeyPress={(e) => {
                            if (!/[0-9+]/.test(e.key)) e.preventDefault();
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Shipping Region *
                        </label>
                        <Select
                          data={Object.entries(SHIPPING_RATES).map(
                            ([key, rate]) => ({
                              value: key,
                              text: rate.label,
                            })
                          )}
                          className="mt-1.5"
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>
                          ) => setRegion(Number(e.target.value))}
                          value={String(region)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          District *
                        </label>
                        <Select
                          data={LocationData.map((loc) => ({
                            value: loc,
                            text: loc,
                          }))}
                          className="mt-1.5"
                          value={district}
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>
                          ) => setDistrict(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Full Address *
                      </label>
                      <Textarea
                        placeholder="House no., Street, Area, Landmark..."
                        className="mt-1.5"
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Order Notes{" "}
                        <span className="text-gray-400 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <Textarea
                        placeholder="Any special instructions for your order..."
                        className="mt-1.5"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- Payment Method --- */}
            <div className="border rounded-xl bg-white shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FaCreditCard className="text-petzy-coral" />
                  Payment Method
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Online")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      paymentMethod === "Online"
                        ? "border-petzy-coral bg-red-50/50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        paymentMethod === "Online"
                          ? "bg-petzy-coral text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <FaCreditCard className="text-sm" />
                    </div>
                    <div className="text-left">
                      <div
                        className={`font-semibold ${
                          paymentMethod === "Online"
                            ? "text-petzy-coral"
                            : "text-gray-700"
                        }`}
                      >
                        Pay Online
                      </div>
                      <div className="text-xs text-gray-500">
                        Card, Mobile Banking, etc.
                      </div>
                    </div>
                    {paymentMethod === "Online" && (
                      <FaCheck className="ml-auto text-petzy-coral" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash on delivery")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      paymentMethod === "Cash on delivery"
                        ? "border-petzy-coral bg-red-50/50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        paymentMethod === "Cash on delivery"
                          ? "bg-petzy-coral text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <FaMoneyBill className="text-sm" />
                    </div>
                    <div className="text-left">
                      <div
                        className={`font-semibold ${
                          paymentMethod === "Cash on delivery"
                            ? "text-petzy-coral"
                            : "text-gray-700"
                        }`}
                      >
                        Cash on Delivery
                      </div>
                      <div className="text-xs text-gray-500">
                        Pay when you receive
                      </div>
                    </div>
                    {paymentMethod === "Cash on delivery" && (
                      <FaCheck className="ml-auto text-petzy-coral" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN ==================== */}
          <div className="lg:basis-1/3 lg:order-2 order-1 space-y-5">
            {/* --- Coupon Section --- */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <FaTag className="text-petzy-coral" />
                  Coupon Code
                </h3>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-600 text-sm" />
                      <div>
                        <span className="font-semibold text-green-800 text-sm">
                          {appliedCoupon.code}
                        </span>
                        <div className="text-xs text-green-600">
                          You save ৳{formatCurrency(appliedCoupon.discount)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <FaXmark />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      className="flex-1 uppercase"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleApplyCoupon();
                      }}
                    />
                    <Button
                      text={couponLoading ? "..." : "Apply"}
                      type="default"
                      className="!py-2 !px-6 shrink-0"
                      disabled={couponLoading}
                      onClick={() => handleApplyCoupon()}
                    />
                  </div>
                )}

                <button
                  onClick={toggleCouponsView}
                  className="text-petzy-coral text-sm hover:underline mt-3 inline-block font-medium"
                >
                  {showCoupons
                    ? "Hide Available Coupons"
                    : "View Available Coupons"}{" "}
                  &gt;
                </button>

                {showCoupons && (
                  <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
                    {couponsLoading ? (
                      <div className="text-center py-4 text-sm text-gray-400">
                        Loading coupons...
                      </div>
                    ) : availableCoupons.length === 0 ? (
                      <div className="text-center py-4 text-sm text-gray-400">
                        No coupons available right now
                      </div>
                    ) : (
                      availableCoupons.map((c) => (
                        <div
                          key={c._id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:border-petzy-coral/50 transition-colors"
                        >
                          <div>
                            <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono font-bold">
                              {c.code}
                            </code>
                            <div className="text-xs text-gray-500 mt-1">
                              {c.discountType === "percentage"
                                ? `${c.discountValue}% off`
                                : `৳${formatCurrency(c.discountValue)} off`}
                              {c.minOrderAmount > 0 &&
                                ` on orders above ৳${formatCurrency(
                                  c.minOrderAmount
                                )}`}
                            </div>
                            {c.description && (
                              <div className="text-xs text-gray-400 mt-0.5">
                                {c.description}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleApplyCoupon(c.code)}
                            className="text-xs font-semibold text-petzy-coral hover:underline shrink-0 ml-3"
                          >
                            Apply
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* --- Ordered Items --- */}
            <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="flex justify-between items-center px-5 py-4 border-b bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">
                  Ordered Items ({cart.length})
                </h3>
                <Link
                  href="/my-cart"
                  className="text-sm text-petzy-coral hover:underline font-medium"
                >
                  Edit Cart
                </Link>
              </div>
              <div className="divide-y">
                {cart.map((product) => (
                  <div key={product.id} className="flex gap-4 p-4">
                    <img
                      src={product.src}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg border bg-gray-50"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' fill='%23f5f5f5'%3E%3Crect width='64' height='64'/%3E%3Ctext x='50%25' y='50%25' fill='%23999' font-size='10' text-anchor='middle' dy='.3em'%3ENo img%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </div>
                      {product.size && (
                        <div className="text-xs text-gray-500">
                          Size: {product.size}g
                        </div>
                      )}
                      <div className="flex justify-between items-end mt-2">
                        <span className="text-xs text-gray-500">
                          {product.quantity} x ৳{formatCurrency(product.price)}
                        </span>
                        <span className="font-semibold text-sm">
                          ৳{formatCurrency(product.quantity * product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Order Summary --- */}
            <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Order Summary</h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ৳{formatCurrency(subTotal())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    ৳{formatCurrency(shippingCost())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium">
                    ৳{formatCurrency(PLATFORM_FEE)}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1">
                      <FaTag className="text-xs" />
                      Coupon Discount
                    </span>
                    <span className="font-medium">
                      -৳{formatCurrency(couponDiscount)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-petzy-coral">
                      ৳{formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>

                <Button
                  type="default"
                  text={orderLoading ? "Processing..." : "Place Order"}
                  className="w-full !py-3 !text-base !font-semibold !mt-4"
                  disabled={orderLoading}
                  onClick={handleSubmit}
                  loading={orderLoading}
                />

                <div className="flex items-start gap-2 text-xs text-gray-400 mt-2">
                  <FaCircleInfo className="text-sm mt-0.5 shrink-0" />
                  <span>
                    By placing this order, you agree to our Terms of Service and
                    Privacy Policy.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
