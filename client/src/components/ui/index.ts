// Modern UI Component Library
// Import all components from a single location

// Core Components
export { default as Badge } from "./badge";
export { default as Button } from "./button";
export { default as Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";

// Form Components
export { default as Input } from "./input";
export { default as Select } from "./select";
export { default as Textarea } from "./textarea";
export { default as Quantity } from "./quantity";

// Feedback Components
export { 
  default as Skeleton, 
  ProductSkeleton, 
  AdoptionSkeleton, 
  VetProfileSkeleton, 
  OrderSkeleton, 
  ReviewSkeleton, 
  CartItemSkeleton, 
  CardSkeleton 
} from "./skeleton";
export { default as Spinner, PageLoader, ButtonSpinner } from "./spinner";
export { Toast, ToastProvider, ToastViewport, ToastAction, ToastClose, ToastTitle, ToastDescription } from "./toast";
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
} from "./empty-state";

// Layout Components
export { default as Divider } from "./divider";
export { WavyDivider } from "./dividers";

// SVG/Icon Components (if needed, add them here)
// export * from "./svg";

/**
 * Usage Examples:
 * 
 * // Single import
 * import { Badge, Button, Card } from "@/src/components/ui";
 * 
 * // With subcomponents
 * import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui";
 * 
 * // Specific imports
 * import { ProductSkeleton, PageLoader } from "@/src/components/ui";
 * 
 * // Empty states
 * import { EmptyCart, NoProductsFound } from "@/src/components/ui";
 * 
 * // Skeletons by type
 * import { CardSkeleton } from "@/src/components/ui";
 * <CardSkeleton count={8} type="product" />
 */
