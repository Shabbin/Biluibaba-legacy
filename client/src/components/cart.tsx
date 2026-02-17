"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { 
  FaXmark, 
  FaTrashCan, 
  FaMinus, 
  FaPlus, 
  FaBagShopping, 
  FaArrowRight 
} from "react-icons/fa6";

import {Button} from "@/src/components/ui/button";
import { formatCurrency } from "@/src/lib/currency";

import type { CartItem } from "@/src/types";

interface CartProps {
  toggle: boolean;
  toggler: React.Dispatch<React.SetStateAction<boolean>>;
}

const Cart: React.FC<CartProps> = ({ toggle, toggler }) => {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // --- 1. Load & Sync Cart Data ---
  const fetchCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  };

  useEffect(() => {
    setIsClient(true);
    fetchCart();

    const handleStorageChange = () => fetchCart();
    
    // Listen for updates from other components
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cart-updated", handleStorageChange); 

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cart-updated", handleStorageChange);
    };
  }, [toggle]);

  // --- 2. Cart Logic Handlers ---
  const updateQuantity = (id: string, change: number) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    saveAndNotify(updatedCart);
  };

  const removeItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    saveAndNotify(updatedCart);
  };

  const saveAndNotify = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  // --- 3. Calculations ---
  const subTotal = cart.reduce((total, item) => total + item.quantity * item.price, 0);
  const totalWeight = cart.reduce((total, item) => total + item.quantity * (item.size || 0), 0);

  if (!isClient) return null;

  return (
    <>
      {/* --- Overlay (No Blur for Performance) --- */}
      <div
        className={`fixed inset-0 bg-black/60 z-[90] transition-opacity duration-300 ${
          toggle ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => toggler(false)}
      />

      {/* --- Drawer Container --- */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-white z-[100] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          toggle ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-petzy-slate">
              My Cart
            </span>
            <span className="bg-petzy-coral text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </div>
          <button
            onClick={() => toggler(false)}
            className="text-gray-400 hover:text-petzy-slate p-2 transition-colors"
          >
            <FaXmark size="1.5em" />
          </button>
        </div>

        {/* Scrollable Items Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-500">
                 <FaBagShopping className="text-3xl" />
              </div>
              <h3 className="text-lg font-bold text-petzy-slate mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mb-8 max-w-[200px]">
                Looks like you haven't added anything yet.
              </p>
              <button 
                onClick={() => toggler(false)}
                className="text-petzy-coral font-bold hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  {/* Image */}
                  <div className="w-20 h-20 shrink-0 bg-white rounded-lg overflow-hidden border border-gray-100 p-1">
                    <img
                      src={item.src}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-petzy-slate text-sm line-clamp-2 leading-tight pr-2">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove Item"
                      >
                        <FaTrashCan size="0.9em" />
                      </button>
                    </div>

                    <div className="text-xs text-gray-400 font-medium mt-1">
                      {item.size ? `${item.size}g` : 'Standard'}
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      <span className="font-bold text-petzy-coral text-base">৳{formatCurrency(item.price * item.quantity)}</span>
                      
                      {/* Quantity Control */}
                      <div className="flex items-center bg-white border border-gray-200 rounded-md h-7 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-l-md transition-colors disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus size="0.6em"/>
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-petzy-slate">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-r-md transition-colors"
                        >
                          <FaPlus size="0.6em" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (Checkout) */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm text-gray-500 font-medium">
                <span>Total Weight</span>
                <span>{totalWeight}g</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-petzy-slate">
                <span>Subtotal</span>
                <span>৳{formatCurrency(subTotal)}</span>
              </div>
              <div className="text-[11px] text-gray-400 text-center">
                Shipping & taxes calculated at checkout
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="default" // Explicitly added to restore styles
                icon={<FaArrowRight />}
                className="w-full !py-3.5 shadow-md shadow-petzy-coral/20 hover:shadow-lg hover:shadow-petzy-coral/30 active:scale-[0.98] transition-all"
                onClick={() => router.push("/checkout")}
              >
                Checkout Now
              </Button>
              <button
                onClick={() => router.push("/my-cart")}
                className="w-full py-3 text-sm font-bold text-petzy-slate-light hover:text-petzy-coral transition-colors"
              >
                View Full Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;