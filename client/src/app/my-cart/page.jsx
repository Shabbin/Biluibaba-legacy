"use client";

import { useState, useEffect } from "react";

import Button from "@/src/components/ui/button";
import Link from "next/link";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve cart items from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
    setLoading(false);
  }, []);

  const handleQuantityChange = (id, quantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDelete = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDeleteSelected = () => {
    const updatedCart = cartItems.filter(
      (item) => !selectedItems.includes(item.id)
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setSelectedItems([]);
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (acc, item) => {
        const totalPrice = item.price * item.quantity;
        const discount = (item.originalPrice - item.price) * item.quantity;
        return {
          total: acc.total + totalPrice,
          discount: acc.discount + discount,
        };
      },
      { total: 0, discount: 0 }
    );
  };

  const { total, discount } = calculateTotal();

  return (
    <div className="container mx-auto p-6">
      {loading ? null : cartItems.length === 0 ? (
        <div className="text-center flex flex-col items-center justify-center">
          <img src="/empty-cart.webp" className="w-[400px] mx-auto mb-5" />
          <div className="text-zinc-700 font-bold text-xl mb-5">
            Your cart is empty!
          </div>
          <p className="mb-5 text-zinc-600 text-md mx-10">
            Looks like you haven’t added anything to your cart. Go explore and
            add product to the cart
          </p>

          <Button
            text="Continue shopping"
            type="default"
            onClick={() => (window.location.href = "/products?pet=cat")}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <input
                  type="checkbox"
                  checked={selectedItems.length === cartItems.length}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                <span>Select All ({cartItems.length} Items)</span>
              </div>
              <button
                onClick={handleDeleteSelected}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex md:flex-row flex-col items-center justify-between p-4 border rounded-lg mb-4 py-10"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="mr-4"
                  />
                  <img
                    src={item.src}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="ml-4 flex flex-col gap-1">
                    <h3 className="text-xl">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} grams
                    </p>
                    <p className="text-xl text-gray-600">
                      ৳{item.price * item.quantity}
                      {item.discount > 0 && (
                        <>
                          <span className="line-through text-gray-400 text-sm ms-2">
                            ৳{item.originalPrice * item.quantity}
                          </span>{" "}
                          <span className="text-green-600 text-sm ms-2">
                            ৳{(item.originalPrice - item.price) * item.quantity}{" "}
                            Saved
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between md:w-auto w-full md:pt-0 pt-5">
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className="px-2 py-1 border rounded-l"
                    >
                      -
                    </button>
                    <div className="px-4 py-1 border-t border-b">
                      {item.quantity}
                    </div>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="px-2 py-1 border rounded-r"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="ml-4 text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border rounded-lg">
            <h2 className="font-bold text-lg mb-4">Price Details</h2>
            <div className="flex justify-between mb-2">
              <span>Total Taka</span>
              <span>৳{total}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discount</span>
              <span className="text-green-600">-৳{discount}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span>৳{total - discount}</span>
            </div>
            <div className="flex">
              <Link
                className="mt-4 w-full bg-black text-white py-2 rounded-lg text-center"
                href="/checkout"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
