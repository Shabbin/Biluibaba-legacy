"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Button from "@/src/components/ui/button";
import FeatureProducts from "../_components/home/FeatureProducts";

import { Delete, HeartOutline, Heart } from "@/src/components/svg";

interface CartItem {
  id: string;
  slug: string;
  name: string;
  src: string;
  price: number;
  originalPrice: number;
  discount: number;
  size: string;
  quantity: number;
}

interface WishlistItem {
  name: string;
  src: string;
  price: number;
  discount: number;
  slug: string;
  size: string;
}

interface CartTotal {
  total: number;
  discount: number;
}

const Cart: React.FC = () => {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [wishListItems, setWishListItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    // Retrieve cart items from localStorage
    const storedCart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);

    // Retrieve wishlist items from localStorage
    const storedWishlist: WishlistItem[] = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );
    setWishListItems(storedWishlist);
    setLoading(false);
  }, []);

  const handleQuantityChange = (id: string, quantity: number): void => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDelete = (slug: string): void => {
    const updatedCart = cartItems.filter((item) => item.slug !== slug);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDeleteSelected = (): void => {
    const updatedCart = cartItems.filter((item) => !selectedItems.includes(item.id));
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setSelectedItems([]);
  };

  const handleSelectItem = (id: string): void => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleWishlistClick = (item: CartItem): void => {
    if (wishListItems.some((wishlistItem) => wishlistItem.slug === item.slug)) {
      // Remove from wishlist
      const updatedWishlist = wishListItems.filter(
        (wishlistItem) => wishlistItem.slug !== item.slug
      );
      setWishListItems(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      toast.success("Removed from wishlist");
    } else {
      // Add to wishlist
      const wishlistItem: WishlistItem = {
        name: item.name,
        src: item.src,
        price: item.price,
        discount: item.discount,
        slug: item.slug,
        size: item.size,
      };
      const updatedWishlist = [...wishListItems, wishlistItem];
      setWishListItems(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      toast.success("Added to wishlist");
    }
  };

  const handleSelectAll = (): void => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const calculateTotal = (): CartTotal => {
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

  if (loading) {
    return null;
  }

  return (
    <div className="bg-neutral-100">
      <div className="container mx-auto p-6">
        {cartItems.length === 0 ? (
          <div className="text-center flex flex-col items-center justify-center">
            <img src="/empty-cart.webp" className="w-[400px] mx-auto mb-5" alt="Empty cart" />
            <div className="text-zinc-700 font-bold text-xl mb-5">Your cart is empty!</div>
            <p className="mb-5 text-zinc-600 text-md mx-10">
              Looks like you haven&apos;t added anything to your cart. Go explore and add
              product to the cart
            </p>

            <Button
              text="Continue shopping"
              type="default"
              onClick={() => (window.location.href = "/products?pet=cat")}
            />
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-5 bg-white px-5 py-8 rounded-lg">
                  <div className="flex items-center gap-5">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cartItems.length}
                      onChange={handleSelectAll}
                      className="w-5 h-5 accent-black cursor-pointer"
                    />
                    <div className="text-gray-500">
                      Select All ({cartItems.length} Items)
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-all ease-in-out duration-300 cursor-pointer">
                    <Delete className="text-[1.8em]" />
                    <button onClick={handleDeleteSelected}>Delete</button>
                  </div>
                </div>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border rounded-lg mb-4 py-10 px-5"
                  >
                    <div className="mb-2 flex flex-row justify-end items-center gap-1">
                      <div
                        className="text-gray-500 cursor-pointer hover:text-red-500 transition-all ease-in-out duration-300"
                        onClick={() => handleWishlistClick(item)}
                      >
                        {wishListItems.some((product) => product.slug === item.slug) ? (
                          <div className="text-red-500">
                            <Heart className="text-[1.5em]" />
                          </div>
                        ) : (
                          <HeartOutline className="text-[1.5em]" />
                        )}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-gray-500 hover:text-red-500 transition-all ease-in-out duration-300 cursor-pointer">
                        <Delete className="text-[1.8em]" />
                        <button onClick={() => handleDelete(item.slug)}>Delete</button>
                      </div>
                    </div>
                    <div className="flex md:flex-row flex-col items-center justify-between">
                      <div className="flex items-center justify-between">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="w-5 h-5 accent-black cursor-pointer basis-1/8"
                        />
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="ml-4 flex flex-col gap-2 basis-2/3">
                          <h3 className="text-lg">{item.name}</h3>
                          <p className="text-sm text-gray-600">Size: {item.size} grams</p>
                          <p className="text-2xl text-black font-bold">
                            ৳{item.price * item.quantity}
                            {item.discount > 0 && (
                              <>
                                <span className="line-through text-gray-400 text-sm ms-2">
                                  ৳{item.originalPrice * item.quantity}
                                </span>{" "}
                                <span className="text-green-600 text-sm ms-2">
                                  ৳{(item.originalPrice - item.price) * item.quantity} Saved
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:w-auto w-full md:pt-0 pt-5">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="px-2 py-1 border rounded-l"
                          >
                            -
                          </button>
                          <div className="px-4 py-1 border-t border-b">{item.quantity}</div>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-2 py-1 border rounded-r"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-span-1">
                <div className="bg-white rounded-lg p-5 mb-5">
                  <div className="flex flex-row items-center justify-between border-dotted border-b-2 py-5">
                    <div className="flex items-center gap-2">
                      <img src="/coupon.png" alt="coupon" className="w-8 h-8" />
                      <div>
                        <div className="text-sm uppercase">Whiskas</div>
                        <div className="text-xs text-green-500">
                          Save ৳234 using this coupon
                        </div>
                      </div>
                    </div>
                    <Button text="Apply" type="default" className="!py-2 !px-8" />
                  </div>
                  <div className="text-green-700 text-center cursor-pointer pt-5">
                    View all Coupons &gt;
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-white">
                  <h2 className="font-bold text-lg mb-4 border-b-2 pb-2">
                    Price Details ( {cartItems.length} items )
                  </h2>
                  <div className="flex justify-between mb-2">
                    <span>Total Taka</span>
                    <span>৳{total}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Discount</span>
                    <span className="text-green-600">-৳{discount}</span>
                  </div>
                  <div className="flex justify-between mb-2 border-b-2 pb-2">
                    <span>Platform Fee</span>
                    <span>৳10</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>৳{total - discount + 10}</span>
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
            </div>
            <div className="py-10">
              <div className="text-center md:text-5xl text-4xl font-bold">
                Last Minutes Add-ons
              </div>
              <FeatureProducts type="featured" category="all" router={router} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
