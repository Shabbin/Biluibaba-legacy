const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");

const ErrorResponse = require("../utils/ErrorResponse");
const { generateRandomId } = require("../utils/GenerateId");
const { createPaymentRequest, validatePayment } = require("../utils/Payment");
const { createDeliveryRequest } = require("../utils/Delivery");
const { sendEmail } = require("../utils/SendMail");
const { generateInvoicePDF } = require("../utils/GeneratePDF");

const Order = require("../models/order.model");
const Vendors = require("../models/vendor.model");
const Users = require("../models/user.model");
const Products = require("../models/product.model");

const OrderPlacedCOD = fs.readFileSync(
  path.join(__dirname, "../templates/order/order-placed-cod.hbs"),
  "utf-8"
);
const OrderPlacedOnline = fs.readFileSync(
  path.join(__dirname, "../templates/order/order-placed-online.hbs"),
  "utf-8"
);
const invoiceTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/order/invoice.hbs"),
  "utf-8"
);
const AdminNewOrder = fs.readFileSync(
  path.join(__dirname, "../templates/admin/new-order.hbs"),
  "utf-8"
);
const VendorNewOrder = fs.readFileSync(
  path.join(__dirname, "../templates/vendor/new-order.hbs"),
  "utf-8"
);

module.exports.createProductOrder = async (request, response, next) => {
  const {
    totalAmount,
    product,
    shippingCost,
    name,
    phoneNumber,
    region,
    area,
    fullAddress,
    notes,
    paymentMethod,
  } = request.body;

  // check if all information is provided
  if (
    !totalAmount ||
    !product ||
    !shippingCost ||
    !name ||
    !phoneNumber ||
    !region ||
    !area ||
    !fullAddress
  )
    return next(new ErrorResponse("Missing information", 421));

  let products = [];

  product.forEach((p) =>
    products.push({
      id: p.id,
      name: p.name,
      quantity: p.quantity,
      vendor: p.vendorId,
      price: p.price,
    })
  );

  let orderId = generateRandomId(20);

  const order = await Order.create({
    orderId,
    status: "pending",
    products,
    totalAmount,
    userId: request.user._id,
    shippingCost,
    name,
    phoneNumber,
    region,
    area,
    fullAddress,
    paymentMethod,
    paymentStatus: false,
    notes,
  });

  if (paymentMethod === "Online") {
    const sslURLs = {
      success: "/api/order/validate",
      fail: "/api/order/validate",
      cancel: "/api/order/validate",
      ipn: "/api/order/validate",
    };

    const paymentResponse = await createPaymentRequest(
      totalAmount,
      orderId,
      "Biluibaba Product",
      "Product",
      1,
      0,
      request.user,
      sslURLs,
      fullAddress,
      phoneNumber
    );

    order.paymentSessionKey = paymentResponse.sessionkey;
    await order.save();
    return response.status(200).json({
      success: true,
      orderId: order.orderId,
      url: paymentResponse.GatewayPageURL,
    });
  } else {
    await addOrderToVendors(order);

    const message = handlebars.compile(OrderPlacedCOD)({
      orderId: order.orderId,
    });

    const adminMessage = handlebars.compile(AdminNewOrder)({
      order_id: order.orderId,
      cus_name: order.name,
      payment_status: order.paymentMethod,
      total_amount: order.totalAmount,
    });

    const vendorMessage = handlebars.compile(VendorNewOrder)({
      order_id: order.orderId,
      cus_name: order.name,
      payment_status: order.paymentMethod,
    });

    await sendEmail({
      to: request.user.email,
      subject: "Order Confirmed - Cash on Delivery",
      message: message,
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Order Received - Cash on Delivery",
      message: adminMessage,
    });

    order.products.forEach(async (product) => {
      const p = await Products.findById(product.id);
      p.quantity = p.quantity - product.quantity;

      if (p.quantity <= 0) {
        p.quantity = 0;
        p.status = false;
      }
      await p.save();

      const vendor = await Vendors.findById(product.vendor);
      await sendEmail({
        to: vendor.email,
        subject: "New Order Received - Cash on Delivery",
        message: vendorMessage,
      });
    });

    const deliveryResponse = await createDeliveryRequest({
      invoice: order.orderId,
      recipient_name: order.name,
      recipient_phone: order.phoneNumber,
      recipient_address: order.fullAddress,
      cod_amount: order.totalAmount,
    });

    if (deliveryResponse.status === 200) {
      order.deliveryConsignmentId = deliveryResponse.consignment.consignment_id;
      order.deliveryStatus = deliveryResponse.consignment.status;
      order.deliveryTrackingCode = deliveryResponse.consignment.tracking_code;
    }

    await order.save();

    await Users.findByIdAndUpdate(order.userId, {
      $push: { invoiceIDs: order._id },
    });

    return response.status(200).json({
      success: true,
      orderId: order.orderId,
    });
  }
};

module.exports.validateProductOrder = async (request, response, next) => {
  const { status, val_id, value_a } = request.body;

  console.log("Payment status:", status);

  if (status === "VALID") {
    const paymentResponse = await validatePayment(val_id);

    if (
      paymentResponse.status === "VALID" ||
      paymentResponse.status === "VALIDATED"
    ) {
      const order = await Order.findOne({ orderId: value_a }).populate(
        "userId",
        "email"
      );

      if (!order) return next(new ErrorResponse("No order found", 404));

      await Users.findByIdAndUpdate(order.userId, {
        $push: { invoiceIDs: order._id },
      });

      order.paymentStatus = true;
      order.paymentSessionKey = val_id;

      const deliveryResponse = await createDeliveryRequest({
        invoice: order.orderId,
        recipient_name: order.name,
        recipient_phone: order.phoneNumber,
        recipient_address: order.fullAddress,
        cod_amount: 0,
      });

      if (deliveryResponse.status === 200) {
        order.deliveryConsignmentId =
          deliveryResponse.consignment.consignment_id;
        order.deliveryStatus = deliveryResponse.consignment.status;
        order.deliveryTrackingCode = deliveryResponse.consignment.tracking_code;
      }

      await order.save();

      await addOrderToVendors(order);

      const pdfBuffer = await generateInvoicePDF(invoiceTemplate, {
        invoiceNo: order.orderId,
        date: new Date().toLocaleDateString("en-US"),
        cus_name: order.name,
        address: order.fullAddress,
        phoneNumber: order.phoneNumber,
        paymentMethod: order.paymentMethod,
        items: order.products.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.price * item.quantity,
        })),
        subTotal: order.totalAmount - order.shippingCost,
        shipping: order.shippingCost,
        total: order.totalAmount,
        status: order.paymentStatus === false ? "Not Paid" : "Paid",
      });

      const message = handlebars.compile(OrderPlacedOnline)({
        orderId: order.orderId,
        amount: order.totalAmount,
      });

      const adminMessage = handlebars.compile(AdminNewOrder)({
        order_id: order.orderId,
        cus_name: order.name,
        payment_status: order.paymentMethod,
        total_amount: order.totalAmount,
      });

      const vendorMessage = handlebars.compile(VendorNewOrder)({
        order_id: order.orderId,
        cus_name: order.name,
        payment_status: order.paymentMethod,
      });

      await sendEmail({
        to: order.userId.email,
        subject: "Order Confirmed - Payment Received",
        message,
        attachments: [
          {
            filename: `Invoice-${order.orderId}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "New Order Received - Payment Received",
        message: adminMessage,
      });

      order.products.forEach(async (product) => {
        const p = await Products.findById(product.id);
        p.quantity = p.quantity - product.quantity;

        if (p.quantity <= 0) {
          p.quantity = 0;
          p.status = false;
        }
        await p.save();

        const vendor = await Vendors.findById(product.vendor);
        await sendEmail({
          to: vendor.email,
          subject: "New Order Received - Payment Received",
          message: vendorMessage,
        });
      });

      return response
        .status(200)
        .redirect(
          `${process.env.FRONTEND_URL}/products/order?status=success&orderId=${order.orderId}`
        );
    } else {
      await Order.findOneAndDelete({ orderId: value_a });
      return response
        .status(200)
        .redirect(`${process.env.FRONTEND_URL}/products/order?status=failed`);
    }
  } else {
    await Order.findOneAndDelete({ orderId: value_a });
    return response
      .status(200)
      .redirect(`${process.env.FRONTEND_URL}/products/order?status=failed`);
  }
};

module.exports.getOrderById = async (request, response, next) => {
  const { id } = request.params;

  if (!id) return next(new ErrorResponse("Missing order ID", 422));

  const order = await Order.findOne({
    orderId: id,
    userId: request.user._id,
  }).populate("products.id", "name images slug");

  if (!order) return next(new ErrorResponse("Order not found", 404));

  return response.status(200).json({ success: true, order });
};

module.exports.cancelOrder = async (request, response, next) => {
  const { orderId, reason } = request.body;

  if (!orderId) return next(new ErrorResponse("Missing order ID", 422));

  const order = await Order.findOne({
    orderId,
    userId: request.user._id,
  });

  if (!order) return next(new ErrorResponse("Order not found", 404));

  if (order.status === "delivered")
    return next(new ErrorResponse("Cannot cancel a delivered order. Please request a return instead.", 400));

  if (order.status === "cancelled")
    return next(new ErrorResponse("Order is already cancelled", 400));

  order.status = "cancelled";
  order.cancellationReason = reason || "Cancelled by customer";
  await order.save();

  return response.status(200).json({
    success: true,
    data: "Order cancelled successfully",
  });
};

module.exports.returnOrder = async (request, response, next) => {
  const { orderId, reason } = request.body;

  if (!orderId || !reason)
    return next(new ErrorResponse("Please provide order ID and reason for return", 422));

  const order = await Order.findOne({
    orderId,
    userId: request.user._id,
  });

  if (!order) return next(new ErrorResponse("Order not found", 404));

  if (order.status !== "delivered")
    return next(new ErrorResponse("Only delivered orders can be returned", 400));

  if (order.status === "returned")
    return next(new ErrorResponse("Return request already submitted", 400));

  order.status = "returned";
  order.returnReason = reason;
  await order.save();

  return response.status(200).json({
    success: true,
    data: "Return request submitted successfully",
  });
};

const addOrderToVendors = async (order) => {
  try {
    // Ensure the order has products and an orderId
    if (!order.products || !order.products.length || !order.orderId) {
      throw new Error("Invalid order data");
    }

    // Use a Set to track unique vendor IDs
    const uniqueVendorIds = new Set(
      order.products.map((product) => product.vendor.toString())
    );

    const updatePromises = Array.from(uniqueVendorIds).map(async (vendorId) => {
      const vendor = await Vendors.findById(vendorId);
      if (!vendor) {
        console.error(`Vendor with ID ${vendorId} not found`);
        return null;
      }

      // Only push if the orderId doesn't already exist
      if (!vendor.orderIDs.includes(order._id)) {
        return Vendors.findByIdAndUpdate(
          vendorId,
          { $push: { orderIDs: order._id } },
          { new: true, runValidators: true } // Returns the updated document and applies validation
        );
      }
      return vendor; // Return the existing vendor if no update is needed
    });

    // Await all update operations
    const updatedVendors = await Promise.all(updatePromises);

    return updatedVendors.filter((vendor) => vendor !== null); // Filter out null results
  } catch (error) {
    console.error("Error updating vendors:", error.message);
    throw error;
  }
};
