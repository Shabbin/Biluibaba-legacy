"use client";

import React from "react";
import { FaStar } from "react-icons/fa6";
import { RatingBreakdown } from "@/src/types";

interface ProductRatingsProps {
  ratings: number;
  totalRatings: number;
  totalReviews: number;
  ratingBreakdown?: RatingBreakdown; // Made optional to prevent crashes if undefined
  simple?: boolean; // Determines if it renders full layout or just the bars
}

const ProductRatings: React.FC<ProductRatingsProps> = ({
  ratings,
  totalRatings,
  totalReviews,
  ratingBreakdown,
  simple = false,
}) => {
  // Safe fallback if data is missing
  const breakdown = ratingBreakdown || {
    excellent: 0,
    veryGood: 0,
    good: 0,
    average: 0,
    poor: 0,
  };

  // Format number with commas
  const formatNumber = (num: number): string => {
    return Number(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate percentage for progress bars
  const calculatePercentage = (value: number, total: number): number => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  // Rating bar configurations
  const ratingBars = [
    { label: "Excellent", key: "excellent", color: "bg-emerald-500" },
    { label: "Very Good", key: "veryGood", color: "bg-green-400" },
    { label: "Good", key: "good", color: "bg-yellow-400" },
    { label: "Average", key: "average", color: "bg-orange-400" },
    { label: "Poor", key: "poor", color: "bg-red-500" },
  ];

  // Reusable bars component for both layouts
  const BarsUI = (
    <div className="flex flex-col gap-3.5 w-full">
      {ratingBars.map((bar) => {
        // Asserting key as keyof to satisfy TS
        const val = breakdown[bar.key as keyof RatingBreakdown] || 0;
        const pct = calculatePercentage(val, totalRatings);
        
        return (
          <div key={bar.key} className="flex items-center gap-3">
            <span 
              className={`text-right ${simple ? 'w-16 text-xs text-gray-500' : 'w-24 text-sm font-bold text-petzy-slate'}`}
            >
              {bar.label}
            </span>
            
            <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full ${bar.color} transition-all duration-1000 ease-out`}
                style={{ width: `${pct}%` }}
              />
            </div>
            
            <span 
              className={`text-left ${simple ? 'w-8 text-xs text-gray-400' : 'w-12 text-sm font-medium text-gray-500'}`}
            >
              {formatNumber(val)}
            </span>
          </div>
        );
      })}
    </div>
  );

  // If simple is true, only return the progress bars (used in sidebars)
  if (simple) {
    return BarsUI;
  }

  // Full detailed view
  return (
    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 w-full mx-auto">
      
      <div className="mb-10">
         <h2 className="text-2xl md:text-3xl font-bold text-petzy-slate flex items-center gap-3">
            <div className="w-1.5 h-6 bg-yellow-400 rounded-full"></div>
            Ratings & Reviews
         </h2>
         <p className="text-gray-500 mt-2">Transparent feedback from our verified customers.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-center">
        
        {/* Left side - Average Rating */}
        <div className="flex flex-col items-center justify-center md:w-1/3 p-8 bg-gray-50 rounded-3xl border border-gray-100 w-full shrink-0">
          <div className="text-petzy-slate text-6xl md:text-7xl font-extrabold flex items-center mb-3">
            {ratings.toFixed(1)}
          </div>
          
          <div className="flex text-yellow-400 text-2xl mb-4 gap-1">
             {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(ratings) ? "" : "text-gray-200"} />
             ))}
          </div>
          
          <div className="text-gray-500 text-sm text-center font-medium leading-relaxed">
            <span className="text-petzy-slate font-bold">{formatNumber(totalRatings)}</span> Ratings
            <br />
            <span className="text-petzy-slate font-bold">{formatNumber(totalReviews)}</span> Written Reviews
          </div>
        </div>

        {/* Right side - Rating Bars */}
        <div className="md:w-2/3 w-full">
           {BarsUI}
        </div>
        
      </div>
    </div>
  );
};

export default ProductRatings;