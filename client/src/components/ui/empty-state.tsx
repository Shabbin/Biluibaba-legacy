"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  PawPrint,
  Stethoscope,
  ShoppingCart,
  Heart,
  Package,
  CalendarDays,
  Star,
} from "lucide-react";

type EmptyStateVariant = "default" | "error" | "warning" | "info";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: string | (() => void);
  actionText?: string;
  variant?: EmptyStateVariant;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  actionText,
  variant = "default",
}) => {
  const router = useRouter();

  const handleAction = () => {
    if (typeof action === "string") {
      router.push(action);
    } else if (typeof action === "function") {
      action();
    }
  };

  const iconBg: Record<EmptyStateVariant, string> = {
    default: "bg-petzy-blue-light",
    error: "bg-red-50",
    warning: "bg-amber-50",
    info: "bg-blue-50",
  };

  const iconColor: Record<EmptyStateVariant, string> = {
    default: "text-petzy-coral",
    error: "text-red-500",
    warning: "text-amber-500",
    info: "text-blue-500",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4">
      {icon && (
        <div className={`w-24 h-24 md:w-32 md:h-32 ${iconBg[variant]} rounded-full flex items-center justify-center mb-6 shadow-soft`}>
          <div className={`${iconColor[variant]}`}>{icon}</div>
        </div>
      )}
      <h3 className="text-xl md:text-2xl font-bold text-petzy-slate mb-3 text-center">
        {title}
      </h3>
      <p className="text-sm md:text-base text-petzy-slate-light mb-6 text-center max-w-md">
        {description}
      </p>
      {action && (
        <button
          onClick={handleAction}
          className="bg-petzy-coral text-white font-bold px-8 py-3 rounded-pill hover:shadow-glow transition-all duration-300"
        >
          {actionText || "Get Started"}
        </button>
      )}
    </div>
  );
};

// Preset empty states for common scenarios

interface ResetFilterProps {
  onReset?: () => void;
}

export const NoProductsFound: React.FC<ResetFilterProps> = ({ onReset }) => (
  <EmptyState
    icon={<Search className="w-10 h-10 md:w-12 md:h-12" />}
    title="No Products Found"
    description="We couldn't find any products matching your criteria. Try adjusting your filters or search terms."
    action={onReset}
    actionText="Reset Filters"
  />
);

export const NoAdoptionsFound: React.FC<ResetFilterProps> = ({ onReset }) => (
  <EmptyState
    icon={<PawPrint className="w-10 h-10 md:w-12 md:h-12" />}
    title="No Pets Available"
    description="There are no pets available for adoption matching your search. Check back soon or try different filters."
    action={onReset}
    actionText="Clear Filters"
  />
);

export const NoVetsFound: React.FC<ResetFilterProps> = ({ onReset }) => (
  <EmptyState
    icon={<Stethoscope className="w-10 h-10 md:w-12 md:h-12" />}
    title="No Vets Available"
    description="We couldn't find any veterinarians matching your criteria. Try expanding your search area or changing your filters."
    action={onReset}
    actionText="Reset Search"
  />
);

export const EmptyCart: React.FC = () => (
  <EmptyState
    icon={<ShoppingCart className="w-10 h-10 md:w-12 md:h-12" />}
    title="Your Cart is Empty"
    description="Looks like you haven't added anything to your cart yet. Go explore and add some items!"
    action="/products"
    actionText="Start Shopping"
  />
);

export const EmptyWishlist: React.FC = () => (
  <EmptyState
    icon={<Heart className="w-10 h-10 md:w-12 md:h-12" />}
    title="Your Wishlist is Empty"
    description="Save your favorite items here for easy access later. Start exploring and add products to your wishlist!"
    action="/products"
    actionText="Browse Products"
  />
);

export const NoOrders: React.FC = () => (
  <EmptyState
    icon={<Package className="w-10 h-10 md:w-12 md:h-12" />}
    title="No Orders Yet"
    description="You haven't placed any orders yet. Start shopping to see your order history here."
    action="/products"
    actionText="Start Shopping"
  />
);

export const NoBookings: React.FC = () => (
  <EmptyState
    icon={<CalendarDays className="w-10 h-10 md:w-12 md:h-12" />}
    title="No Appointments"
    description="You don't have any vet appointments yet. Book a consultation with one of our expert veterinarians."
    action="/vets"
    actionText="Find a Vet"
  />
);

export const NoReviews: React.FC = () => (
  <EmptyState
    icon={<Star className="w-10 h-10 md:w-12 md:h-12" />}
    title="No Reviews Yet"
    description="This product doesn't have any reviews yet. Be the first to share your experience!"
    actionText=""
  />
);

interface NoSearchResultsProps {
  query?: string;
}

export const NoSearchResults: React.FC<NoSearchResultsProps> = ({ query }) => (
  <EmptyState
    icon={<Search className="w-10 h-10 md:w-12 md:h-12" />}
    title="No Results Found"
    description={`We couldn't find anything matching "${query}". Try different keywords or browse our categories.`}
    action="/products"
    actionText="Browse All Products"
    variant="info"
  />
);

export default EmptyState;
