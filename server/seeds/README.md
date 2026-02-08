# 🌱 Database Seeding Guide

This directory contains scripts to populate your Biluibaba database with realistic dummy data for testing and development.

## 📦 What Gets Seeded

### Products (~300+ items)
- **Categories**: Dog, Cat, Bird, Rabbit, Fish supplies
- **Types**: Food, Toys, Accessories, Health products, Litter, Cages, etc.
- **Data**: Names, descriptions, prices, discounts, stock levels, ratings, reviews
- **Flags**: Featured products, best sellers, new arrivals

### Users (50 accounts)
- **Test User**: `test@biluibaba.com` / `password123`
- **Random Users**: 49 users with Bangladeshi names
- **Data**: Names, emails, phones, addresses, verification status
- **Password**: All users have password `password123`

### Orders (100 orders)
- **Statuses**: Pending, Processing, Shipped, Delivered, Cancelled
- **Payment Methods**: Cash on Delivery, SSLCommerz, bKash, Nagad
- **Data**: Multiple items per order, delivery charges, tracking info
- **Timeline**: Orders spread across last 90 days

### Vets (15 veterinarians)
- **Test Vet**: `dr.ashraf.mahmud@biluibaba.com` / `vet123`
- **Specializations**: Various veterinary specialties
- **Data**: Qualifications, experience, ratings, consultation fees
- **Schedules**: Working hours with available time slots
- **Password**: All vets have password `vet123`

### Pet Adoptions (40 pets)
- **Types**: Dogs, Cats, Birds, Rabbits
- **Breeds**: Realistic breed names for each type
- **Data**: Age, gender, color, temperament, health status, vaccination
- **Statuses**: Available and Already Adopted

## 🚀 Usage

### Seed Everything
```bash
cd server
npm run seed
```

### Clean & Reseed (Fresh Start)
```bash
npm run seed:clean
```

### Seed Specific Categories
```bash
npm run seed:products    # Products only
npm run seed:users       # Users only
npm run seed:orders      # Orders only (requires users & products)
npm run seed:vets        # Vets only
npm run seed:adoptions   # Pet adoptions only
```

## 🔑 Test Credentials

After seeding, use these accounts for testing:

**Customer Account:**
- Email: `test@biluibaba.com`
- Password: `password123`

**Veterinarian Account:**
- Email: `dr.ashraf.mahmud@biluibaba.com`
- Password: `vet123`

**Other Users:**
- All generated users have password: `password123`

## 📊 Data Statistics

After running the seed scripts, you'll have:

- **~300+ Products** across all pet categories
- **50 User Accounts** (1 test user + 49 random)
- **100 Orders** with various statuses
- **15 Veterinarians** with schedules
- **40 Pet Adoptions** (mix of available and adopted)

## ⚠️ Important Notes

1. **Admin Accounts Preserved**: The seeding process **DOES NOT** delete admin accounts. Only regular users are cleared during reseeding.

2. **Dependencies**: 
   - Orders seeding requires Users and Products to exist first
   - Run `npm run seed` (all) or seed in this order: users → products → orders

3. **MongoDB Required**: Make sure your MongoDB connection is configured in `.env`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Development Only**: This data is for **testing purposes only**. Do not run on production databases.

## 🔧 Customization

To modify the seeding data:

1. **Adjust Quantities**: Edit the count parameters in each seed file
2. **Add Categories**: Update the arrays in `products.seed.js`
3. **Change Names**: Modify the name arrays in respective seed files
4. **Custom Data**: Add your own data generators in individual seed files

## 📁 File Structure

```
seeds/
├── index.js              # Master seed script
├── products.seed.js      # Product data generator
├── users.seed.js         # User account generator
├── orders.seed.js        # Order data generator
├── vets.seed.js          # Veterinarian generator
├── adoptions.seed.js     # Pet adoption generator
└── README.md            # This file
```

## 🐛 Troubleshooting

**"No users or products found" error:**
- Run `npm run seed:users` and `npm run seed:products` first
- Then run `npm run seed:orders`

**Connection errors:**
- Verify MongoDB is running
- Check `.env` file has correct `MONGODB_URI`

**Permission errors:**
- Ensure the script is executable: `chmod +x seeds/index.js`

## 🎯 Next Steps

After seeding:

1. Start the server: `node server.js` or `npm start`
2. Test the API endpoints with seeded data
3. Login with test credentials in your client app
4. Browse products, place orders, book vet appointments
5. Test all features with realistic data

Happy testing! 🎉
