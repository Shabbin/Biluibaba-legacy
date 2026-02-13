# 🎨 Skeleton & Empty State Visual Reference

## Skeleton Components - Visual Appearance

All skeletons use a **shimmer animation** with a gradient sweep effect that feels modern and responsive.

### ProductSkeleton
```
┌─────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░  │  Image area with shimmer
├─────────────────────────┤
│ ░░░░░░  ░░░░░░░░░      │  Category badges
├─────────────────────────┤
│ ░░░░░░░░░░░░░░░░       │  Product name
│ ░░░░░░░░░░░░░░         │  Description
├─────────────────────────┤
│ ░░░░░░░░  ░░░░░        │  Price and rating
├─────────────────────────┤
│ ░░░░░░░░░░░░░  ░░░░░   │  Add button + Wishlist
└─────────────────────────┘
```

### AdoptionSkeleton
```
┌─────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░  │  Pet image area
├─────────────────────────┤
│ ░░░░░░  ░░░░░░░░       │  Species/Gender badges
├─────────────────────────┤
│ ░░░░░░░░░░░░░░░        │  Pet name
│ ░░░░░░░░░░░░          │  Location
├─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░     │  Description lines
│ ░░░░░░░░░░░░░░░      │
├─────────────────────────┤
│ ░░░░░░░░░░░░░  ░░░░   │  Action button + Heart
└─────────────────────────┘
```

### VetProfileSkeleton
```
┌─────────────────────────┐
│ ░░░░░  ░░░░░░░░░░░░   │  Avatar + Name/Title
│        ░░░░░░░░░░░    │
├─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░  │  Bio/description
│ ░░░░░░░░░░░░░░░░░    │
├─────────────────────────┤
│ ░░░░░░░░░░  ░░░░░░░░ │  Rating + Button
└─────────────────────────┘
```

### OrderSkeleton
```
┌──────────────────────────────┐
│ Order #[░░░░░░░░]  [░░░░░░] │  Header with status
├──────────────────────────────┤
│ ░░░░░░  [░░░░░░░░░░░░░░░░] │  Date + Order ID
├──────────────────────────────┤
│ [░░░]  ░░░░░░░░░░░░░░░░░░  │  Product image + details
│        ░░░░░░░░░░░░░░░░░░  │
├──────────────────────────────┤
│ Total: ░░░░░░░  Status: ░░░░│  Summary
└──────────────────────────────┘
```

### ReviewSkeleton
```
┌──────────────────────────┐
│ ░░░  ░░░░░░░░░░░░░░░░░ │  Avatar + Name/Date
├──────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░  │  Rating
├──────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░  │  Review text
│ ░░░░░░░░░░░░░░░░░░░░░  │
│ ░░░░░░░░░░░░░░░░░░     │
└──────────────────────────┘
```

### CartItemSkeleton
```
┌────────────────────────────────────┐
│ [░░░░]  ░░░░░░░░░░░░░░░░░░░░░░  │  Image + Product info
│        ░░░░░░░░░░░░░░░░░░░░░░░░  │
│        ░░░░░░░░  ░░░░░░░░  ░░░  │  Price + Qty + Remove
└────────────────────────────────────┘
```

---

## Empty State Components - Visual Appearance

All empty states follow a consistent design with icon, title, description, and action button.

### NoProductsFound
```
┌──────────────────────────────────┐
│                                  │
│           🔍                     │
│    (coral icon on blue bg)       │
│                                  │
│  No Products Found               │
│                                  │
│  We couldn't find any products   │
│  matching your criteria. Try      │
│  adjusting your filters.          │
│                                  │
│     [Reset Filters]              │
│                                  │
└──────────────────────────────────┘
```

### NoAdoptionsFound
```
┌──────────────────────────────────┐
│                                  │
│           🐾                     │
│    (coral icon on blue bg)       │
│                                  │
│  No Pets Available               │
│                                  │
│  There are no pets available     │
│  for adoption matching your      │
│  search. Check back soon.        │
│                                  │
│     [Clear Filters]              │
│                                  │
└──────────────────────────────────┘
```

### EmptyCart
```
┌──────────────────────────────────┐
│                                  │
│           🛒                     │
│    (coral icon on blue bg)       │
│                                  │
│  Your Cart is Empty              │
│                                  │
│  Looks like you haven't added    │
│  anything to your cart yet. Go    │
│  explore and add some items!     │
│                                  │
│     [Start Shopping]             │
│                                  │
└──────────────────────────────────┘
```

### EmptyWishlist
```
┌──────────────────────────────────┐
│                                  │
│           ❤️                     │
│    (coral icon on blue bg)       │
│                                  │
│  Your Wishlist is Empty          │
│                                  │
│  Save your favorite items here   │
│  for easy access later. Start    │
│  exploring and add products!     │
│                                  │
│     [Browse Products]            │
│                                  │
└──────────────────────────────────┘
```

### NoOrders
```
┌──────────────────────────────────┐
│                                  │
│           📦                     │
│    (coral icon on blue bg)       │
│                                  │
│  No Orders Yet                   │
│                                  │
│  You haven't placed any orders   │
│  yet. Start shopping to see      │
│  your order history here.        │
│                                  │
│     [Start Shopping]             │
│                                  │
└──────────────────────────────────┘
```

### NoBookings
```
┌──────────────────────────────────┐
│                                  │
│           📅                     │
│    (coral icon on blue bg)       │
│                                  │
│  No Appointments                 │
│                                  │
│  You don't have any vet          │
│  appointments yet. Book a        │
│  consultation with our vets.     │
│                                  │
│     [Find a Vet]                 │
│                                  │
└──────────────────────────────────┘
```

### NoReviews
```
┌──────────────────────────────────┐
│                                  │
│           ⭐                     │
│    (coral icon on blue bg)       │
│                                  │
│  No Reviews Yet                  │
│                                  │
│  This product doesn't have any   │
│  reviews yet. Be the first to    │
│  share your experience!          │
│                                  │
│                                  │
│    (No action button)            │
│                                  │
└──────────────────────────────────┘
```

---

## Color Palette

### Petzy Brand Colors
- **Coral (Primary)**: `#FF8A80` - Action buttons, active states
- **Blue (Secondary)**: `#E3F2FD` - Icon backgrounds
- **Slate (Text)**: `#1E293B` - Headings
- **Slate Light (Text)**: `#64748B` - Descriptions
- **Shimmer**: `#E5E7EB → #F9FAFB → #E5E7EB` - Loading animation

---

## Animation Details

### Shimmer Animation
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
  background-size: 200% 100%;
}
```

**Duration**: 2 seconds  
**Repeat**: Infinite  
**Effect**: Left-to-right gradient sweep  
**Feeling**: Modern, responsive, professional

---

## Spacing & Sizing

### Skeleton Heights
- **Image areas**: 200-300px
- **Text lines**: 16-20px (h-4 to h-5)
- **Large elements**: 40-50px (h-10 to h-12)

### Empty State Sizes
- **Icon container**: 96x96px to 128x128px
- **Icon size**: 36-40px
- **Title**: 20-24px font size
- **Description**: 14-16px font size
- **Button**: 44px height, 32px width (rounded)

### Margins & Padding
- **Skeleton gaps**: 16px between items
- **Empty state padding**: 48-64px top/bottom
- **Container max-width**: 28rem (448px)

---

## Responsive Behavior

### Mobile (< 768px)
- Single column layout for skeletons
- Smaller icon sizes (96px)
- Adjusted text sizes
- Full-width buttons

### Tablet (768px - 1024px)
- 2-4 column grid for skeletons
- Medium icon sizes (128px)
- Regular spacing

### Desktop (> 1024px)
- 4-8 column grid for skeletons
- Full-size icons (128px)
- Generous spacing

---

## Accessibility

✅ **Semantic HTML** - Proper use of divs with aria-label  
✅ **Color Contrast** - All text meets WCAG AA standards  
✅ **Focus States** - Buttons have clear focus indicators  
✅ **Keyboard Navigation** - All buttons accessible via keyboard  
✅ **Screen Reader Ready** - Proper ARIA labels on interactive elements  

---

## Best Practices

1. **Always use the correct skeleton type** for your content
2. **Show 4-8 skeletons** while loading (typical grid size)
3. **Use CardSkeleton with count prop** for multiple items
4. **Pair every empty state with a helpful action**
5. **Keep loading duration under 3 seconds** (with skeletons felt faster!)
6. **Test on mobile** to ensure responsive design works

---

**Visual consistency across all pages = Professional, polished app!** ✨
