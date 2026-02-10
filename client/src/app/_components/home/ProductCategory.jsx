"use client";

import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

const ProductCategory = ({ categories }) => {
  return (
    <section className="bg-petzy-periwinkle-light py-20 border-b border-petzy-slate/5">
      <div className="container mx-auto px-6">
        
        {/* Header Section: Split layout for a more editorial look */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h4 className="text-petzy-coral font-bold uppercase tracking-widest text-xs mb-2 pl-1">
              Collections
            </h4>
            <h2 className="text-3xl md:text-4xl font-bold text-petzy-slate">
              Shop by Pet
            </h2>
          </div>
          <div className="hidden md:block pb-1">
             <Link 
                href="/products" 
                className="group flex items-center gap-2 text-sm font-semibold text-petzy-slate-light hover:text-petzy-coral transition-colors"
             >
                View all categories
                <FaArrowRightLong className="group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </div>

        {/* Categories Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
          {categories.map((category, index) => {
            // Extract name from link or filename if not provided explicitly in object
            const petName = category.name || category.link.split("=")[1] || "Pet";
            
            return (
              <Link 
                href={category.link} 
                key={index} 
                className="group flex flex-col items-center"
              >
                {/* Image Container - Professional Circle Design */}
                <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-white flex items-center justify-center mb-6 transition-all duration-300 ease-out shadow-sm border border-transparent group-hover:border-petzy-coral/30 group-hover:shadow-lg group-hover:shadow-petzy-coral/10">
                  
                  {/* Subtle Background Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-gray-100 rounded-full opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                  
                  {/* Image */}
                  <img
                    src={category.src}
                    alt={petName}
                    className="relative z-10 w-24 md:w-28 object-contain transition-transform duration-500 ease-out group-hover:-translate-y-2"
                  />
                  
                  {/* Active Ring Indicator (Modern UI trend) */}
                  <div className="absolute -inset-2 border border-petzy-coral/0 rounded-full transition-all duration-300 group-hover:inset-0 group-hover:border-petzy-coral/20" />
                </div>

                {/* Typography */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-petzy-slate group-hover:text-petzy-coral transition-colors duration-300 capitalize">
                    {petName}
                  </h3>
                  <span className="text-xs font-medium text-petzy-slate-light mt-1 block opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                    Browse Collection
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile-only View All Link */}
        <div className="mt-12 text-center md:hidden">
            <Link 
                href="/products" 
                className="inline-flex items-center gap-2 text-sm font-bold text-petzy-slate border-b border-petzy-slate pb-0.5 hover:text-petzy-coral hover:border-petzy-coral transition-colors"
             >
                View all categories
             </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCategory;