"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

// Icons
import { 
  FaStar, 
  FaRegHeart, 
  FaHeart, 
  FaCartPlus, 
  FaEye
} from "react-icons/fa6";

// Utils & Components
import QuickViewModal from "@/src/components/product/QuickViewModal";
import { formatCurrency } from "@/src/lib/currency";

interface ProductProps {
  id: string;
  src: string;
  name: string;
  slug: string;
  price: number;
  discount: number;
  category?: string;
  description?: string;
  review?: number;
  totalReview?: number;
}

// --- MAIN PRODUCT CARD COMPONENT ---
const Product: React.FC<ProductProps> = ({
  id,
  src,
  name,
  slug,
  price,
  discount,
  category,
  description,
  review,
  totalReview,
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  // Initialize Wishlist State
  useEffect(() => {
    const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsInWishlist(wishlistItems.some((item) => item.slug === slug));
  }, [slug]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (isInWishlist) {
      const updated = wishlistItems.filter((item) => item.slug !== slug);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setIsInWishlist(false);
      toast.error("Removed from wishlist");
    } else {
      wishlistItems.push({ name, slug, src, price, discount });
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
      setIsInWishlist(true);
      toast.success("Added to wishlist");
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;
    
    // Check if item exists to update quantity
    const existing = cart.find(item => item.id === id);
    if(existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, src, price: discountedPrice, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    toast.success("Added to cart!");
  };

  const discountedPrice = Math.floor(price - (discount > 0 ? (price * discount) / 100 : 0));

  return (
    <>
      <div 
        className="group relative bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 h-full flex flex-col"
      >
        {/* Top Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 p-4">
          
          {/* Main Image */}
          <Link href={`/products/${slug}`}>
            <img
              src={src}
              alt={name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-in-out group-hover:scale-110 cursor-pointer"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {discount > 0 && (
              <span className="bg-petzy-coral text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                -{discount}%
              </span>
            )}
            {/* Simulated 'New' badge logic */}
            {id % 2 === 0 && (
               <span className="bg-petzy-mint text-petzy-slate text-[10px] font-bold px-2 py-1 rounded-md shadow-sm bg-teal-100">
                NEW
              </span>
            )}
          </div>

          {/* Action Buttons (Right Side) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
            <button 
              onClick={toggleWishlist}
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-petzy-coral hover:bg-petzy-coral hover:text-white transition-colors"
              title="Add to Wishlist"
            >
              {isInWishlist ? <FaHeart /> : <FaRegHeart />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowQuickView(true); }}
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-petzy-slate hover:bg-petzy-slate hover:text-white transition-colors delay-75"
              title="Quick View"
            >
              <FaEye />
            </button>
          </div>

          {/* Quick Add Overlay Button */}
          <button 
            onClick={handleQuickAdd}
            className="absolute bottom-0 left-0 w-full bg-petzy-slate/90 backdrop-blur-sm text-white font-bold py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
          >
            <FaCartPlus /> Quick Add
          </button>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{category}</span>
            <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
              <FaStar /> <span>{review || 4.5}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${slug}`}>
            <h3 className="text-base font-bold text-petzy-slate mb-2 line-clamp-2 cursor-pointer hover:text-petzy-coral transition-colors">
              {name}
            </h3>
          </Link>

          {/* Price */}
          <div className="mt-auto flex items-end gap-2">
            <span className="text-xl font-extrabold text-petzy-coral">৳{formatCurrency(discountedPrice)}</span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through mb-1">৳{formatCurrency(price)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Render Modal */}
      <QuickViewModal 
        product={{ id, src, name, price, discount, category, description }} 
        isOpen={showQuickView} 
        onClose={() => setShowQuickView(false)} 
      />
    </>
  );
};

export default Product;