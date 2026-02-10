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
    <div className="md:max-w-[350px] max-w-full h-full bg-white rounded-3xl shadow-soft p-4 border border-gray-100">
      <Skeleton variant="shimmer" className="w-full h-[200px] md:h-[300px] mb-4" />
      <div className="flex gap-2 mb-3">
        <Skeleton variant="shimmer" className="w-16 h-5 rounded-pill" />
        <Skeleton variant="shimmer" className="w-20 h-5 rounded-pill" />
      </div>
      <Skeleton variant="shimmer" className="w-3/4 h-6 mb-2" />
      <Skeleton variant="shimmer" className="w-full h-4 mb-2" />
      <Skeleton variant="shimmer" className="w-2/3 h-4 mb-4" />
      <div className="flex justify-between items-center mb-3">
        <Skeleton variant="shimmer" className="w-24 h-8" />
        <Skeleton variant="shimmer" className="w-20 h-6" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="shimmer" className="flex-1 h-10 rounded-pill" />
        <Skeleton variant="shimmer" className="w-10 h-10 rounded-full" />
      </div>
    </div>
  );
};

export const AdoptionSkeleton = () => {
  return (
    <div className="max-w-[350px] w-full bg-white rounded-3xl shadow-soft overflow-hidden border border-gray-100">
      <Skeleton variant="shimmer" className="w-full h-[280px] rounded-none" />
      <div className="p-4">
        <div className="flex gap-2 mb-3">
          <Skeleton variant="shimmer" className="w-16 h-5 rounded-pill" />
          <Skeleton variant="shimmer" className="w-16 h-5 rounded-pill" />
        </div>
        <Skeleton variant="shimmer" className="w-3/4 h-7 mb-2" />
        <Skeleton variant="shimmer" className="w-1/2 h-5 mb-3" />
        <div className="space-y-2 mb-4">
          <Skeleton variant="shimmer" className="w-full h-4" />
          <Skeleton variant="shimmer" className="w-5/6 h-4" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="shimmer" className="flex-1 h-11 rounded-pill" />
          <Skeleton variant="shimmer" className="w-11 h-11 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const VetProfileSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl shadow-soft p-6 border border-gray-100">
      <div className="flex gap-4 mb-4">
        <Skeleton variant="shimmer" className="w-20 h-20 rounded-full" />
        <div className="flex-1">
          <Skeleton variant="shimmer" className="w-2/3 h-6 mb-2" />
          <Skeleton variant="shimmer" className="w-1/2 h-4 mb-2" />
          <Skeleton variant="shimmer" className="w-24 h-4" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <Skeleton variant="shimmer" className="w-full h-4" />
        <Skeleton variant="shimmer" className="w-4/5 h-4" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton variant="shimmer" className="w-28 h-8" />
        <Skeleton variant="shimmer" className="w-32 h-10 rounded-pill" />
      </div>
    </div>
  );
};

export const OrderSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Skeleton variant="shimmer" className="w-32 h-5 mb-2" />
          <Skeleton variant="shimmer" className="w-48 h-4" />
        </div>
        <Skeleton variant="shimmer" className="w-24 h-6 rounded-pill" />
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex gap-3">
          <Skeleton variant="shimmer" className="w-16 h-16 rounded-xl" />
          <div className="flex-1">
            <Skeleton variant="shimmer" className="w-2/3 h-5 mb-2" />
            <Skeleton variant="shimmer" className="w-1/3 h-4" />
          </div>
        </div>
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <Skeleton variant="shimmer" className="w-20 h-4" />
          <Skeleton variant="shimmer" className="w-24 h-5" />
        </div>
      </div>
    </div>
  );
};

export const ReviewSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <div className="flex gap-3 mb-3">
        <Skeleton variant="shimmer" className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton variant="shimmer" className="w-32 h-5 mb-2" />
          <Skeleton variant="shimmer" className="w-24 h-4" />
        </div>
      </div>
      <Skeleton variant="shimmer" className="w-full h-4 mb-2" />
      <Skeleton variant="shimmer" className="w-5/6 h-4 mb-2" />
      <Skeleton variant="shimmer" className="w-4/6 h-4" />
    </div>
  );
};

export const CartItemSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft border border-gray-100 flex gap-4">
      <Skeleton variant="shimmer" className="w-24 h-24 rounded-xl" />
      <div className="flex-1">
        <Skeleton variant="shimmer" className="w-2/3 h-6 mb-2" />
        <Skeleton variant="shimmer" className="w-1/3 h-5 mb-3" />
        <div className="flex justify-between items-center">
          <Skeleton variant="shimmer" className="w-24 h-8" />
          <Skeleton variant="shimmer" className="w-20 h-5" />
        </div>
      </div>
    </div>
  );
};

export const CardSkeleton = ({ count = 1, type = "product" }) => {
  const SkeletonComponent = {
    product: ProductSkeleton,
    adoption: AdoptionSkeleton,
    vet: VetProfileSkeleton,
    order: OrderSkeleton,
    review: ReviewSkeleton,
    cart: CartItemSkeleton,
  }[type] || ProductSkeleton;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </>
  );
};

export default Skeleton;
