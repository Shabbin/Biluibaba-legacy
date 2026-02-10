"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { 
  FaXmark, 
  FaTrashCan, 
  FaMinus, 
  FaPlus, 
  FaBagShopping, 
  FaArrowRight 
} from "react-icons/fa6";

import Button from "@/src/components/ui/button";

const Cart = ({ toggle, toggler }) => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // --- 1. Load & Sync Cart Data ---
  const fetchCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  };

  useEffect(() => {
    setIsClient(true);
    fetchCart();

    // Listen for storage events (triggered by Product page adds or other tabs)
    const handleStorageChange = () => fetchCart();
    
    // 'storage' event fires on other tabs, custom 'cart-updated' or manual dispatch for same tab
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cart-updated", handleStorageChange); 

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cart-updated", handleStorageChange);
    };
  }, [toggle]);

  // --- 2. Cart Logic Handlers ---
  const updateQuantity = (id, change) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    saveAndNotify(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    saveAndNotify(updatedCart);
  };

  const saveAndNotify = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage")); // Notify other components
  };

  // --- 3. Calculations ---
  const subTotal = cart.reduce((total, item) => total + item.quantity * item.price, 0);
  const totalWeight = cart.reduce((total, item) => total + item.quantity * (item.size || 0), 0);

  if (!isClient) return null;

  return (
    <>
      {/* --- Backdrop Overlay --- */}
      <div
        className={`fixed inset-0 bg-petzy-slate/60 backdrop-blur-sm z-[90] transition-opacity duration-500 ${
          toggle ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => toggler(false)}
      />

      {/* --- Drawer Container --- */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[100] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${
          toggle ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="bg-petzy-coral/10 p-2 rounded-lg text-petzy-coral">
               <FaBagShopping className="text-xl" />
            </div>
            <span className="text-xl font-bold text-petzy-slate">
              My Cart <span className="text-sm font-medium text-petzy-slate-light">({cart.length} items)</span>
            </span>
          </div>
          <button
            onClick={() => toggler(false)}
            className="p-2 hover:bg-gray-100 rounded-full text-petzy-slate transition-colors"
          >
            <FaXmark size="1.5em" />
          </button>
        </div>

        {/* Scrollable Items Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-200">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
                 <FaBagShopping className="text-4xl" />
              </div>
              <h3 className="text-lg font-bold text-petzy-slate mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mb-8 max-w-[200px]">Looks like you haven't added anything to your cart yet.</p>
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
                  className="group flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  {/* Image */}
                  <div className="w-20 h-20 shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100 p-1">
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
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Remove Item"
                      >
                        <FaTrashCan size="0.9em" />
                      </button>
                    </div>

                    <div className="text-xs text-gray-400 font-medium mt-1">
                      {item.size ? `${item.size}g` : 'Standard Pack'}
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      <span className="font-bold text-petzy-coral text-lg">৳{item.price * item.quantity}</span>
                      
                      {/* Quantity Control */}
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-8 shadow-inner">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-petzy-slate hover:bg-gray-200 rounded-l-lg transition-colors disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus size="0.7em"/>
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-petzy-slate">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-petzy-slate hover:bg-gray-200 rounded-r-lg transition-colors"
                        >
                          <FaPlus size="0.7em" />
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
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm text-petzy-slate-light font-medium">
                <span>Total Weight</span>
                <span>{totalWeight}g</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-petzy-slate">
                <span>Subtotal</span>
                <span>৳{subTotal}</span>
              </div>
              <div className="text-[10px] text-gray-400 text-center uppercase tracking-wide">
                Shipping & taxes calculated at checkout
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                text="Checkout Now"
                icon={<FaArrowRight />}
                className="w-full !py-4 shadow-lg shadow-petzy-coral/30 hover:shadow-petzy-coral/40 transform active:scale-95 transition-all"
                onClick={() => router.push("/checkout")}
              />
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