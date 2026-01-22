# Biluibaba - Pet Care E-commerce Platform

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Applications Breakdown](#applications-breakdown)
6. [Backend Server](#backend-server)
7. [Database Models](#database-models)
8. [API Routes](#api-routes)
9. [Features](#features)
10. [Environment Setup](#environment-setup)
11. [Installation & Running](#installation--running)
12. [Payment Integration](#payment-integration)
13. [Authentication & Authorization](#authentication--authorization)
14. [Development Workflow](#development-workflow)

---

## 🎯 Project Overview

**Biluibaba** is a comprehensive pet care e-commerce platform built with a microservices architecture. It serves as a one-stop solution for pet owners in Bangladesh, offering:
- Pet products marketplace
- Veterinary consultation services (online & physical)
- Pet adoption platform
- Vendor/seller management
- Real-time video consultations with vets

The platform supports multiple user roles: Customers, Vendors, Veterinarians, and Administrators.

---

## 🏗️ Architecture

This is a **monorepo** containing 5 separate applications:

```
┌─────────────────────────────────────────────────────────────┐
│                    Biluibaba Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Client   │  │   Admin    │  │    App     │            │
│  │ (Port 3000)│  │ (Port 3001)│  │ (Port 3002)│            │
│  │  Customer  │  │   Admin    │  │   Vendor/  │            │
│  │  Frontend  │  │   Panel    │  │    Vet     │            │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘            │
│         │                │                │                  │
│         └────────────────┴────────────────┘                  │
│                          │                                   │
│                  ┌───────▼────────┐                          │
│                  │     Server     │                          │
│                  │  (Express API) │                          │
│                  │  Backend Node  │                          │
│                  └───────┬────────┘                          │
│                          │                                   │
│                  ┌───────▼────────┐                          │
│                  │    MongoDB     │                          │
│                  │    Database    │                          │
│                  └────────────────┘                          │
│                                                              │
│  ┌────────────┐                                             │
│  │    Room    │  (Separate - Video Consultation)            │
│  │ (Port 3003)│                                             │
│  │   Twilio   │                                             │
│  └────────────┘                                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 & 15 (App Router)
- **Language**: TypeScript & JavaScript
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Radix UI
  - shadcn/ui
  - Ant Design
  - HeroUI
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod validation
- **Rich Text Editor**: TipTap
- **HTTP Client**: Axios
- **Authentication**: JWT with cookies

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT, bcrypt
- **File Upload**: Multer
- **Email**: Nodemailer
- **Payment Gateway**: SSLCommerz
- **Video Calls**: Twilio Video API
- **Template Engine**: Handlebars
- **PDF Generation**: Puppeteer
- **Utilities**: 
  - nanoid (ID generation)
  - slugify
  - dotenv

---

## 📁 Project Structure

```
Biluibaba-legacy/
│
├── client/                 # Customer-facing Next.js app (Port 3000)
│   ├── src/
│   │   ├── app/           # Next.js app directory (pages & layouts)
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utility functions & axios config
│   │   ├── styles/        # Global styles
│   │   └── utils/         # Helper functions
│   └── public/            # Static assets (images, logos)
│
├── admin/                 # Admin panel Next.js app (Port 3001)
│   ├── app/               # Admin dashboard pages
│   │   └── dashboard/     # Admin features (orders, products, users, vendors, etc.)
│   ├── components/        # Admin UI components
│   ├── schema/            # Zod validation schemas
│   └── lib/               # Admin utilities
│
├── app/                   # Vendor/Vet portal Next.js app (Port 3002)
│   ├── app/               # Vendor/Vet dashboard pages
│   │   └── dashboard/     # Vendor/Vet specific features
│   ├── components/        # Vendor/Vet UI components
│   ├── schema/            # Validation schemas
│   └── context/           # Auth context providers
│
├── room/                  # Video consultation app (Port 3003)
│   ├── app/               # Video room pages
│   │   └── components/    # Video call components (Twilio integration)
│   └── lib/               # Room utilities
│
├── server/                # Backend Express API server
│   ├── config/            # Database connection
│   ├── controllers/       # Business logic for routes
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoint definitions
│   ├── middleware/        # Auth & error handling middleware
│   ├── utils/             # Helper functions (payment, email, etc.)
│   ├── templates/         # Email templates (Handlebars)
│   ├── uploads/           # File storage (images, documents)
│   └── server.js          # Main server entry point
│
├── changes.txt            # Development notes
└── client_secret_*.json   # Google OAuth credentials
```

---

## 🎨 Applications Breakdown

### 1. **Client** (Port 3000) - Customer Frontend
**Purpose**: Main customer-facing website

**Key Features**:
- Home page with product categories (Cat, Dog, Fish, Bird, Rabbit)
- Product browsing and search
- Shopping cart & checkout
- Pet adoption listings
- Veterinarian directory & booking
- User account management
- Order tracking
- Wishlist functionality
- Premium membership plans (Silver, Gold, Platinum)

**Key Pages**:
- `/` - Homepage
- `/products` - Product catalog
- `/checkout` - Order checkout
- `/my-cart` - Shopping cart
- `/vets` - Vet listings
- `/vets/[id]` - Vet profile & booking
- `/vets/checkout` - Vet appointment checkout
- `/adoptions` - Pet adoption listings
- `/adoptions/checkout` - Adoption checkout
- `/my-account` - User profile
- `/become-seller` - Vendor registration
- `/become-vet` - Vet registration
- `/our-plans` - Membership plans

**Authentication**: 
- Cookie-based JWT
- Email/password login
- Google OAuth
- Facebook OAuth

---

### 2. **Admin** (Port 3001) - Admin Dashboard
**Purpose**: Platform administration and management

**Key Features**:
- Dashboard overview
- User management
- Vendor approval & management
- Product management & approval
- Order management
- Adoption listing management
- Site settings configuration
- Analytics & reporting

**Key Sections**:
- `/dashboard` - Admin overview
- `/dashboard/users` - User management
- `/dashboard/vendor` - Vendor management
- `/dashboard/products` - Product catalog management
- `/dashboard/orders` - Order processing
- `/dashboard/adoptions` - Adoption management
- `/dashboard/site-settings` - Platform configuration

**Authentication**: Admin-only JWT with role verification

---

### 3. **App** (Port 3002) - Vendor/Vet Portal
**Purpose**: Interface for vendors and veterinarians to manage their business

**Vendor Features**:
- Product listing creation/editing
- Order management
- Inventory tracking
- Sales analytics
- Profile management

**Vet Features**:
- Appointment scheduling
- Availability management
- Online/physical/emergency consultation toggle
- Prescription writing
- Earnings tracking
- Time slot configuration

**Key Sections**:
- `/dashboard` - Vendor/Vet overview
- `/dashboard/products` - Product management (vendors)
- `/dashboard/orders` - Order fulfillment (vendors)
- `/dashboard/appointments` - Appointment management (vets)
- `/dashboard/vet` - Vet profile & settings

**Authentication**: Separate JWT tokens for vendors and vets

---

### 4. **Room** (Port 3003) - Video Consultation
**Purpose**: Real-time video consultation between vets and customers

**Technology**: 
- Twilio Video API
- WebRTC for peer-to-peer video
- Token-based access control

**Features**:
- Video calling
- Screen sharing capabilities
- Chat during calls
- Room-based system (each appointment gets unique room link)

**Access**: Via email link sent after booking online consultation

---

### 5. **Server** - Backend API
**Purpose**: Centralized backend serving all frontend applications

**Port**: Configured via environment variable (likely 5000/8000)

**Key Responsibilities**:
- User authentication & authorization
- Database operations
- Payment processing (SSLCommerz)
- Email notifications
- File uploads
- Business logic enforcement

---

## 💾 Backend Server

### Server Configuration (`server.js`)

```javascript
// Key configurations:
- CORS enabled for all 4 frontend apps
- JSON body parsing (50mb limit)
- Cookie parser for JWT tokens
- Static file serving for uploads
- Centralized error handling
- Unhandled rejection handling
```

### Database Connection (`config/db.js`)
- MongoDB connection via Mongoose
- Auto-initialization of site settings
- Connection retry logic
- Error handling

---

## 🗄️ Database Models

### 1. **User Model** (`user.model.js`)
```javascript
{
  name: String,
  email: String (unique),
  phoneNumber: String,
  authType: String, // email, google, facebook
  verified: Boolean,
  password: String (hashed),
  promotionalEmails: Boolean,
  package: String, // Free, Silver, Gold, Platinum
  packageExpire: Number,
  shipping: { state, area, district, postcode, address },
  wishlist: [{ productId }],
  invoiceIDs: [ObjectId],
  appointmentIDs: [ObjectId],
  adoptionIDs: [ObjectId],
  resetPasswordToken: String,
  resetPasswordExpire: Date
}
```

**Methods**:
- `matchPassword()` - Verify password
- `getSignedToken()` - Generate JWT
- `getResetPasswordToken()` - Password reset token

---

### 2. **Product Model** (`product.model.js`)
```javascript
{
  productId: String,
  status: Boolean,
  slug: String,
  categories: [{ parent, category, sub }],
  name: String,
  images: [{ filename, path }],
  price: Number,
  size: Number,
  discount: Number,
  quantity: Number,
  description: String,
  orderCount: String,
  featured: Boolean,
  vendorId: ObjectId (ref: Vendor),
  vendorName: String,
  ratings: Number,
  totalRatings: Number,
  totalReviews: Number,
  ratingBreakdown: { excellent, veryGood, good, average, poor },
  reviews: [{ userId, comment, rating, date }],
  tags: [String],
  views: Number,
  isDeleted: Boolean
}
```

**Pre-save Hook**: Auto-calculates ratings and review statistics

---

### 3. **Order Model** (`order.model.js`)
```javascript
{
  orderId: String,
  status: String, // pending, processing, completed
  type: String,
  products: [{ 
    id: ObjectId, 
    name: String, 
    quantity: Number, 
    price: Number,
    vendor: ObjectId 
  }],
  paymentMethod: String, // Cash on delivery, Online
  paymentStatus: Boolean,
  paymentSessionKey: String, // SSLCommerz session
  deliveryStatus: String,
  deliveryTrackingCode: String,
  deliveryConsignmentId: String,
  totalAmount: Number,
  userId: ObjectId,
  shippingCost: Number,
  name: String,
  phoneNumber: String,
  region: String,
  area: String,
  fullAddress: String,
  notes: String
}
```

**Post-save Hook**: Increments product `orderCount` when order status is true

---

### 4. **Vendor Model** (`vendor.model.js`)
```javascript
{
  status: String, // pending, approved, rejected
  name: String,
  type: String, // Individual, Company
  phoneNumber: String,
  email: String,
  storeName: String,
  password: String (hashed),
  verified: Boolean,
  address: { store, state, area, district, postcode, fullAddress, pickupAddress },
  nid: { front, back, number },
  companyRegistration: String,
  tax: { tin, tradeLicense },
  bank: { accountType, accountName, accountNumber },
  totalListedProducts: Number,
  productIDs: [ObjectId],
  orderIDs: [ObjectId],
  ratings: Number
}
```

**Methods**: Same authentication methods as User model

---

### 5. **Vet Model** (`vet.model.js`)
```javascript
{
  status: Boolean,
  name: String,
  email: String,
  phoneNumber: String,
  gender: String,
  password: String (hashed),
  verified: Boolean,
  degree: String,
  license: String,
  hospital: String,
  address: { state, district, postcode, fullAddress },
  certificate: String,
  bio: String,
  profilePicture: String,
  nid: { front, back, number },
  tax: { tin },
  appointments: {
    physical: { status, fee },
    online: { status, fee },
    emergency: { status, fee },
    homeService: { status, fee },
    instantChat: { status, fee },
    slots: { 
      monday/tuesday/.../sunday: {
        startTime, endTime, duration, interval, availableSlots: [String]
      }
    }
  },
  totalRatings: Number,
  ratings: Number,
  reviews: [{ userId, comment, rating, date }]
}
```

---

### 6. **Appointment Model** (`appointment.model.js`)
```javascript
{
  appointmentId: String,
  status: String, // pending, confirmed, completed
  phoneNumber: String,
  petName: String,
  petConcern: [String],
  detailedConcern: String,
  species: String,
  age: String,
  breed: String,
  date: String,
  time: String,
  totalAmount: Number,
  paymentStatus: Boolean,
  paymentSessionKey: String,
  type: String, // physical, online, emergency, homeService
  homeAddress: String,
  roomLink: String, // For online consultations (Twilio room)
  prescription: [{ medication, dose, instruction }],
  vet: ObjectId,
  user: ObjectId
}
```

---

### 7. **Adoption Model** (`adoption.model.js`)
```javascript
{
  adoptionId: String,
  status: String, // pending, approved, adopted
  name: String,
  species: String,
  gender: String,
  age: String,
  breed: String,
  size: String,
  vaccinated: String,
  neutered: String,
  color: [String],
  location: String,
  description: String,
  phoneNumber: String,
  images: [{ filename, path }],
  userId: ObjectId
}
```

---

### 8. **Adoption Order Model** (`adoption-order.model.js`)
For tracking adoption applications

---

### 9. **Site Settings Model** (`site-settings.model.js`)
Manages homepage content, banners, featured items, etc.

---

## 🛣️ API Routes

### Authentication Routes (`/api/auth`)
```
POST   /register           - User registration
POST   /login              - User login
GET    /facebook           - Facebook OAuth
GET    /google             - Google OAuth
GET    /me                 - Get current user info (protected)
POST   /update-profile     - Update user profile (protected)
GET    /orders             - Get user orders (protected)
GET    /vet                - Get user vet appointments (protected)
GET    /logout             - Logout user (protected)
```

**Middleware**: `protectUser` - Validates JWT from cookies

---

### Product Routes (`/api/product`)
```
GET    /get/:slug                 - Get single product by slug
GET    /search                    - Search products
GET    /:type/:category           - Get products by category/type
GET    /get                       - Get pet products
GET    /best-deals                - Get best deal products
POST   /create                    - Create product (vendor protected)
POST   /update                    - Update product (vendor protected)
DELETE /delete/:id                - Delete product (vendor protected)
POST   /status/:id                - Toggle product status (vendor protected)
POST   /review                    - Submit product review (user protected)
```

---

### Order Routes (`/api/order`)
```
POST   /                   - Create product order (user protected)
POST   /validate           - Validate payment from SSLCommerz
```

---

### Vendor Routes (`/api/vendor`)
```
POST   /register           - Vendor registration
POST   /login              - Vendor login
GET    /me                 - Get vendor info (protected)
GET    /products           - Get vendor products (protected)
GET    /orders             - Get vendor orders (protected)
POST   /update             - Update vendor profile (protected)
```

---

### Vet Routes (`/api/vet`)
```
POST   /register                    - Vet registration
POST   /login                       - Vet login
GET    /me                          - Get vet info (protected)
GET    /list                        - Get all vets
GET    /:id                         - Get single vet
POST   /appointment                 - Create appointment (user protected)
POST   /appointment/validate        - Validate appointment payment
GET    /appointments                - Get vet appointments (vet protected)
POST   /availability                - Update availability (vet protected)
POST   /slots                       - Update time slots (vet protected)
POST   /prescription/:id            - Add prescription (vet protected)
```

---

### Room Routes (`/api/room`)
```
POST   /token              - Get Twilio video access token
```

---

### Adoptions Routes (`/api/adoptions`)
```
GET    /                   - Get all adoptions
GET    /:id                - Get single adoption
POST   /create             - Create adoption listing (user protected)
POST   /order              - Create adoption order (user protected)
```

---

### Admin Routes (`/api/admin`)
```
POST   /login                      - Admin login
GET    /users                      - Get all users
GET    /vendors                    - Get all vendors
GET    /vets                       - Get all vets
GET    /products                   - Get all products
GET    /orders                     - Get all orders
GET    /adoptions                  - Get all adoptions
POST   /vendor/approve/:id         - Approve vendor
POST   /vet/approve/:id            - Approve vet
POST   /product/approve/:id        - Approve product
GET    /site-settings              - Get site settings
POST   /site-settings              - Update site settings
```

---

### App Routes (`/api/app`)
General utility routes (location, etc.)

---

## ✨ Features

### For Customers
1. **Product Shopping**
   - Browse by pet type (cat, dog, fish, bird, rabbit)
   - Search & filter products
   - Add to cart & wishlist
   - Multiple payment options (COD, Online via SSLCommerz)
   - Order tracking

2. **Vet Consultations**
   - Browse vet profiles with ratings & reviews
   - Book appointments (physical, online, home service, emergency)
   - Video consultation via Twilio
   - Receive digital prescriptions
   - View appointment history

3. **Pet Adoption**
   - Browse adoptable pets
   - Filter by species, breed, location
   - Submit adoption applications
   - Track application status

4. **Membership Plans**
   - Free, Silver (৳5000), Gold (৳10,000), Platinum (৳20,000)
   - Discounts on consultations & products
   - Free delivery benefits
   - Priority support

### For Vendors
1. **Product Management**
   - Upload products with images
   - Set pricing, discounts, inventory
   - Track order count & views
   - Receive order notifications

2. **Order Fulfillment**
   - View incoming orders
   - Update order status
   - Manage delivery tracking

3. **Analytics**
   - Sales reports
   - Product performance
   - Customer reviews

### For Veterinarians
1. **Profile Management**
   - Set qualifications, specializations
   - Upload certificates & licenses
   - Write bio & service descriptions

2. **Availability Management**
   - Toggle service types (physical, online, emergency, home service)
   - Set consultation fees for each type
   - Configure weekly time slots
   - Block/unblock specific dates

3. **Appointment Handling**
   - View booked appointments
   - Join video consultations
   - Write digital prescriptions
   - View patient history

4. **Earnings**
   - Track consultation revenue
   - View payment history

### For Admins
1. **User Management**
   - View all registered users
   - Monitor user activity
   - Manage memberships

2. **Vendor & Vet Approval**
   - Review registration applications
   - Verify documents (NID, certificates, licenses)
   - Approve/reject applications

3. **Content Management**
   - Configure homepage sliders
   - Set featured products/vets/adoptions
   - Manage banners & promotional content

4. **Order Oversight**
   - Monitor all platform orders
   - Handle disputes
   - Generate reports

---

## 🔐 Authentication & Authorization

### User Types
1. **Regular Users** - Customers
2. **Vendors** - Product sellers
3. **Vets** - Service providers
4. **Admins** - Platform administrators

### Authentication Flow

#### User Authentication
```javascript
// Login → JWT token stored in cookie "token"
// Protected routes verify via protectUser middleware
// Token contains: id, name, isVerified, avatar, package, packageExpire
```

#### Vendor Authentication
```javascript
// Login → JWT token stored in cookie "app-token"
// Protected routes verify via protectVendor middleware
// Token contains: id, status, name, isVerified, type, storeName
```

#### Vet Authentication
```javascript
// Login → JWT token stored in cookie "app-token"
// Protected routes verify via protectVet middleware
// Token contains: id, name, isVerified, status
```

#### Admin Authentication
```javascript
// Login → JWT token with admin privileges
// Protected routes verify admin role
```

### Middleware (`middleware/auth.js`)
- `protectUser` - Validates user JWT from cookies
- `protectVendor` - Validates vendor JWT from cookies/headers
- `protectVet` - Validates vet JWT from cookies/headers
- `protectAdmin` - Validates admin JWT

### Password Security
- Passwords hashed using bcrypt (10 salt rounds)
- Reset tokens generated with crypto (20 bytes)
- Token expiry: 10 minutes for password reset

---

## 💳 Payment Integration

### SSLCommerz Integration
**Bangladesh's leading payment gateway**

#### Configuration
```javascript
// Environment variables required:
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_API_KEY=your_api_key

// Sandbox mode: false in production
```

#### Payment Flow

1. **Initiate Payment**
```javascript
// Create payment request
const paymentResponse = await createPaymentRequest(
  totalAmount,
  transactionId,
  productName,
  productCategory,
  numberOfItems,
  emiOption,
  userInfo,
  urls, // success, fail, cancel, ipn
  address,
  phoneNumber
);
```

2. **User Redirected to SSLCommerz Gateway**
   - Customer enters payment details
   - SSLCommerz processes payment

3. **Callback Handling**
```javascript
// Success URL: /api/order/validate
// Fail URL: /api/order/validate
// Validates payment via validation API
```

4. **Payment Validation**
```javascript
const validationResponse = await validatePayment(val_id);
// Updates order/appointment payment status
```

#### Supported Payment Types
- Product orders
- Vet appointments
- Adoption fees
- Membership subscriptions

#### Currency
- BDT (Bangladeshi Taka - ৳)

---

## 🌐 Environment Setup

### Server Environment Variables

Create `.env` file in `/server`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/biluibaba
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/biluibaba

# JWT
TOKEN_SECRET=your_super_secret_jwt_key_min_32_chars
TOKEN_EXPIRE=30d

# CORS Origins
CORS_ORIGIN=http://localhost:3000
APP_CORS_ORIGIN=http://localhost:3002
ADMIN_CORS_ORIGIN=http://localhost:3001
ROOM_CORS_ORIGIN=http://localhost:3003

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# SSLCommerz Payment Gateway
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_API_KEY=your_api_key

# Twilio Video (for video consultations)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_VIDEO_SID=your_twilio_api_key_sid
TWILIO_VIDEO_SECRET_KEY=your_twilio_api_key_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OpenCage Geocoding API (for location services)
OPENCAGE_API_KEY=your_opencage_api_key

# Admin Credentials
ADMIN_EMAIL=admin@biluibaba.com
ADMIN_PASSWORD=secure_admin_password
```

### Client Environment Variables

Create `.env.local` in `/client`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ROOM_URL=http://localhost:3003
```

### Admin Environment Variables

Create `.env.local` in `/admin`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### App (Vendor/Vet) Environment Variables

Create `.env.local` in `/app`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Room Environment Variables

Create `.env.local` in `/room`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🚀 Installation & Running

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd Biluibaba-legacy
```

### Step 2: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Install admin dependencies
cd ../admin
npm install

# Install app (vendor/vet) dependencies
cd ../app
npm install

# Install room dependencies
cd ../room
npm install
```

### Step 3: Configure Environment Variables
Create `.env` files as described in the Environment Setup section.

### Step 4: Start MongoDB
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, ensure connection string is in .env
```

### Step 5: Start All Applications

**Option A: Run individually in separate terminals**

```bash
# Terminal 1 - Backend Server
cd server
node server.js

# Terminal 2 - Client (Customer Frontend)
cd client
npm run dev

# Terminal 3 - Admin Panel
cd admin
npm run dev

# Terminal 4 - Vendor/Vet Portal
cd app
npm run dev

# Terminal 5 - Video Room (if needed)
cd room
npm run dev
```

**Option B: Use a process manager (recommended for development)**

Install concurrently globally:
```bash
npm install -g concurrently
```

Create a root `package.json` with scripts to run all apps.

### Access URLs
- **Client**: http://localhost:3000
- **Admin**: http://localhost:3001
- **Vendor/Vet**: http://localhost:3002
- **Room**: http://localhost:3003
- **API**: http://localhost:5000

---

## 📊 Development Workflow

### For New Developers

#### 1. **Understanding the Flow**

**Customer Journey**:
```
Home → Browse Products → Add to Cart → Checkout → Payment → Order Confirmation
```

**Vet Booking Journey**:
```
Browse Vets → Select Vet → Choose Type → Select Slot → Checkout → Payment → 
→ Confirmation Email with Room Link (if online)
```

**Vendor Journey**:
```
Register → Admin Approval → Login → Add Products → Manage Orders
```

#### 2. **Key Files to Understand**

**Backend**:
- `server/server.js` - Entry point
- `server/config/db.js` - Database connection
- `server/middleware/auth.js` - Authentication logic
- `server/utils/Payment.js` - Payment processing

**Frontend**:
- `client/src/app/page.jsx` - Homepage
- `client/src/lib/axiosInstance.js` - API client configuration
- `admin/lib/axios.tsx` - Admin API client
- `app/lib/axios.tsx` - Vendor/Vet API client

#### 3. **Common Tasks**

**Add a new API endpoint**:
1. Create controller function in `server/controllers/`
2. Add route in `server/routes/`
3. Add middleware if needed
4. Test with Postman/Thunder Client

**Add a new page**:
1. Create page in appropriate app's `app/` directory
2. Use existing components from `components/`
3. Call API via axios instance
4. Handle loading & error states

**Modify database schema**:
1. Update model in `server/models/`
2. Consider migration for existing data
3. Update relevant controllers
4. Update frontend forms

#### 4. **File Upload Locations**
```
server/uploads/
├── profile/          # User avatars
├── product/          # Product images
├── adoptions/        # Pet adoption photos
├── site-settings/    # Banner images
├── vendor/           # Vendor documents (NID, licenses)
└── logo.png          # Platform logo
```

#### 5. **Common Issues & Solutions**

**CORS Errors**:
- Ensure frontend URL is in `CORS_ORIGIN` in server `.env`
- Check `credentials: true` in axios config

**Authentication Failures**:
- Verify JWT token in cookies (browser DevTools)
- Check token expiration
- Ensure middleware is applied to routes

**Payment Not Working**:
- Verify SSLCommerz credentials
- Check if in sandbox/live mode
- Ensure callback URLs are accessible

**Video Room Not Loading**:
- Verify Twilio credentials
- Check room link in appointment
- Ensure HTTPS in production

---

## 🔧 Deployment Considerations

### Production Checklist

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use production MongoDB Atlas cluster
   - Update CORS origins to production URLs
   - Use production SSLCommerz credentials
   - Secure JWT secret (minimum 32 characters)

2. **Security**
   - Enable HTTPS for all apps
   - Set secure cookie flags
   - Implement rate limiting
   - Add helmet.js for security headers
   - Validate all user inputs

3. **Performance**
   - Enable Next.js production build
   - Implement image optimization
   - Use CDN for static assets
   - Enable database indexing
   - Implement caching (Redis)

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Add application logging
   - Monitor server performance
   - Track payment success rates

5. **File Storage**
   - Consider cloud storage (AWS S3, Cloudinary) for uploads
   - Implement file size limits
   - Add image compression

---

## 📝 Additional Notes

### Known Issues (from changes.txt)
- Location service not fully functional
- Animation/functionality for tags & titles needs work
- "See all" buttons not functional in some sections
- "See all pets" button not functional

### Payment Gateway Branch
Current branch: `feature/payment-gateway` - SSLCommerz integration

### Database Initialization
On first server start, the system auto-creates default site settings if none exist.

### Email Templates
Located in `server/templates/` using Handlebars:
- Order confirmations
- Vendor/Vet application reviews
- Appointment confirmations
- Password resets

### PDF Generation
Uses Puppeteer for:
- Invoices
- Prescriptions
- Reports

---

## 🤝 Contributing

### Code Style
- Use meaningful variable names
- Comment complex logic
- Follow existing file structure
- Use async/await over callbacks
- Handle errors gracefully

### Git Workflow
1. Create feature branch from `main`
2. Make changes
3. Test locally
4. Commit with clear messages
5. Create pull request

### Testing
- Test all user flows
- Verify payment integrations in sandbox
- Check responsive design
- Test all CRUD operations

---

## 📞 Support

For questions or issues:
1. Check this documentation
2. Review existing code patterns
3. Test in development environment
4. Document bugs clearly

---

## 📄 License

Copyright © Biluibaba. All rights reserved.

---

**Last Updated**: January 2026  
**Author**: Aminul  
**Documentation Version**: 1.0

---

## Quick Reference

### Ports
- Client: 3000
- Admin: 3001
- App (Vendor/Vet): 3002
- Room: 3003
- Server: 5000 (configurable)

### User Roles
- Customer (Regular User)
- Vendor (Product Seller)
- Vet (Service Provider)
- Admin (Platform Manager)

### Payment Methods
- Cash on Delivery
- Online (SSLCommerz)

### Consultation Types
- Physical (In-person)
- Online (Video call)
- Home Service
- Emergency
- Instant Chat

### Pet Categories
- Cat
- Dog
- Fish
- Bird
- Rabbit

---

**Welcome to Biluibaba! Happy coding! 🐾**
