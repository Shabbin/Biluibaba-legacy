"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaStar,
  FaXmark,
  FaCheck,
  FaMinus,
  FaPlus,
  FaCartPlus
} from "react-icons/fa6";

import Button from "@/src/components/ui/button";
import { formatCurrency } from "@/src/lib/currency";

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    setIsAdding(true);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        src: product.src,
        price: product.discount > 0 
          ? product.price - (product.price * product.discount) / 100 
          : product.price,
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Dispatch event so Navbar can update count without reload
    window.dispatchEvent(new Event("storage"));
    
    setTimeout(() => {
      setIsAdding(false);
      toast.success(
        <div className="flex items-center gap-2">
           <span className="bg-petzy-coral text-white rounded-full p-1"><FaCheck size={10}/></span>
           <span>Added <b>{product.name}</b> to cart</span>
        </div>
      );
      onClose();
    }, 600);
  };

  const discountedPrice = product.discount > 0 
    ? Math.floor(product.price - (product.price * product.discount) / 100) 
    : product.price;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-petzy-slate/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-petzy-coral hover:text-white transition-colors"
        >
          <FaXmark size="1.2em" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 relative">
           <div className="relative w-full aspect-square mix-blend-multiply">
              <img
                src={product.src}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
              />
           </div>
           {product.discount > 0 && (
             <span className="absolute top-6 left-6 bg-petzy-coral text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-petzy-coral/30">
               {product.discount}% OFF
             </span>
           )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col h-full">
          <div className="mb-auto">
            <div className="flex items-center gap-2 mb-2">
               <span className="text-xs font-bold text-petzy-coral uppercase tracking-wider bg-petzy-coral/10 px-2 py-0.5 rounded-md">
                 {product.category}
               </span>
               <div className="flex items-center gap-1 text-yellow-400 text-sm">
                 <FaStar /> <span className="text-petzy-slate-light font-medium">4.9 (120)</span>
               </div>
            </div>

            <h2 className="text-3xl font-bold text-petzy-slate mb-4 leading-tight">{product.name}</h2>
            <p className="text-petzy-slate-light mb-6 leading-relaxed line-clamp-3">
              {product.description || "Premium quality product designed for your pet's happiness and health. Made with safe, durable materials."}
            </p>

            <div className="flex items-end gap-3 mb-8">
              <span className="text-4xl font-bold text-petzy-slate">৳{formatCurrency(discountedPrice)}</span>
              {product.discount > 0 && (
                <span className="text-lg text-gray-400 line-through mb-1.5">৳{formatCurrency(product.price)}</span>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Controls */}
            <div className="flex items-center gap-6">
              <div className="flex items-center border border-gray-200 rounded-full p-1">
                 <button 
                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
                   className="w-10 h-10 flex items-center justify-center text-petzy-slate hover:text-petzy-coral transition-colors"
                 >
                   <FaMinus size="0.8em" />
                 </button>
                 <span className="w-8 text-center font-bold text-petzy-slate">{quantity}</span>
                 <button 
                   onClick={() => setQuantity(quantity + 1)}
                   className="w-10 h-10 flex items-center justify-center text-petzy-slate hover:text-petzy-coral transition-colors"
                 >
                   <FaPlus size="0.8em" />
                 </button>
              </div>
              <div className="text-sm text-green-500 font-bold flex items-center gap-1">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 In Stock
              </div>
            </div>

            {/* Action Button */}
            <Button 
               text={isAdding ? "Adding..." : "Add to Cart"}
               icon={!isAdding && <FaCartPlus />} 
               onClick={handleAddToCart}
               className="w-full !py-4 text-lg shadow-xl shadow-petzy-coral/20 hover:shadow-petzy-coral/40"
            />
            
            <div className="text-xs text-center text-gray-400">
               Free shipping on orders over ৳2000 • 30 Day Returns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
