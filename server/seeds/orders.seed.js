const mongoose = require("mongoose");
const Orders = require("../models/order.model");
const Users = require("../models/user.model");
const Products = require("../models/product.model");

const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
const paymentMethods = ["Cash on Delivery", "SSLCommerz", "bKash", "Nagad"];
const paymentStatuses = ["pending", "completed", "failed", "refunded"];

function generateOrderId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

function getRandomSubset(array, min, max) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function generateOrders(count = 100) {
  const users = await Users.find({ authType: "email" }).select("_id name phoneNumber shipping");
  const products = await Products.find().select("_id name price discount images");

  if (users.length === 0 || products.length === 0) {
    throw new Error("No users or products found. Please seed users and products first.");
  }

  const orders = [];

  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const orderProducts = getRandomSubset(products, 1, 5);

    const items = orderProducts.map(product => {
      const quantity = Math.floor(Math.random() * 4) + 1;
      const finalPrice = Math.floor(
        product.price - (product.discount > 0 ? (product.price * product.discount) / 100 : 0)
      );

      return {
        id: product._id,
        name: product.name,
        price: finalPrice,
        quantity,
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = totalAmount > 1000 ? 0 : 60;

    const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const paymentStatus = 
      status === "delivered" ? true :
      status === "cancelled" ? false :
      paymentMethod === "Cash on Delivery" ? false :
      Math.random() > 0.3;

    const createdAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    
    const deliveryStatus = 
      status === "delivered" ? "delivered" :
      status === "shipped" ? "in-transit" :
      status === "processing" ? "preparing" :
      status === "cancelled" ? "cancelled" :
      "pending";

    orders.push({
      orderId: generateOrderId(),
      userId: user._id,
      products: items,
      totalAmount: totalAmount + shippingCost,
      shippingCost,
      status,
      type: "product",
      paymentMethod,
      paymentStatus,
      paymentSessionKey: paymentStatus ? `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}` : null,
      deliveryStatus,
      deliveryTrackingCode: status === "shipped" || status === "delivered" ? `TRACK${Date.now()}` : null,
      name: user.name,
      phoneNumber: user.phoneNumber || generatePhone(),
      region: user.shipping?.state || "Dhaka",
      area: user.shipping?.area || "Dhanmondi",
      fullAddress: user.shipping?.address || "House 123, Road 45",
      notes: Math.random() > 0.7 ? "Please deliver between 2-5 PM" : "",
      createdAt,
    });
  }

  return orders;
}

function generatePhone() {
  const prefixes = ["017", "018", "019", "013", "014", "015", "016"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${number}`;
}

async function seedOrders() {
  try {
    console.log("🌱 Starting order seeding...");

    // Clear existing orders
    await Orders.deleteMany({});
    console.log("✅ Cleared existing orders");

    // Generate and insert orders
    const orders = await generateOrders(100);
    await Orders.insertMany(orders);

    console.log(`✅ Successfully seeded ${orders.length} orders!`);
    console.log(`   - Pending: ${orders.filter(o => o.status === "pending").length}`);
    console.log(`   - Processing: ${orders.filter(o => o.status === "processing").length}`);
    console.log(`   - Shipped: ${orders.filter(o => o.status === "shipped").length}`);
    console.log(`   - Delivered: ${orders.filter(o => o.status === "delivered").length}`);
    console.log(`   - Cancelled: ${orders.filter(o => o.status === "cancelled").length}`);

  } catch (error) {
    console.error("❌ Error seeding orders:", error);
    throw error;
  }
}

module.exports = { seedOrders, generateOrders };
