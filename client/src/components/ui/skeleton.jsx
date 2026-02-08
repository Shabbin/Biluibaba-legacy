"use client";

const Skeleton = ({ className = "", variant = "default" }) => {
  const variants = {
    default: "bg-gray-200",
    shimmer: "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer",
    pulse: "bg-gray-200 animate-pulse",
  };

  return (
    <div
      className={`rounded-3xl ${variants[variant]} ${className}`}
      aria-label="Loading..."
    />
  );
};

export const ProductSkeleton = () => {
  return (
    <div className="md:max-w-[350px] max-w-full h-full bg-white rounded-3xl shadow-soft p-4">
      <Skeleton variant="shimmer" className="w-full h-[200px] md:h-[300px] mb-4" />
      <Skeleton variant="shimmer" className="w-3/4 h-6 mb-2" />
      <Skeleton variant="shimmer" className="w-1/2 h-4 mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton variant="shimmer" className="w-20 h-8" />
        <Skeleton variant="shimmer" className="w-24 h-10 rounded-pill" />
      </div>
    </div>
  );
};

export const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </>
  );
};

export default Skeleton;
