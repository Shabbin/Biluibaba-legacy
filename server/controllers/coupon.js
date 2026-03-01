const ErrorResponse = require("../utils/ErrorResponse");
const Coupons = require("../models/coupon.model");

module.exports.validateCoupon = async (request, response, next) => {
  const { code, subtotal } = request.body;

  if (!code) return next(new ErrorResponse("Please provide a coupon code", 422));

  const coupon = await Coupons.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });

  if (!coupon) return next(new ErrorResponse("Invalid coupon code", 404));

  // Check expiry
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
    return next(new ErrorResponse("This coupon has expired", 400));

  // Check usage limit
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
    return next(new ErrorResponse("This coupon has reached its usage limit", 400));

  // Check minimum order amount
  const orderSubtotal = Number(subtotal) || 0;
  if (coupon.minOrderAmount > 0 && orderSubtotal < coupon.minOrderAmount)
    return next(
      new ErrorResponse(
        `Minimum order amount of ৳${coupon.minOrderAmount} required for this coupon`,
        400
      )
    );

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = Math.round((orderSubtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  // Discount cannot exceed subtotal
  if (discount > orderSubtotal) discount = orderSubtotal;

  return response.status(200).json({
    success: true,
    coupon: {
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,
    },
  });
};

module.exports.getActiveCoupons = async (request, response, next) => {
  const coupons = await Coupons.find({
    isActive: true,
    $and: [
      { $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] },
      { $or: [{ usageLimit: null }, { $expr: { $lt: ["$usedCount", "$usageLimit"] } }] },
    ],
  })
    .select("code description discountType discountValue minOrderAmount maxDiscount expiresAt")
    .sort("-createdAt");

  return response.status(200).json({ success: true, coupons });
};
