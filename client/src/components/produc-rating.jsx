import React from "react";

const ProductRatings = ({
  ratings,
  totalRatings,
  totalReviews,
  ratingBreakdown,
}) => {
  // Extract rating data from the product
  const {
    excellent = 0,
    veryGood = 0,
    good = 0,
    average = 0,
    poor = 0,
  } = ratingBreakdown;

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate percentage for progress bars
  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  // Rating bar configurations
  const ratingBars = [
    { label: "Excellent", key: "excellent", color: "bg-green-600" },
    { label: "Very Good", key: "veryGood", color: "bg-green-500" },
    { label: "Good", key: "good", color: "bg-yellow-400" },
    { label: "Average", key: "average", color: "bg-orange-400" },
    { label: "Poor", key: "poor", color: "bg-red-500" },
  ];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm mx-auto py-10">
      <h2 className="text-4xl font-bold text-center mb-12">
        Product Ratings & Reviews
      </h2>

      <div className="flex flex-col md:flex-row gap-10 py-10">
        {/* Left side - Average Rating */}
        <div className="flex flex-col items-center justify-center md:w-1/3">
          <div className="text-green-600 text-7xl font-semibold flex items-center">
            {ratings.toFixed(1)}
            <span className="text-5xl ml-2">★</span>
          </div>
          <div className="text-gray-400 text-xl text-center mt-4">
            {formatNumber(totalRatings)} Ratings,
            <br />
            {formatNumber(totalReviews)} Reviews
          </div>
        </div>

        {/* Right side - Rating Bars */}
        <div className="md:w-2/3 flex flex-col gap-4">
          {ratingBars.map((bar) => (
            <div
              key={bar.key}
              className="grid grid-cols-[120px_1fr_60px] items-center gap-4"
            >
              <span className="text-right text-gray-700">{bar.label}</span>
              <div className="bg-gray-100 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${bar.color}`}
                  style={{
                    width: `${calculatePercentage(
                      ratingBreakdown[bar.key],
                      totalRatings
                    )}%`,
                  }}
                ></div>
              </div>
              <span className="text-gray-400">
                {formatNumber(ratingBreakdown[bar.key])}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductRatings;
