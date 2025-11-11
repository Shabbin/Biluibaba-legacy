const path = require("path");
const fs = require("fs");
const multer = require("multer");
const slugify = require("slugify");
const handlebars = require("handlebars");

const ErrorResponse = require("../utils/ErrorResponse");
const Upload = require("../utils/Upload");
const { generateRandomId } = require("../utils/GenerateId");
const { sendEmail } = require("../utils/SendMail");

const Products = require("../models/product.model");
const Vendors = require("../models/vendor.model");
const SiteSettings = require("../models/site-settings.model");

const productReview = fs.readFileSync(
  path.join(__dirname, "../templates/vendor/product-review.hbs"),
  "utf-8"
);

module.exports.getProducts = async (request, response, next) => {
  let { category, type } = request.params;

  let products;

  if (type === "featured") products = await Products.find({ featured: true });
  else if (type === "parent")
    products = await Products.find({ categories: [{ parent: category }] });
  else if (type === "sub")
    products = await Products.find({ categories: [{ sub: category }] });

  return response.status(200).json({ success: true, products });
};

module.exports.searchProducts = async (request, response, next) => {
  const { query } = request.query;

  if (!query || query.trim() === "")
    return response.json({ success: true, products: [] });

  try {
    const products = await Products.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).limit(10);

    return response.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error searching products:", error);
    return response
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};

module.exports.getBestDeals = async (request, response, next) => {
  const { count } = request.query;

  const site = await SiteSettings.findOne({
    best_deals: { $exists: true },
  }).populate("best_deals.products.id");

  const startIndex = count * 40;
  const endIndex = startIndex + 40;
  const products = site.best_deals.products.slice(startIndex, endIndex);

  console.log(products);

  return response.status(200).json({
    success: true,
    products,
    totalProducts: site.best_deals.products.length,
    duration: site.best_deals.duration,
  });
};

module.exports.getPetProducts = async (request, response, next) => {
  try {
    const { parent, category, count } = request.query;

    // Base query to get all products under the parent category
    let baseQuery = { "categories.parent": parent };

    // Query for exact category (and sub-category if provided)
    let categoryQuery = { ...baseQuery, "categories.category": category };

    // Fetch products that match the exact category/sub-category
    let products = await Products.find(categoryQuery)
      .limit(40)
      .skip(count * 40)
      .sort("-createdAt");

    let totalProducts = await Products.countDocuments(categoryQuery);

    return response
      .status(200)
      .json({ success: true, products, totalProducts });
  } catch (error) {
    console.error("Error fetching pet products:", error);
    return response
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};

module.exports.getProduct = async (request, response, next) => {
  const { slug } = request.params;

  const product = await Products.findOne({ slug })
    .populate({
      path: "reviews.userId",
      select: "name avatar",
    })
    .populate({
      path: "vendorId",
      select: "storeName avatar _id",
    });

  const products = await Products.find({
    categories: { $elemMatch: { parent: product.categories[0].parent } },
    _id: { $ne: product._id },
  })
    .limit(10)
    .sort({ createdAt: -1 });

  if (!product) return next(new ErrorResponse("No product found", 404));

  return response.status(200).json({ success: true, product, products });
};

module.exports.submitReview = async (request, response, next) => {
  const { productId, comment, rating } = request.body;

  if (!productId || !rating)
    return next(new ErrorResponse("Missing information", 422));

  if (rating < 1 || rating > 5)
    return next(new ErrorResponse("Invalid rating value", 422));

  try {
    const product = await Products.findOne({ productId });

    if (!product) return next(new ErrorResponse("Product not found", 404));

    const review = {
      userId: request.user.id,
      comment,
      rating,
      date: new Date(),
    };

    product.reviews.push(review);
    product.totalRatings += rating;
    product.totalReviews += 1;

    // Update ratings breakdown
    switch (rating) {
      case 5:
        product.ratingBreakdown.excellent += 1;
        break;
      case 4:
        product.ratingBreakdown.veryGood += 1;
        break;
      case 3:
        product.ratingBreakdown.good += 1;
        break;
      case 2:
        product.ratingBreakdown.average += 1;
        break;
      case 1:
        product.ratingBreakdown.poor += 1;
        break;
    }

    await product.save();

    return response
      .status(200)
      .json({ success: true, message: "Review added" });
  } catch (error) {
    console.error(error);
    return next(new ErrorResponse("Server error", 500));
  }
};

module.exports.createProduct = async (request, response, next) => {
  let { name, description, categories, tags, size, price, discount, quantity } =
    request.body;

  const url = request.protocol + "://" + request.get("host");

  const uploadImages = request.files.images.map((file) => ({
    filename: file.filename,
    path: url + "/uploads/product/" + file.filename,
  }));

  let productId = generateRandomId(32);

  try {
    let product = await Products.create({
      productId,
      slug: slugify(name, { lower: true }) + "-" + productId,
      status: false,
      name,
      description,
      categories,
      price: Number(price),
      size: Number(size),
      quantity: Number(quantity),
      discount: Number(discount),
      tags,
      images: uploadImages,
      orderCount: 0,
      featured: false,
      vendorId: request.vendor.id,
      vendorName: request.vendor.storeName,
      ratings: 0,
      views: 0,
      isDeleted: false,
    });

    await Vendors.findByIdAndUpdate(request.vendor.id, {
      $push: { productIDs: product._id },
      $inc: { totalListedProducts: 1 },
    });

    const message = handlebars.compile(productReview)({
      vendor_name: request.vendor.name,
      product_name: product.name,
    });

    await sendEmail({
      to: request.vendor.email,
      subject: "Product Submitted – Pending Review",
      message,
    });

    return response
      .status(200)
      .json({ success: true, productId: product.productId });
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse("Missing information", 421));
  }
};

module.exports.updateProduct = async (request, response, next) => {
  let {
    name,
    description,
    categories,
    tags,
    size,
    price,
    discount,
    quantity,
    productId,
  } = request.body;

  console.log(request.body);

  try {
    const product = await Products.findOne({ productId });

    if (!product) return next(new ErrorResponse("Product not found", 421));

    product.status = false;
    product.name = name;
    product.description = description;
    product.categories = categories;
    product.tags = tags;
    product.size = Number(size);
    product.price = Number(price);
    product.discount = Number(discount);
    product.quantity = Number(quantity);

    await product.save();

    return response
      .status(200)
      .json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    return next(new ErrorResponse("Server error", 500));
  }
};

module.exports.updateProductStatus = async (request, response, next) => {
  const { id } = request.params;

  if (!id) return next(new ErrorResponse("Missing product ID", 422));

  const product = await Products.findOne({ productId: id });

  if (!product) return next(new ErrorResponse("Product not found", 404));

  product.status = false;
  await product.save();

  return response
    .status(200)
    .json({ success: true, message: "Product unpublished" });
};

module.exports.deleteProduct = async (request, response, next) => {
  const { id } = request.params;

  if (!id) return next(new ErrorResponse("Missing product ID", 422));

  const product = await Products.findOne({ productId: id });

  if (!product) return next(new ErrorResponse("Product not found", 404));

  product.images.map((image) => {
    fs.unlinkSync(path.join(__dirname, "../uploads/product", image.filename));
  });

  await Products.deleteOne({ productId });

  return response
    .status(200)
    .json({ success: true, message: "Product permanently deleted" });
};

const productImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/product"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

exports.uploadProductImage = Upload(productImageStorage).fields([
  { name: "images", maxCount: 4 },
]);
