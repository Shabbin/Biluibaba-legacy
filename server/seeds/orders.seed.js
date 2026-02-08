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
  const users = await Users.find({ role: { $ne: "admin" } }).select("_id address");
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
        product: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        quantity,
        image: product.images[0],
      };
    });

    const subtotal = items.reduce((sum, item) => {
      const itemPrice = Math.floor(item.price - (item.discount > 0 ? (item.price * item.discount) / 100 : 0));
      return sum + (itemPrice * item.quantity);
    }, 0);

    const deliveryCharge = subtotal > 1000 ? 0 : 60;
    const total = subtotal + deliveryCharge;

    const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const paymentStatus = 
      status === "delivered" ? "completed" :
      status === "cancelled" ? Math.random() > 0.5 ? "refunded" : "failed" :
      paymentMethod === "Cash on Delivery" ? "pending" :
      Math.random() > 0.3 ? "completed" : "pending";

    const createdAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000); // Last 90 days
    
    let deliveredAt = null;
    let shippedAt = null;

    if (status === "delivered") {
      deliveredAt = new Date(createdAt.getTime() + (Math.random() * 7 + 2) * 24 * 60 * 60 * 1000);
      shippedAt = new Date(createdAt.getTime() + (Math.random() * 3 + 1) * 24 * 60 * 60 * 1000);
    } else if (status === "shipped") {
      shippedAt = new Date(createdAt.getTime() + (Math.random() * 3 + 1) * 24 * 60 * 60 * 1000);
    }

    orders.push({
      orderId: generateOrderId(),
      user: user._id,
      items,
      subtotal,
      deliveryCharge,
      total,
      status,
      paymentMethod,
      paymentStatus,
      paymentTransactionId: paymentStatus === "completed" ? `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}` : null,
      shippingAddress: user.address,
      notes: Math.random() > 0.7 ? "Please deliver between 2-5 PM" : "",
      createdAt,
      shippedAt,
      deliveredAt,
    });
  }

  return orders;
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
