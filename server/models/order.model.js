const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderId: String,
    status: String,
    type: String,
    products: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductData" },
        name: String,
        quantity: Number,
        price: Number,
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: "VendorData" },
      },
    ],
    paymentMethod: String,
    paymentStatus: Boolean,
    paymentSessionKey: String,
    deliveryStatus: String,
    deliveryTrackingCode: String,
    deliveryConsignmentId: String,
    totalAmount: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
    shippingCost: Number,
    name: String,
    phoneNumber: String,
    region: String,
    area: String,
    fullAddress: String,
    notes: String,
    cancellationReason: String,
    returnReason: String,
  },
  { collection: "order-data", timestamps: true }
);

OrderSchema.post("save", async (document, next) => {
  try {
    if (document.status === true) {
      const Products = mongoose.model("ProductData");
      for (const product of document.products) {
        await Products.findByIdAndUpdate(
          product.id,
          { $inc: { orderCount: 1 } },
          { new: true }
        );
      }
    }
  } catch (error) {
    console.error("Error updating orderCount for products", error);
  }
  next();
});

const model = mongoose.model("OrderData", OrderSchema);

module.exports = model;
