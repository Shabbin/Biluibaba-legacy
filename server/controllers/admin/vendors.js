const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");

const ErrorResponse = require("../../utils/ErrorResponse");
const { sendEmail } = require("../../utils/SendMail");

const Vendors = require("../../models/vendor.model");
const Products = require("../../models/product.model");
const Order = require("../../models/order.model");

const OrderDispatched = fs.readFileSync(
  path.join(__dirname, "../../templates/order/order-dispatched.hbs"),
  "utf-8"
);
const DeliveryCOD = fs.readFileSync(
  path.join(__dirname, "../../templates/order/delivery-cod.hbs"),
  "utf-8"
);
const DeliveryOnline = fs.readFileSync(
  path.join(__dirname, "../../templates/order/delivery-prepaid.hbs"),
  "utf-8"
);
const OrderCancelled = fs.readFileSync(
  path.join(__dirname, "../../templates/order/order-cancelled.hbs"),
  "utf-8"
);
const OrderRefund = fs.readFileSync(
  path.join(__dirname, "../../templates/order/order-refund.hbs"),
  "utf-8"
);
const invoiceTemplate = fs.readFileSync(
  path.join(__dirname, "../../templates/order/invoice.hbs"),
  "utf-8"
);
const vendorApproved = fs.readFileSync(
  path.join(__dirname, "../../templates/vendor/approved.hbs"),
  "utf-8"
);
const vendorRejected = fs.readFileSync(
  path.join(__dirname, "../../templates/vendor/rejected.hbs"),
  "utf-8"
);
const productApproved = fs.readFileSync(
  path.join(__dirname, "../../templates/vendor/product-approved.hbs"),
  "utf-8"
);
const productRejected = fs.readFileSync(
  path.join(__dirname, "../../templates/vendor/product-rejected.hbs"),
  "utf-8"
);

// Vendor functions
module.exports.getVendors = async (request, response, next) => {
  let { status, count } = request.query;

  // Check if status and count are provided
  if (!status || !count)
    return next(new ErrorResponse("Missing information", 422));

  // Provides a list of vendors based on the status and count
  let vendors = await Vendors.find({ status })
    .skip(count * 10)
    .limit(10)
    .sort("-createdAt");

  console.log(vendors);

  return response.status(200).json({ success: true, vendors });
};

module.exports.getVendorById = async (request, response, next) => {
  const { id } = request.params;

  if (!id) return next(new ErrorResponse("Missing vendor ID", 422));

  const vendor = await Vendors.findById(id);

  if (!vendor) return next(new ErrorResponse("Vendor not found", 404));

  return response.status(200).json({ success: true, vendor });
};

module.exports.updateVendorStatus = async (request, response, next) => {
  const { status, vendorId } = request.body;

  if (!status || !vendorId)
    return next(new ErrorResponse("Missing information", 422));

  const vendor = await Vendors.findById(vendorId);

  if (!vendor) return next(new ErrorResponse("Vendor not found", 404));

  vendor.status = status;

  await vendor.save();

  const message = handlebars.compile(
    status === "approved" ? vendorApproved : vendorRejected
  )({
    vendor_name: vendor.name,
  });

  await sendEmail({
    to: vendor.email,
    subject:
      status === "approved"
        ? "Welcome Aboard – Vendor Account Approved"
        : "Vendor Application Status – Not Approved",
    message,
  });

  return response.status(200).json({ success: true, vendor });
};

module.exports.getProducts = async (request, response, next) => {
  const { count, type } = request.query;

  let products = [];
  let totalProducts = [];
  if (type === "unpublished") {
    products = await Products.find({ status: false })
      .skip(count * 10)
      .limit(10)
      .sort("-createdAt")
      .populate("vendorId", "name email phoneNumber");
    totalProducts = await Products.countDocuments({ status: false });
  } else if (type === "published") {
    products = await Products.find({ status: true })
      .skip(count * 10)
      .limit(10)
      .sort("-createdAt")
      .populate("vendorId", "name email phoneNumber");
    totalProducts = await Products.countDocuments({ status: true });
  }

  return response.status(200).json({ success: true, products, totalProducts });
};

module.exports.getProduct = async (request, response, next) => {
  const { productId } = request.params;

  if (!productId) return next(new ErrorResponse("Missing product ID", 422));

  const product = await Products.findOne({ productId }).populate(
    "vendorId",
    "name email _id"
  );

  if (!product) return next(new ErrorResponse("Product not found", 404));

  return response.status(200).json({ success: true, product });
};

module.exports.updateProductStatus = async (request, response, next) => {
  const { status, productId } = request.body;

  const product = await Products.findOne({ productId }).populate(
    "vendorId",
    "name email _id"
  );

  if (!product) return next(new ErrorResponse("Product not found", 404));

  product.status = status;
  await product.save();

  const message = handlebars.compile(
    status ? productApproved : productRejected
  )({
    vendor_name: product.vendorId.name,
    product_name: product.name,
  });

  await sendEmail({
    to: product.vendorId.email,
    subject: status
      ? "Product Approved – Now Live"
      : "Product Submission Not Approved",
    message,
  });

  return response.status(200).json({ success: true, product });
};

module.exports.getOrders = async (request, response, next) => {
  const { count, type } = request.query;

  let orders = [];
  let totalOrders = [];
  if (type === "all") {
    orders = await Order.find()
      .skip(count * 10)
      .limit(10)
      .sort("-updatedAt");
    totalOrders = await Order.countDocuments();
  } else if (type === "pending") {
    orders = await Order.find({ status: "pending" })
      .skip(count * 10)
      .limit(10)
      .sort("-updatedAt");
    totalOrders = await Order.countDocuments({ status: "pending" });
  }

  return response.status(200).json({ success: true, orders, totalOrders });
};

module.exports.fetchOrder = async (request, response, next) => {
  const { id } = request.params;

  // Check if order ID is provided
  if (!id) return next(new ErrorResponse("Missing order ID", 422));

  // Fetch the order by ID
  const order = await Order.findOne({ orderId: id })
    .populate("userId", "name phoneNumber invoiceIDs email")
    .populate("products.vendor");

  // If order not found, return error
  if (!order) return next(new ErrorResponse("Order not found", 404));

  return response.status(200).json({ success: true, order });
};

module.exports.updateOrderStatus = async (request, response, next) => {
  const { status, id } = request.body;

  // Check if order ID and status are provided
  if (!id || !status)
    return next(new ErrorResponse("Missing order ID or status", 422));

  // Update the order status
  const updatedOrder = await Order.findOneAndUpdate(
    { orderId: id },
    { status },
    { new: true }
  )
    .populate("userId", "name phoneNumber invoiceIDs email")
    .populate("products.vendor");

  let pdfBuffer = null;

  if (status === "delivered") {
    updatedOrder.paymentStatus = true;
    await updatedOrder.save();

    pdfBuffer = await generateInvoicePDF({
      invoiceNo: updatedOrder.orderId,
      date: new Date().toLocaleDateString("en-US"),
      cus_name: updatedOrder.name,
      address: updatedOrder.fullAddress,
      phoneNumber: updatedOrder.phoneNumber,
      paymentMethod: updatedOrder.paymentMethod,
      items: updatedOrder.products.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.price * item.quantity,
      })),
      subTotal: updatedOrder.totalAmount - updatedOrder.shippingCost,
      shipping: updatedOrder.shippingCost,
      total: updatedOrder.totalAmount,
      status: updatedOrder.paymentStatus === false ? "Not Paid" : "Paid",
    });
  }

  const delivery =
    updatedOrder.paymentMethod === "Online" ? DeliveryOnline : DeliveryCOD;

  const message = handlebars.compile(
    status === "cancelled"
      ? OrderCancelled
      : status === "refunded"
      ? OrderRefund
      : status === "dispatched"
      ? OrderDispatched
      : status === "delivered"
      ? delivery
      : null
  )({
    order_id: id,
    amount: updatedOrder.totalAmount,
  });

  await sendEmail({
    to: updatedOrder.userId.email,
    subject:
      status === "dispatched"
        ? "Your order is on the way!"
        : status === "delivered"
        ? "Order delivered successfully"
        : status === "cancelled"
        ? "Your order has been cancelled"
        : status === "refunded"
        ? "Refund process - order cancellation"
        : "",
    message,
    attachments: pdfBuffer
      ? [
          {
            filename: `Invoice-${updatedOrder.orderId}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ]
      : [],
  });

  // If order not found, return error
  if (!updatedOrder) return next(new ErrorResponse("Order not found", 404));

  return response.status(200).json({ success: true, order: updatedOrder });
};

const generateInvoicePDF = async (invoiceData) => {
  let browser = null;

  try {
    let html;
    try {
      html = handlebars.compile(invoiceTemplate)(invoiceData);
    } catch (error) {
      console.error("Error compiling invoice template:", error.message);
      throw new Error("Failed to compile invoice template");
    }

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1696 });

    await page.setContent(html, {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 30000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating invoice PDF:", error.message);
  } finally {
    // Always close the browser to prevent memory leaks
    if (browser) {
      await browser.close();
    }
  }
};
