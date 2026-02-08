# 🚀 Quick Start Guide - Biluibaba

## 📋 Prerequisites

- Node.js 16+ installed
- MongoDB running (local or cloud)
- Git repository cloned

---

## ⚡ Fast Setup (5 minutes)

### 1️⃣ **Install Dependencies**

```bash
# Server
cd server
npm install

# Client  
cd ../client
npm install
```

---

### 2️⃣ **Configure Environment**

Create `.env` file in `/server`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/biluibaba
# or your MongoDB Atlas connection string

# Server
PORT=5000
NODE_ENV=development

# JWT Secrets
TOKEN_SECRET=your_user_jwt_secret_key_here
ADMIN_TOKEN_SECRET=your_admin_jwt_secret_key_here
VET_TOKEN_SECRET=your_vet_jwt_secret_key_here

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# SSLCommerz (Payment)
STORE_ID=your_store_id
STORE_PASSWORD=your_store_password
IS_LIVE=false
```

Create `.env.local` in `/client`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### 3️⃣ **Seed Database with Dummy Data**

```bash
cd server
npm run seed
```

**This creates:**
- ✅ 300+ Products (all categories)
- ✅ 50 User Accounts
- ✅ 100 Orders (various statuses)
- ✅ 15 Veterinarians
- ✅ 40 Pet Adoptions

**Test Credentials Created:**
```
Customer: test@biluibaba.com / password123
Vet: dr.ashraf.mahmud@biluibaba.com / vet123
```

---

### 4️⃣ **Start the Applications**

**Terminal 1 - Server:**
```bash
cd server
node server.js
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```
Client runs on: `http://localhost:3000`

---

## 🎯 What You Can Do Now

### Browse Products
1. Go to `http://localhost:3000`
2. Browse 300+ seeded products
3. Filter by categories (Dog, Cat, Bird, Rabbit, Fish)
4. Add to cart and wishlist

### User Features
1. **Login**: Use `test@biluibaba.com` / `password123`
2. **Place Orders**: Complete checkout flow
3. **View Profile**: Check order history
4. **Book Vet Appointments**: Schedule consultations

### Admin Features (if admin panel set up)
1. Go to `http://localhost:3001`
2. Manage products, orders, users

### Vet Features
1. Go to `http://localhost:3002`
2. Login: `dr.ashraf.mahmud@biluibaba.com` / `vet123`
3. View appointments and schedule

---

## 📦 Additional Seed Commands

```bash
# Reseed everything (cleans database first)
npm run seed:clean

# Seed individual categories
npm run seed:products    # Products only
npm run seed:users       # Users only
npm run seed:orders      # Orders only
npm run seed:vets        # Vets only
npm run seed:adoptions   # Pet adoptions only
```

---

## 🎨 UI Components Available

### New Modern Components

```jsx
// Badge - for labels and status
import Badge from "@/src/components/ui/badge";
<Badge variant="success">In Stock</Badge>
<Badge variant="gradient">30% OFF</Badge>

// Skeleton - for loading states
import { ProductSkeleton } from "@/src/components/ui/skeleton";
<ProductSkeleton />

// Card - for content containers
import Card, { CardHeader, CardTitle } from "@/src/components/ui/card";
<Card variant="elevated">...</Card>
```

### Enhanced Components
- ✨ Product Card - Hover effects, quick view, badges
- 🐾 Adoption Card - Modern styling, glass effects
- 🔘 Button - Pill-shaped, gradients, loading states
- 📝 Forms - Rounded borders, focus rings

See `client/UI_MODERNIZATION.md` for detailed documentation.

---

## 🗂️ Project Structure

```
Biluibaba-legacy/
├── server/                  # Express backend
│   ├── controllers/         # Route handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── seeds/              # Dummy data scripts ✨ NEW
│   │   ├── index.js        # Master seed script
│   │   ├── products.seed.js
│   │   ├── users.seed.js
│   │   ├── orders.seed.js
│   │   ├── vets.seed.js
│   │   ├── adoptions.seed.js
│   │   └── README.md       # Seed documentation
│   └── server.js
│
├── client/                 # Next.js customer app
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/        # Reusable UI components ✨ ENHANCED
│   │   │   │   ├── badge.jsx      ✨ NEW
│   │   │   │   ├── skeleton.jsx   ✨ NEW
│   │   │   │   ├── card.jsx       ✨ NEW
│   │   │   │   ├── button.jsx     ✅ Enhanced
│   │   │   │   ├── input.jsx      ✅ Enhanced
│   │   │   │   └── ...
│   │   │   ├── product.jsx        ✅ Modernized
│   │   │   ├── adoption.jsx       ✅ Modernized
│   │   │   └── ...
│   │   └── app/
│   └── UI_MODERNIZATION.md  ✨ NEW
│
├── admin/                  # Admin panel (Next.js)
├── app/                    # Vendor/Vet dashboard (Next.js)
└── room/                   # Video call app (Next.js)
```

---

## 🔍 Testing the Features

### 1. **Product Browsing**
- Visit homepage
- Products show hover effects
- Click product for details
- Add to cart/wishlist

### 2. **User Registration**
- Or use test account: `test@biluibaba.com`
- Browse as authenticated user

### 3. **Place an Order**
- Add products to cart
- Checkout
- Select payment method
- Complete order

### 4. **Book Vet Appointment**
- Go to `/vets`
- Browse 15 seeded vets
- Select time slot
- Book appointment

### 5. **Browse Pet Adoptions**
- Go to `/adoptions`
- View 40 seeded pets
- Filter by type
- Add to adoption wishlist

---

## 🐛 Common Issues

### Database Connection Error
```bash
# Check MongoDB is running
# For local: mongod
# For Atlas: Check connection string in .env
```

### Port Already in Use
```bash
# Server
lsof -ti:5000 | xargs kill -9

# Client
lsof -ti:3000 | xargs kill -9
```

### Seed Script Errors
```bash
# Make sure MongoDB is connected
# Check .env file has MONGODB_URI
# Try: npm run seed:clean (fresh start)
```

### Missing Dependencies
```bash
# Reinstall in both directories
cd server && npm install
cd client && npm install
```

---

## 📊 What Data Was Seeded

| Category | Count | Details |
|----------|-------|---------|
| **Products** | 300+ | All pet categories with realistic data |
| **Users** | 50 | Including 1 test account |
| **Orders** | 100 | Various statuses (pending, delivered, etc.) |
| **Vets** | 15 | With schedules and specializations |
| **Adoptions** | 40 | Dogs, cats, birds, rabbits |

---

## 🎓 Learn More

### Documentation
- **UI Components**: `client/UI_MODERNIZATION.md`
- **Seed Scripts**: `server/seeds/README.md`
- **Architecture**: `.github/copilot-instructions.md`

### API Endpoints
- Base URL: `http://localhost:5000/api`
- Swagger Docs: `http://localhost:5000/api-docs` (if configured)

### Key Endpoints:
```
GET  /api/product          - List products
GET  /api/product/:slug    - Product details
POST /api/order            - Place order
GET  /api/vet              - List vets
GET  /api/adoptions        - Pet adoptions
```

---

## ✅ Next Steps

1. **Customize the dummy data** - Edit seed files in `server/seeds/`
2. **Add placeholder images** - Replace image paths with real images
3. **Test payment flow** - Configure SSLCommerz for Bangladesh
4. **Deploy** - Follow deployment guides for production

---

## 🎉 You're All Set!

Your Biluibaba platform now has:
- ✨ Modern, professional UI
- 📦 Comprehensive dummy data
- 🎨 Reusable components
- 📱 Fully responsive design
- 🚀 Ready for development/testing

**Happy coding!** 🐾

---

### Need Help?

- Check `UI_MODERNIZATION.md` for component usage
- Check `seeds/README.md` for data seeding help
- Review `.github/copilot-instructions.md` for architecture details
