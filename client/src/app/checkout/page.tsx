"use client";

import React from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

import withRouter from "@/src/app/controllers/router";

import Input from "@/src/components/ui/input";
import Select from "@/src/components/ui/select";
import Textarea from "@/src/components/ui/textarea";
import Button from "@/src/components/ui/button";
import Radio from "@/src/components/ui/radio";

import axios from "@/src/lib/axiosInstance";
import { formatCurrency } from "@/src/lib/currency";

import { WithRouterProps } from "@/src/app/controllers/router";

interface CheckoutState {
  loading: boolean;
  cart: { id?: string; quantity: number; price: number; name: string; src: string; size?: number }[];
  region: number;
  fullName: string;
  phoneNumber: string;
  area: string;
  fullAddress: string;
  notes: string;
  orderLoading: boolean;
  paymentMethod: string;
  platformFee: number;
}

export default withRouter(
  class Checkout extends React.Component<WithRouterProps, CheckoutState> {
    constructor(props: WithRouterProps) {
      super(props);

      this.state = {
        loading: true,
        cart: [],
        region: 0,
        fullName: "",
        phoneNumber: "",
        area: "Area 1",
        fullAddress: "",
        notes: "",
        orderLoading: false,
        paymentMethod: "Online",
        platformFee: 10,
      };

      this.subTotal = this.subTotal.bind(this);
      this.shippingCost = this.shippingCost.bind(this);
    }

    componentDidMount() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (cart.length === 0) window.location.href = "/my-cart";
      else {
        this.setState({
          cart: cart,
          loading: false,
        });
      }

      this.shippingCost();
    }

    subTotal() {
      let total = 0;
      for (let i = 0; i < this.state.cart.length; i++) {
        total +=
          Number(this.state.cart[i].quantity) *
          Number(this.state.cart[i].price);
      }
      return total;
    }

    shippingCost() {
      let totalWeight = 0;
      this.state.cart.forEach(
        (item) => (totalWeight += Number(item.size) * Number(item.quantity))
      );

      let shippingCost = 0;
      const region = Number(this.state.region); // Ensure region is a number

      // Define shipping rates based on selected region
      const shippingRates: Record<number, { base: number; perKg: number }> = {
        0: { base: 100, perKg: 20 }, // Inside Dhaka (Regular)
        1: { base: 120, perKg: 20 }, // Inside Dhaka (Express)
        2: { base: 120, perKg: 20 }, // Dhaka to Savar/Narayanganj/Keraniganj/Gazipur (Regular)
        3: { base: 150, perKg: 20 }, // Outside Dhaka (Regular)
      };

      // If region exists in our defined rates
      if (shippingRates.hasOwnProperty(region)) {
        let baseRate = shippingRates[region].base;
        let perKgCharge = shippingRates[region].perKg;

        if (totalWeight > 1000) {
          // Convert grams to kg
          let extraWeight = Math.ceil(totalWeight / 1000) - 1; // Subtract 1kg for base cost
          shippingCost = baseRate + extraWeight * perKgCharge;
        } else {
          shippingCost = baseRate;
        }
      }

      return shippingCost;
    }

    getRegion(region: number): string {
      if (region === 0) return "Inside Dhaka (Regular)";
      else if (region === 1) return "Inside Dhaka (Express)";
      else if (region === 2)
        return "Dhaka to Savar/Narayanganj/Keraniganj/Gazipur (Regular)";
      else if (region === 3) return "Outside Dhaka (Regular)";
      return "Unknown Region";
    }

    async onSubmit() {
      this.setState({ orderLoading: true });
      try {
        if (
          this.state.fullName === "" ||
          this.state.fullName.length < 3 ||
          this.state.fullName.length > 50
        )
          return toast.error("Please enter a valid full name.");
        if (this.state.phoneNumber === "" || this.state.phoneNumber.length > 30)
          return toast.error("Please enter a valid phone number.");
        if (
          this.state.fullAddress === "" ||
          this.state.fullAddress.length > 750
        )
          return toast.error("Please enter a valid full address.");
        if (this.state.notes.length > 750)
          return toast.error("Notes cannot exceed 750 characters.");

        const { data } = await axios.post("/api/order", {
          totalAmount:
            this.subTotal() + this.shippingCost() + this.state.platformFee,
          product: this.state.cart,
          shippingCost: this.shippingCost(),
          name: this.state.fullName,
          phoneNumber: this.state.phoneNumber,
          region: this.getRegion(this.state.region),
          area: this.state.area,
          fullAddress: this.state.fullAddress,
          notes: this.state.notes,
          paymentMethod: this.state.paymentMethod,
        });

        if (data.success) {
          if (this.state.paymentMethod === "Online") {
            window.location.href = data.url;
          } else
            window.location.href =
              "/products/order?status=success&orderId=" + data.orderId;
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        this.setState({ orderLoading: false });
      }
    }

    render() {
      return (
        <div className="py-20 bg-neutral-100">
          <div className="container mx-auto">
            {this.state.loading ? null : (
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
                        value={this.state.fullName}
                        onChange={(event) =>
                          this.setState({ fullName: event.target.value })
                        }
                        onKeyPress={(event) => {
                          if (!/[a-zA-z\s]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />

                      <div>Phone Number *</div>
                      <Input
                        type="text"
                        placeholder="Enter phone number"
                        className="mb-5"
                        value={this.state.phoneNumber}
                        onChange={(event) =>
                          this.setState({ phoneNumber: event.target.value })
                        }
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />

                      <div className="flex flex-row gap-5 mb-5">
                        <div className="basis-1/2">
                          <div>Region *</div>
                          <Select
                            data={[
                              { value: "0", text: "Inside Dhaka (Regular)" },
                              { value: "1", text: "Inside Dhaka (Express)" },
                              {
                                value: "2",
                                text: "Dhaka to Savar/Narayanganj/Keraniganj/Gazipur (Regular)",
                              },
                              { value: "3", text: "Outside Dhaka (Regular)" },
                            ]}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                              this.setState(
                                { region: Number(event.target.value) },
                                () => this.shippingCost()
                              )
                            }
                            value={String(this.state.region)}
                          />
                        </div>
                        <div className="basis-1/2">
                          <div>Area *</div>
                          <Select
                            data={[
                              { value: "Area 1", text: "Area 1" },
                              { value: "Area 2", text: "Area 2" },
                            ]}
                            value={this.state.area}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                              this.setState({ area: event.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div>Full Address*</div>
                      <Textarea
                        placeholder="Enter your street address here"
                        className="mb-5"
                        value={this.state.fullAddress}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                          this.setState({ fullAddress: event.target.value })
                        }
                      />

                      <div>Notes</div>
                      <Textarea
                        placeholder="Enter additional notes here"
                        className="mb-5"
                        value={this.state.notes}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                          this.setState({ notes: event.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="basis-1/3 md:my-5 my-0 md:order-2 order-1">
                  <div className="bg-white rounded-lg p-5 mb-5">
                    <div className="flex flex-row items-center justify-between border-dotted border-b-2 py-5">
                      <div className="flex items-center gap-2">
                        <img
                          src="/coupon.png"
                          alt="coupon"
                          className="w-8 h-8"
                        />
                        <div>
                          <div className="text-sm uppercase">Whiskas</div>
                          <div className="text-xs text-green-500">
                            Save ৳234 using this coupon
                          </div>
                        </div>
                      </div>
                      <Button
                        text="Apply"
                        type="default"
                        className="!py-2 !px-8"
                      />
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
                    {this.state.cart.map((product) => (
                      <div
                        key={product.id}
                        className="flex flex-row my-5 gap-5 px-6"
                      >
                        <img
                          src={product.src}
                          alt={product.name}
                          className="w-[60px] h-[60px]"
                          onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' fill='%23f5f5f5'%3E%3Crect width='60' height='60'/%3E%3Ctext x='50%25' y='50%25' fill='%23999' font-size='10' text-anchor='middle' dy='.3em'%3ENo img%3C/text%3E%3C/svg%3E"; }}
                        />
                        <div className="flex flex-col flex-1 my-1">
                          <div className="mb-5">
                            <div>{product.name}</div>
                            <div>Size: {product.size}</div>
                          </div>
                          <div className="flex flex-row justify-between text-lg">
                            <div className="font-medium">
                              {product.quantity} x &#2547;{formatCurrency(product.price)}
                            </div>
                            <div className="font-bold">
                              &#2547;{formatCurrency(product.quantity * product.price)}
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
                        <div className="font-semibold">
                          &#2547;{formatCurrency(this.subTotal())}
                        </div>
                      </div>

                      <div className="flex flex-row items-center justify-between my-4 text-lg">
                        <div>Shipping Cost</div>
                        <div className="font-semibold">
                          &#2547;{formatCurrency(this.shippingCost())}
                        </div>
                      </div>

                      <div className="flex flex-row items-center justify-between my-4 text-lg border-b-1 pb-5">
                        <div>Platform Fee</div>
                        <div className="font-semibold">
                          &#2547;{formatCurrency(this.state.platformFee)}
                        </div>
                      </div>

                      <div className="flex flex-row items-center justify-between text-lg border-b-1 pb-5 font-semibold">
                        <div>Total Amount</div>
                        <div>
                          &#2547;
                          {formatCurrency(
                            this.subTotal() +
                            this.shippingCost() +
                            this.state.platformFee
                          )}
                        </div>
                      </div>

                      <div className="py-5">
                        <div className="flex items-center gap-2">
                          <Radio
                            name="payment"
                            value="Cash on delivery"
                            checked={
                              this.state.paymentMethod === "Cash on delivery"
                            }
                            onChange={() =>
                              this.setState({
                                paymentMethod: "Cash on delivery",
                              })
                            }
                          />
                          <label>Cash on delivery</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Radio
                            name="payment"
                            value="Online"
                            checked={this.state.paymentMethod === "Online"}
                            onChange={() =>
                              this.setState({ paymentMethod: "Online" })
                            }
                          />
                          <label>Pay Online</label>
                        </div>
                      </div>

                      <Button
                        type="default"
                        text="Checkout"
                        className="w-full"
                        disabled={this.state.orderLoading}
                        onClick={() => this.onSubmit()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  }
);
