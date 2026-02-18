const path = require("path");
const fs = require("fs");
const multer = require("multer");
const handlebars = require("handlebars");

const ErrorResponse = require("../utils/ErrorResponse");
const Upload = require("../utils/Upload");
const { sendEmail } = require("../utils/SendMail");

const Vendor = require("../models/vendor.model");
const Products = require("../models/product.model");
const Orders = require("../models/order.model");

const vendorReview = fs.readFileSync(
  path.join(__dirname, "../templates/vendor/new-signup.hbs"),
  "utf-8"
);

module.exports.createVendor = async (request, response, next) => {
  let {
    type,
    name,
    phoneNumber,
    email,
    storeName,
    storeAddress,
    state,
    area,
    district,
    postcode,
    fullAddress,
    pickupAddress,
    nidNumber,
    companyRegistration,
    tin,
    tradeLicense,
    bankAccountType,
    bankAccountName,
    bankAccountNumber,
    password,
  } = request.body;
  let { nidFront, nidBack } = request.files || {};

  // Validate required fields and pinpoint missing ones
  const missingFields = [];
  
  if (!type) missingFields.push("Vendor type");
  if (!name) missingFields.push("Full name");
  if (!phoneNumber) missingFields.push("Phone number");
  if (!email) missingFields.push("Email address");
  if (!storeName) missingFields.push("Store name");
  if (!storeAddress) missingFields.push("Store address");
  if (!state) missingFields.push("State/Division");
  if (!area) missingFields.push("Area/Thana");
  if (!district) missingFields.push("District");
  if (!postcode) missingFields.push("Postcode");
  if (!pickupAddress) missingFields.push("Pickup address");
  if (!nidFront || !nidFront[0]) missingFields.push("NID front image");
  if (!nidBack || !nidBack[0]) missingFields.push("NID back image");
  if (!nidNumber) missingFields.push("NID number");
  if (!tin) missingFields.push("TIN");
  if (!tradeLicense) missingFields.push("Trade license");
  if (!bankAccountType) missingFields.push("Bank account type");
  if (!bankAccountName) missingFields.push("Bank account holder name");
  if (!bankAccountNumber) missingFields.push("Bank account number");
  if (!password) missingFields.push("Password");
  
  if (type === "Company" && !companyRegistration) {
    missingFields.push("Company registration number");
  }

  if (missingFields.length > 0) {
    const errorMessage = `Missing required fields: ${missingFields.join(", ")}`;
    return next(new ErrorResponse(errorMessage, 422));
  }

  try {
    let vendor = await Vendor.create({
      status: "pending",
      type,
      name,
      phoneNumber,
      email,
      storeName,
      password,
      verified: false,
      address: {
        store: storeAddress,
        state,
        area,
        district,
        postcode,
        fullAddress,
        pickupAddress,
      },
      nid: {
        front: nidFront[0].filename,
        back: nidBack[0].filename,
        number: nidNumber,
      },
      companyRegistration,
      tax: {
        tin,
        tradeLicense,
      },
      bank: {
        accountType: bankAccountType,
        accountName: bankAccountName,
        accountNumber: bankAccountNumber,
      },
    });

    const message = handlebars.compile(vendorReview)({
      vendor_name: vendor.name,
    });

    await sendEmail({
      to: vendor.email,
      subject: "Your Vendor Application is Under Review",
      message,
    });

    if (vendor)
      return response
        .status(200)
        .json({ success: true, data: "Vendor Created" });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Server Error", 500));
  }
};

module.exports.fetchAllProducts = async (request, response, next) => {
  let { count, type } = request.query;

  let products = [];
  let totalProducts = [];
  if (type === "all") {
    products = await Products.find({ vendorId: request.vendor.id })
      .skip(count * 10)
      .limit(10)
      .sort("-createdAt");
    totalProducts = await Products.find({
      vendorId: request.vendor.id,
    }).countDocuments();
  } else if (type === "published") {
    products = await Products.find({
      vendorId: request.vendor.id,
      status: true,
    })
      .skip(count * 10)
      .limit(10)
      .sort("-createdAt");
    totalProducts = await Products.find({
      vendorId: request.vendor.id,
      status: true,
    }).countDocuments();
  }
  return response.status(200).json({ success: true, products, totalProducts });
};

module.exports.fetchAllOrders = async (request, response, next) => {
  const { count, type } = request.query;

  let orders = [];
  let totalOrders = [];
  if (type === "all") {
    orders = await Vendor.findById(request.vendor.id)
      .populate({
        path: "orderIDs",
        select: "orderId status totalAmount paymentMethod createdAt",
        options: { skip: count * 10, limit: 10, sort: "-createdAt" },
      })
      .populate({
        path: "orderIDs.userId",
        select: "name phoneNumber",
      });
    totalOrders = await Vendor.findById(request.vendor.id)
      .populate("orderIDs")
      .countDocuments();
  } else if (type === "pending") {
    orders = await Vendor.findById(request.vendor.id)
      .populate({
        path: "orderIDs",
        select: "orderId status totalAmount paymentMethod createdAt",
        options: { skip: count * 10, limit: 10, sort: "-createdAt" },
        match: { status: "pending" },
      })
      .populate({
        path: "orderIDs.userId",
        select: "name phoneNumber",
      });

    totalOrders = await Vendor.findById(request.vendor.id)
      .populate({
        path: "orderIDs",
        match: { status: "pending" },
      })
      .countDocuments();
  }

  return response.status(200).json({ success: true, orders, totalOrders });
};

module.exports.fetchOrder = async (request, response, next) => {
  const { id } = request.params;

  const order = await Orders.findOne({ orderId: id }).populate({
    path: "userId",
    select: "name invoiceIDs email phoneNumber",
  });

  if (!order)
    return response
      .status(404)
      .json({ success: false, message: "No order found" });

  const filteredProducts = order.products.filter(
    (product) => product.vendor.toString() === request.vendor.id.toString()
  );

  return response.status(200).json({
    success: true,
    order: {
      ...order.toObject(),
      products: filteredProducts,
    },
  });
};

module.exports.getProduct = async (request, response, next) => {
  const { id } = request.params;

  const product = await Products.findOne({ productId: id }).populate({
    path: "vendorId",
    select: "name email phoneNumber",
  });

  if (!product)
    return response
      .status(404)
      .json({ success: false, message: "No product found" });

  return response.status(200).json({ success: true, product });
};

const vendorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/vendor"));
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "nidFront")
      cb(null, "nidFront-" + Date.now() + path.extname(file.originalname));
    if (file.fieldname === "nidBack")
      cb(null, "nidBack-" + Date.now() + path.extname(file.originalname));
  },
});

exports.uploadVendor = Upload(vendorStorage).fields([
  { name: "nidFront", maxCount: 1 },
  { name: "nidBack", maxCount: 1 },
]);

const sendToken = async (vendor, statusCode, response) => {
  const token = vendor.getSignedToken();
  response
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "strict",
    })
    .json({ success: true });
};
