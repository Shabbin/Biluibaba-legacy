const ErrorResponse = require("../../utils/ErrorResponse");
const Coupons = require("../../models/coupon.model");

module.exports.getCoupons = async (request, response, next) => {
  const coupons = await Coupons.find().sort("-createdAt");

  return response.status(200).json({ success: true, coupons });
};

module.exports.createCoupon = async (request, response, next) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscount,
    usageLimit,
    expiresAt,
  } = request.body;

  if (!code || !discountType || discountValue === undefined)
    return next(new ErrorResponse("Missing required fields", 422));

  if (!["percentage", "fixed"].includes(discountType))
    return next(new ErrorResponse("Invalid discount type", 422));

  if (discountType === "percentage" && (discountValue < 0 || discountValue > 100))
    return next(new ErrorResponse("Percentage discount must be between 0 and 100", 422));

  if (discountType === "fixed" && discountValue < 0)
    return next(new ErrorResponse("Fixed discount must be positive", 422));

  const existing = await Coupons.findOne({ code: code.toUpperCase() });
  if (existing)
    return next(new ErrorResponse("A coupon with this code already exists", 409));

  const coupon = await Coupons.create({
    code: code.toUpperCase(),
    description: description || "",
    discountType,
    discountValue,
    minOrderAmount: minOrderAmount || 0,
    maxDiscount: maxDiscount || null,
    usageLimit: usageLimit || null,
    expiresAt: expiresAt || null,
    isActive: true,
  });

  return response.status(201).json({ success: true, coupon });
};

module.exports.updateCoupon = async (request, response, next) => {
  const { id } = request.params;

  if (!id) return next(new ErrorResponse("Missing coupon ID", 422));

  const {
    code,
    description,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscount,
    usageLimit,
    expiresAt,
    isActive,
  } = request.body;

  const coupon = await Coupons.findById(id);
  if (!coupon) return next(new ErrorResponse("Coupon not found", 404));

  if (code) {
    const existing = await Coupons.findOne({
      code: code.toUpperCase(),
      _id: { $ne: id },
    });
    if (existing)
      return next(new ErrorResponse("A coupon with this code already exists", 409));
    coupon.code = code.toUpperCase();
  }

  if (discountType) {
    if (!["percentage", "fixed"].includes(discountType))
      return next(new ErrorResponse("Invalid discount type", 422));
    coupon.discountType = discountType;
  }

  if (discountValue !== undefined) {
    if (
      coupon.discountType === "percentage" &&
      (discountValue < 0 || discountValue > 100)
    )
      return next(
        new ErrorResponse("Percentage discount must be between 0 and 100", 422)
      );
    coupon.discountValue = discountValue;
  }

  if (description !== undefined) coupon.description = description;
  if (minOrderAmount !== undefined) coupon.minOrderAmount = minOrderAmount;
  if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
  if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
  if (expiresAt !== undefined) coupon.expiresAt = expiresAt;
  if (isActive !== undefined) coupon.isActive = isActive;

  await coupon.save();

  return response.status(200).json({ success: true, coupon });
};

module.exports.deleteCoupon = async (request, response, next) => {
  const { id } = request.params;

  if (!id) return next(new ErrorResponse("Missing coupon ID", 422));

  const coupon = await Coupons.findById(id);
  if (!coupon) return next(new ErrorResponse("Coupon not found", 404));

  await Coupons.findByIdAndDelete(id);

  return response
    .status(200)
    .json({ success: true, data: "Coupon deleted successfully" });
};
