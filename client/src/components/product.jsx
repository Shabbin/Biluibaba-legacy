"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Icons
import { 
  FaStar, 
  FaRegHeart, 
  FaHeart, 
  FaCartPlus, 
  FaEye, 
  FaXmark,
  FaCheck,
  FaMinus,
  FaPlus
} from "react-icons/fa6";

// Utils & Components
import Button from "@/src/components/ui/button";

// --- QUICK VIEW MODAL COMPONENT ---
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
              <span className="text-4xl font-bold text-petzy-slate">৳{discountedPrice}</span>
              {product.discount > 0 && (
                <span className="text-lg text-gray-400 line-through mb-1.5">৳{product.price}</span>
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

// --- MAIN PRODUCT CARD COMPONENT ---
const Product = ({
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
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  // Initialize Wishlist State
  useEffect(() => {
    const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsInWishlist(wishlistItems.some((item) => item.slug === slug));
  }, [slug]);

  const toggleWishlist = (e) => {
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

  const handleQuickAdd = (e) => {
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
          <img
            src={src}
            alt={name}
            onClick={() => router.push(`/products/${slug}`)}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-in-out group-hover:scale-110 cursor-pointer"
          />

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
          <h3 
            onClick={() => router.push(`/products/${slug}`)}
            className="text-base font-bold text-petzy-slate mb-2 line-clamp-2 cursor-pointer hover:text-petzy-coral transition-colors"
          >
            {name}
          </h3>

          {/* Price */}
          <div className="mt-auto flex items-end gap-2">
            <span className="text-xl font-extrabold text-petzy-coral">৳{discountedPrice}</span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through mb-1">৳{price}</span>
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