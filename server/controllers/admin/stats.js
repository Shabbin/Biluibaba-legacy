const Users = require("../../models/user.model");
const Products = require("../../models/product.model");
const Orders = require("../../models/order.model");
const Vendors = require("../../models/vendor.model");
const Adoptions = require("../../models/adoption.model");

module.exports.getStats = async (request, response, next) => {
  const [
    totalUsers,
    totalProducts,
    publishedProducts,
    unpublishedProducts,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalVendors,
    approvedVendors,
    pendingVendors,
    totalAdoptions,
  ] = await Promise.all([
    Users.countDocuments(),
    Products.countDocuments(),
    Products.countDocuments({ status: true }),
    Products.countDocuments({ status: false }),
    Orders.countDocuments(),
    Orders.countDocuments({ status: "pending" }),
    Orders.countDocuments({ status: "delivered" }),
    Orders.countDocuments({ status: "cancelled" }),
    Vendors.countDocuments(),
    Vendors.countDocuments({ status: "approved" }),
    Vendors.countDocuments({ status: "pending" }),
    Adoptions.countDocuments(),
  ]);

  // Calculate revenue from paid orders
  const revenueResult = await Orders.aggregate([
    { $match: { paymentStatus: true } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  // Recent orders (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentOrdersCount = await Orders.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // New users this month
  const newUsersThisMonth = await Users.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  return response.status(200).json({
    success: true,
    stats: {
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
      },
      products: {
        total: totalProducts,
        published: publishedProducts,
        unpublished: unpublishedProducts,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        recentCount: recentOrdersCount,
      },
      vendors: {
        total: totalVendors,
        approved: approvedVendors,
        pending: pendingVendors,
      },
      adoptions: {
        total: totalAdoptions,
      },
      revenue: {
        total: totalRevenue,
      },
    },
  });
};
