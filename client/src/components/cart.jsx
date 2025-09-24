"use client";

import React from "react";

import Button from "@/src/components/ui/button";

import { IoCloseOutline } from "react-icons/io5";

export default class Cart extends React.Component {
  constructor(props) {
    super(props);

    const savedCart =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("cart") || "[]")
        : [];

    this.state = {
      loading: typeof window === "undefined",
      cart: savedCart,
    };

    this.subTotal = this.subTotal.bind(this);
    this.subtTotalWeight = this.subtTotalWeight.bind(this);
  }

  componentDidMount() {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    this.setState({
      loading: false,
      cart: savedCart,
    });
  }

  subTotal() {
    if (!Array.isArray(this.state.cart) || this.state.cart.length <= 0)
      return 0;
    return this.state.cart.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  }

  subtTotalWeight() {
    if (!Array.isArray(this.state.cart) || this.state.cart.length <= 0)
      return 0;
    return this.state.cart.reduce(
      (total, item) => total + item.quantity * item.size,
      0
    );
  }

  render() {
    return this.state.loading ? null : (
      <div
        className={
          "z-50 bg-white h-screen md:w-1/4 w-full shadow-2xl fixed top-0 transition-all ease-in-out duration-500 overflow-y-auto pb-10 " +
          (this.props.toggle ? "right-0" : "-right-full")
        }
      >
        <div
          className={
            this.props.toggle ? "fixed w-full h-full top-0 left-0 -z-10" : ""
          }
          onClick={() => this.props.toggler(false)}
        ></div>
        <div className="p-10 z-40 w-full h-screen">
          <div className="flex flex-row justify-between items-center">
            <div className="text-xl font-bold">Cart</div>
            <IoCloseOutline
              size="2em"
              onClick={() => this.props.toggler(false)}
              className="cursor-pointer"
            />
          </div>

          <div className="flex flex-col items-center mt-10">
            {this.state.cart?.length == 0 ? (
              <span className="font-bold text-zinc-700 py-5">No item</span>
            ) : (
              <>
                {this.state.cart?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-row flex-1 items-center gap-5 border-b-1 py-5"
                  >
                    <div
                      className="max-w-[80px] max-h-[80px] w-[80px] h-[80px] basis-1/2 border rounded-xl bg-no-repeat bg-center bg-cover"
                      style={{ backgroundImage: `url('${item.src}')` }}
                    ></div>
                    <div className="flex flex-col justify-between py-2 gap-2">
                      <div className="font-bold">{item.name}</div>
                      <div>
                        Quantity:{" "}
                        <span className="font-bold">{item.quantity}</span>
                      </div>
                      <div>
                        Weight:{" "}
                        <span className="font-bold">{item.size} grams</span>
                      </div>
                      <div>
                        Total Amount:{" "}
                        <span className="font-bold">
                          &#2547;{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex flex-row justify-between w-full mt-5 text-lg font-bold">
                  <div>Subtotal:</div>
                  <div>&#2547;{this.subTotal()}</div>
                </div>

                <div className="flex flex-row justify-between w-full mt-5 text-lg font-bold">
                  <div>Approx. Weight:</div>
                  <div>{this.subtTotalWeight()} g</div>
                </div>

                <div className="mt-5 w-full">
                  <Button
                    text="Checkout"
                    type="outline"
                    className="w-full mb-3"
                    onClick={() => (window.location.href = "/checkout")}
                  />
                  <Button
                    text="View Cart"
                    type="default"
                    className="w-full"
                    onClick={() => (window.location.href = "/my-cart")}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
