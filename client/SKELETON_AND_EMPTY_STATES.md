# Skeleton Loaders & Empty States Guide

Complete guide for using skeleton loaders and empty state components in the Biluibaba client application.

---

## 📦 Available Components

### Skeleton Loaders

All skeleton components feature **shimmer animations** for professional loading states.

#### 1. **ProductSkeleton**
```jsx
import { ProductSkeleton } from "@/src/components/ui";

<ProductSkeleton />
```
Use for: Product cards in grids, search results, category pages

#### 2. **AdoptionSkeleton**
```jsx
import { AdoptionSkeleton } from "@/src/components/ui";

<AdoptionSkeleton />
```
Use for: Pet adoption cards, adoption listings

#### 3. **VetProfileSkeleton**
```jsx
import { VetProfileSkeleton } from "@/src/components/ui";

<VetProfileSkeleton />
```
Use for: Veterinarian profile cards, vet search results

#### 4. **OrderSkeleton**
```jsx
import { OrderSkeleton } from "@/src/components/ui";

<OrderSkeleton />
```
Use for: Order history, vet bookings, transaction lists

#### 5. **ReviewSkeleton**
```jsx
import { ReviewSkeleton } from "@/src/components/ui";

<ReviewSkeleton />
```
Use for: Product reviews, vet reviews, testimonials

#### 6. **CartItemSkeleton**
```jsx
import { CartItemSkeleton } from "@/src/components/ui";

<CartItemSkeleton />
```
Use for: Shopping cart items, wishlist items

#### 7. **CardSkeleton (Multi-Type)**
```jsx
import { CardSkeleton } from "@/src/components/ui";

// Renders multiple skeletons of any type
<CardSkeleton count={8} type="product" />
<CardSkeleton count={4} type="adoption" />
<CardSkeleton count={6} type="vet" />
<CardSkeleton count={3} type="order" />
<CardSkeleton count={5} type="review" />
<CardSkeleton count={2} type="cart" />
```
**Most versatile** - use this for rendering multiple loading items at once.

---

## 🎨 Empty State Components

### Preset Empty States

#### 1. **NoProductsFound**
```jsx
import { NoProductsFound } from "@/src/components/ui";

<NoProductsFound onReset={() => clearFilters()} />
```
Shows: 🔍 icon, "No Products Found" message, "Reset Filters" button

#### 2. **NoAdoptionsFound**
```jsx
import { NoAdoptionsFound } from "@/src/components/ui";

<NoAdoptionsFound onReset={() => clearFilters()} />
```
Shows: 🐾 icon, "No Pets Available" message, "Clear Filters" button

#### 3. **NoVetsFound**
```jsx
import { NoVetsFound } from "@/src/components/ui";

<NoVetsFound onReset={() => router.push("/vets")} />
```
Shows: 👨‍⚕️ icon, "No Vets Available" message, "Reset Search" button

#### 4. **EmptyCart**
```jsx
import { EmptyCart } from "@/src/components/ui";

<EmptyCart />
```
Shows: 🛒 icon, "Your Cart is Empty" message, "Start Shopping" button (links to /products)

#### 5. **EmptyWishlist**
```jsx
import { EmptyWishlist } from "@/src/components/ui";

<EmptyWishlist />
```
Shows: ❤️ icon, "Your Wishlist is Empty" message, "Browse Products" button

#### 6. **NoOrders**
```jsx
import { NoOrders } from "@/src/components/ui";

<NoOrders />
```
Shows: 📦 icon, "No Orders Yet" message, "Start Shopping" button

#### 7. **NoBookings**
```jsx
import { NoBookings } from "@/src/components/ui";

<NoBookings />
```
Shows: 📅 icon, "No Appointments" message, "Find a Vet" button (links to /vets)

#### 8. **NoReviews**
```jsx
import { NoReviews } from "@/src/components/ui";

<NoReviews />
```
Shows: ⭐ icon, "No Reviews Yet" message, no action button

#### 9. **NoSearchResults**
```jsx
import { NoSearchResults } from "@/src/components/ui";

<NoSearchResults query={searchQuery} />
```
Shows: 🔍 icon, custom message with search query, "Browse All Products" button

### Custom Empty State

```jsx
import EmptyState from "@/src/components/ui";

<EmptyState
  icon="🎁"
  title="Custom Title"
  description="Custom description text"
  action={() => handleAction()}  // or action="/path/to/page"
  actionText="Custom Button Text"
  variant="default"  // "default" | "error" | "warning" | "info"
/>
```

**Action can be:**
- A function: `action={() => doSomething()}`
- A URL string: `action="/products"` (uses Next.js router.push)

**Variants:**
- `default` - Coral icon on blue background (Petzy brand colors)
- `error` - Red theme
- `warning` - Amber theme
- `info` - Blue theme

---

## 📝 Usage Patterns

### Pattern 1: Products Page
```jsx
import { CardSkeleton, NoProductsFound } from "@/src/components/ui";

{loading ? (
  <CardSkeleton count={8} type="product" />
) : products.length === 0 ? (
  <NoProductsFound onReset={() => clearFilters()} />
) : (
  products.map(product => <Product key={product._id} {...product} />)
)}
```

### Pattern 2: Adoptions Page
```jsx
import { CardSkeleton, NoAdoptionsFound } from "@/src/components/ui";

{loading ? (
  <div className="flex flex-wrap gap-5">
    <CardSkeleton count={8} type="adoption" />
  </div>
) : adoptions.length === 0 ? (
  <NoAdoptionsFound onReset={handleClearFilters} />
) : (
  <div className="flex flex-wrap gap-5">
    {adoptions.map(pet => <AdoptionCard key={pet._id} {...pet} />)}
  </div>
)}
```

### Pattern 3: Cart Page
```jsx
import { CartItemSkeleton, EmptyCart } from "@/src/components/ui";

{loading ? (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <CartItemSkeleton key={i} />
    ))}
  </div>
) : cartItems.length === 0 ? (
  <EmptyCart />
) : (
  <div className="space-y-4">
    {cartItems.map(item => <CartItem key={item.id} {...item} />)}
  </div>
)}
```

### Pattern 4: Orders/Bookings Page
```jsx
import { OrderSkeleton, NoOrders } from "@/src/components/ui";

{loading ? (
  <div className="space-y-4">
    <OrderSkeleton />
    <OrderSkeleton />
    <OrderSkeleton />
  </div>
) : orders.length === 0 ? (
  <NoOrders />
) : (
  <table>
    {orders.map(order => <OrderRow key={order._id} {...order} />)}
  </table>
)}
```

### Pattern 5: Reviews Section
```jsx
import { ReviewSkeleton, NoReviews } from "@/src/components/ui";

{currentReviews.length === 0 ? (
  <NoReviews />
) : (
  currentReviews.map(review => <Review key={review._id} {...review} />)
)}
```

### Pattern 6: Search Results
```jsx
import { CardSkeleton, NoSearchResults } from "@/src/components/ui";

{loading ? (
  <div className="flex flex-wrap gap-4">
    <CardSkeleton count={8} type="product" />
  </div>
) : results.length === 0 && query ? (
  <NoSearchResults query={query} />
) : (
  <div className="flex flex-wrap gap-4">
    {results.map(item => <ProductCard key={item._id} {...item} />)}
  </div>
)}
```

---

## ✅ Implementation Checklist

Files already updated with proper skeletons and empty states:

### Pages
- ✅ `/best-deals/page.jsx` - ProductSkeleton + NoProductsFound
- ✅ `/search/search.jsx` - ProductSkeleton + NoSearchResults
- ✅ `/adoptions/page.jsx` - AdoptionSkeleton + NoAdoptionsFound
- ✅ `/vets/browse/vet.jsx` - VetProfileSkeleton + NoVetsFound
- ✅ `/my-cart/page.jsx` - CartItemSkeleton + EmptyCart
- ✅ `/wishlist/page.jsx` - ProductSkeleton + EmptyWishlist
- ✅ `/my-account/orders/order.jsx` - OrderSkeleton + NoOrders
- ✅ `/my-account/vet/vet.jsx` - OrderSkeleton + NoBookings
- ✅ `/products/[slug]/product.jsx` - NoReviews
- ✅ `/vets/[id]/vet.jsx` - NoReviews

---

## 🎯 Best Practices

### 1. **Always show loading states**
```jsx
// ❌ Bad - no loading indicator
{data.map(item => <Card {...item} />)}

// ✅ Good - clear loading state
{loading ? <CardSkeleton count={4} /> : data.map(item => <Card {...item} />)}
```

### 2. **Match skeleton count to expected results**
```jsx
// Products page: 8 skeletons (typical grid)
<CardSkeleton count={8} type="product" />

// Cart page: 2-3 skeletons (typical cart size)
<CartItemSkeleton />
<CartItemSkeleton />
<CartItemSkeleton />
```

### 3. **Use appropriate skeleton type**
```jsx
// ❌ Wrong type
<CardSkeleton count={4} type="product" />  // for vet listings

// ✅ Correct type
<CardSkeleton count={4} type="vet" />
```

### 4. **Provide reset/action handlers**
```jsx
// ❌ No way to recover
<NoProductsFound />

// ✅ User can take action
<NoProductsFound onReset={() => clearFilters()} />
```

### 5. **Consistent empty state messages**
Use the preset components whenever possible for consistency across the app.

---

## 🚀 Quick Reference

```jsx
// Import everything you need
import {
  // Skeletons
  ProductSkeleton,
  AdoptionSkeleton,
  VetProfileSkeleton,
  OrderSkeleton,
  ReviewSkeleton,
  CartItemSkeleton,
  CardSkeleton,
  
  // Empty States
  EmptyState,
  NoProductsFound,
  NoAdoptionsFound,
  NoVetsFound,
  EmptyCart,
  EmptyWishlist,
  NoOrders,
  NoBookings,
  NoReviews,
  NoSearchResults
} from "@/src/components/ui";
```

---

## 🎨 Visual Design

All components follow the **Petzy design system**:
- **Shimmer animations** for skeletons (gradient sweep effect)
- **Rounded corners** (border-radius: 1.5rem)
- **Soft shadows** for depth
- **Coral accent color** (#FF8A80) for primary actions
- **Professional spacing** and typography

---

**🎉 Never show empty containers or plain "Loading..." text again!**
