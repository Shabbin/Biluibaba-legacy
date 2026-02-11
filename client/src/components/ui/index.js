// Export legacy button as default for backward compatibility
export { default } from "./button-legacy";

// Export named exports from button-legacy (includes both legacy and new Button)
export { Button, buttonVariants } from "./button-legacy";

// Re-export PageLoader from ui-old for backward compatibility
export { PageLoader, ButtonSpinner } from "../ui-old/spinner";
export { default as Spinner } from "../ui-old/spinner";

// Re-export skeleton components
export { 
  default as Skeleton, 
  ProductSkeleton, 
  AdoptionSkeleton, 
  VetProfileSkeleton, 
  OrderSkeleton, 
  ReviewSkeleton, 
  CartItemSkeleton, 
  CardSkeleton 
} from "../ui-old/skeleton";

// Re-export empty state components
export { 
  default as EmptyState,
  NoProductsFound,
  NoAdoptionsFound,
  NoVetsFound,
  EmptyCart,
  EmptyWishlist,
  NoOrders,
  NoBookings,
  NoReviews,
  NoSearchResults
} from "../ui-old/empty-state";
