const fs = require("fs");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

const Upload = require("../../utils/Upload");
const ErrorResponse = require("../../utils/ErrorResponse");

const SiteSettings = require("../../models/site-settings.model");
const Products = require("../../models/product.model");

//Site settings function
module.exports.getSiteSettings = async (request, response, next) => {
  const site = await SiteSettings.findOne().populate("best_deals.products.id");

  return response.status(200).json({ success: true, site });
};

module.exports.updateBestDealsDuration = async (request, response, next) => {
  const { duration } = request.body;

  const site = await SiteSettings.findOneAndUpdate(
    {},
    { $set: { "best_deals.duration": duration } },
    { new: true }
  );

  return response.status(200).json({ success: true, site });
};

module.exports.addBestDealsProduct = async (request, response, next) => {
  const { productId } = request.body;

  // Check if productId is provided
  if (!productId) return next(new ErrorResponse("No product id", 422));

  // Find product through product id
  const product = await Products.findOne({ productId });

  // Check if product exists
  if (!product)
    return response.status(200).json({
      success: false,
      message: "ProductID doesn't exist. Please try again!",
    });

  const site = await SiteSettings.findOne();

  const exists = site.best_deals.products.some(
    (p) => p.id.toString() === product._id.toString()
  );

  if (exists)
    return response.status(200).json({
      success: false,
      message: "Product already exists in best deals.",
    });

  site.best_deals.products.push({ id: product._id });

  await site.save();

  return response.status(200).json({ success: true, site });
};

module.exports.deleteBestDealsProduct = async (request, response, next) => {
  const { productId } = request.params;

  // Check if productId is provided
  if (!productId) return next(new ErrorResponse("No product id", 422));

  // Find the product through product id
  const product = await Products.findOne({ productId });

  const site = await SiteSettings.findOneAndUpdate(
    {},
    { $pull: { "best_deals.products": { id: product._id } } },
    { new: true }
  );

  return response.status(200).json({ success: true, site });
};

module.exports.updateProductLandingSliders = async (
  request,
  response,
  next
) => {
  let { slider } = request.files;

  // url of the api
  const url = request.protocol + "://" + request.get("host");

  // Check if slider is provided
  if (!slider || slider.length <= 0)
    return next(new ErrorResponse("No file", 422));

  let newImages = slider.map((file) => ({
    filename: file.filename,
    path: `${url}/uploads/site-settings/product-landing-slider/${file.filename}`,
  }));

  // Upload the slider images
  const site = await SiteSettings.findOneAndUpdate(
    { product_landing_slider: { $exists: true } },
    { $push: { product_landing_slider: { $each: newImages } } },
    { new: true }
  );

  return response.status(200).json({ success: true, site });
};

module.exports.deleteProductLandingSlider = async (request, response, next) => {
  let { filename } = request.params;

  // Check if filename is provided
  if (!filename) return next(new ErrorResponse("No file", 422));

  // Delete the slider image from the uploads folder
  fs.unlinkSync(
    path.join(
      __dirname,
      `../../uploads/site-settings/product-landing-slider/${filename}`
    )
  );

  // Delete the slider image from database
  const site = await SiteSettings.findOneAndUpdate(
    { product_landing_slider: { $exists: true } },
    { $pull: { product_landing_slider: { filename } } },
    { new: true }
  );

  return response.status(200).json({ success: true, site });
};

module.exports.updatePopularCategory = async (request, response, next) => {
  let { name, value } = request.body;
  let { category } = request.files;

  // url of the api
  const url = request.protocol + "://" + request.get("host");

  // Check if category is provided
  if (!category || category.length <= 0)
    return next(new ErrorResponse("No file", 422));
  if (!name || !value)
    return next(new ErrorResponse("Missing information", 422));

  const site = await SiteSettings.findOneAndUpdate(
    { popular_product_category: { $exists: true } },
    {
      $push: {
        popular_product_category: {
          category: name,
          categorySlug: value,
          image: `${url}/uploads/site-settings/popular-category/${category[0].filename}`,
        },
      },
    },
    { new: true }
  );

  return response.status(200).json({ success: true, site });
};

module.exports.deletePopularCategory = async (request, response, next) => {
  let { id } = request.params;

  // Check if id is provided
  if (!id) return next(new ErrorResponse("No id", 422));

  // Convert id to mongoose object id
  // It needs to be passed in using string interpolation to avoid casting errors
  // I don't know why but it counts id as a number but its actually a string. That's why typescript is the best
  const objectId = new mongoose.Types.ObjectId(`${id}`);

  const popularCategory = await SiteSettings.findOne(
    {
      "popular_product_category._id": objectId,
    },
    { "popular_product_category.$": 1 }
  );

  let filename = popularCategory.popular_product_category[0].image
    .split("/")
    .pop();

  // Delete the category image from the uploads folder
  fs.unlinkSync(
    path.join(
      __dirname,
      `../../uploads/site-settings/popular-category/${filename}`
    )
  );

  // Delete the slider image from database
  const site = await SiteSettings.findOneAndUpdate(
    { popular_product_category: { $exists: true } },
    {
      $pull: {
        popular_product_category: {
          image: popularCategory.popular_product_category[0].image,
        },
      },
    },
    { new: true }
  );

  return response.status(200).json({ success: true, site });
};

module.exports.getFeaturedProducts = async (request, response, next) => {
  const site = await SiteSettings.findOne({
    featured_product: { $exists: true },
  }).select("featured_product");

  // Find the product through the featured product id
  const product = await Products.findOne({ _id: site.featured_product });

  return response.status(200).json({ success: true, id: product.productId });
};

module.exports.updateFeaturedProduct = async (request, response, next) => {
  let { productId } = request.body;

  // Check if productId is provided
  if (!productId) return next(new ErrorResponse("No product id", 422));

  // Find product through product id
  const product = await Products.findOne({ productId });

  // Update the featured product
  const site = await SiteSettings.findOneAndUpdate(
    { featured_product: { $exists: true } },
    { $set: { featured_product: product._id } },
    { new: true }
  );

  return response.status(200).json({ success: true, site });
};

module.exports.updateProductBanner = async (request, response, next) => {
  let { banner } = request.files;

  // url of the api
  const url = request.protocol + "://" + request.get("host");

  const site = await SiteSettings.findOne();

  // Check if product banner one exists
  // If true then remove the previous file
  if (site.product_banner_one.filename !== "") {
    fs.unlinkSync(
      path.join(
        __dirname,
        `../../uploads/site-settings/${site.product_banner_one.filename}`
      )
    );
  }

  site.product_banner_one.filename = banner[0].filename;
  site.product_banner_one.path = `${url}/uploads/site-settings/${banner[0].filename}`;

  await site.save();

  return response.status(200).json({ success: true, site });
};

module.exports.updateBrandInSpotlight = async (request, response, next) => {
  let { name, slug } = request.body;
  let { brand } = request.files;

  // url of the api
  const url = request.protocol + "://" + request.get("host");

  // Check if brand is provided
  if (!brand || brand.length <= 0)
    return next(new ErrorResponse("No file", 422));
  if (!name || !slug)
    return next(new ErrorResponse("Missing information", 422));

  const site = await SiteSettings.findOneAndUpdate(
    { product_brands_in_spotlight: { $exists: true } },
    {
      $push: {
        product_brands_in_spotlight: {
          name: name,
          slug: slug,
          path: `${url}/uploads/site-settings/brand-in-spotlight/${brand[0].filename}`,
        },
      },
    },
    { new: true }
  );

  return response.status(200).json({ success: true, site });
};

module.exports.deleteBrandInSpotlight = async (request, response, next) => {
  let { id } = request.params;

  if (!id) return next(new ErrorResponse("No id", 422));

  const objectId = new mongoose.Types.ObjectId(`${id}`);

  const brandInSpotlight = await SiteSettings.findOne(
    {
      "product_brands_in_spotlight._id": objectId,
    },
    { "product_brands_in_spotlight.$": 1 }
  );

  let filename = brandInSpotlight.product_brands_in_spotlight[0].path
    .split("/")
    .pop();

  // Delete the brand image from the uploads folder
  fs.unlinkSync(
    path.join(
      __dirname,
      `../../uploads/site-settings/brand-in-spotlight/${filename}`
    )
  );

  // Delete the slider image from database
  const site = await SiteSettings.findOneAndUpdate(
    { product_brands_in_spotlight: { $exists: true } },
    {
      $pull: {
        product_brands_in_spotlight: {
          path: brandInSpotlight.product_brands_in_spotlight[0].path,
        },
      },
    },
    { new: true }
  );

  return response.status(200).json({ success: true, site });
};

module.exports.updateVetLandingSliders = async (request, response, next) => {
  let { slider } = request.files;

  // url of the api
  const url = request.protocol + "://" + request.get("host");

  // Check if slider is provided
  if (!slider || slider.length <= 0)
    return next(new ErrorResponse("No file", 422));

  let newImages = slider.map((file) => ({
    filename: file.filename,
    path: `${url}/uploads/site-settings/vet-landing-slider/${file.filename}`,
  }));

  // Upload the slider images
  const site = await SiteSettings.findOneAndUpdate(
    { vet_landing_slider: { $exists: true } },
    { $push: { vet_landing_slider: { $each: newImages } } },
    { new: true }
  );

  return response.status(200).json({ success: true, site });
};

module.exports.deleteVetLandingSlider = async (request, response, next) => {
  let { filename } = request.params;

  // Check if filename is provided
  if (!filename) return next(new ErrorResponse("No file", 422));

  // Delete the slider image from the uploads folder
  fs.unlinkSync(
    path.join(
      __dirname,
      `../../uploads/site-settings/vet-landing-slider/${filename}`
    )
  );

  // Delete the slider image from database
  const site = await SiteSettings.findOneAndUpdate(
    { vet_landing_slider: { $exists: true } },
    { $pull: { vet_landing_slider: { filename } } },
    { new: true }
  );

  return response.status(200).json({ success: true, site });
};

module.exports.updateVetBannerOne = async (request, response, next) => {
  let { banner } = request.files;

  const url = request.protocol + "://" + request.get("host");

  if (!banner || banner.length <= 0)
    return next(new ErrorResponse("No file", 422));

  const site = await SiteSettings.findOne();

  // Check if vet banner one exists
  // If true then remove the previous file
  if (site.vet_banner_one.filename !== "") {
    fs.unlinkSync(
      path.join(
        __dirname,
        `../../uploads/site-settings/${site.vet_banner_one.filename}`
      )
    );
  }

  site.vet_banner_one.filename = banner[0].filename;
  site.vet_banner_one.path = `${url}/uploads/site-settings/${banner[0].filename}`;

  await site.save();

  return response.status(200).json({ success: true, site });
};

module.exports.updateVetGridBanners = async (request, response, next) => {
  let { banner } = request.files;

  // url of the api
  const url = request.protocol + "://" + request.get("host");

  // Check if banner is provided
  if (!banner || banner.length <= 0)
    return next(new ErrorResponse("No file", 422));

  let newImages = banner.map((file) => ({
    filename: file.filename,
    path: `${url}/uploads/site-settings/vet-grid-banner/${file.filename}`,
  }));

  // Upload the banner images
  const site = await SiteSettings.findOneAndUpdate(
    { vet_grid_banners: { $exists: true } },
    { $push: { vet_grid_banners: { $each: newImages } } },
    { new: true }
  );

  return response.status(200).json({ success: true, site });
};

module.exports.deleteVetGridBanner = async (request, response, next) => {
  let { filename } = request.params;

  // Check if filename is provided
  if (!filename) return next(new ErrorResponse("No file", 422));

  // Delete the banner image from the uploads folder
  fs.unlinkSync(
    path.join(
      __dirname,
      `../../uploads/site-settings/vet-grid-banner/${filename}`
    )
  );

  // Delete the banner image from database
  const site = await SiteSettings.findOneAndUpdate(
    { vet_grid_banners: { $exists: true } },
    { $pull: { vet_grid_banners: { filename } } },
    { new: true }
  );

  return response.status(200).json({ success: true, site });
};

module.exports.updateAdoptionBannerOne = async (request, response, next) => {
  let { banner } = request.files;

  // url of the api
  const url = request.protocol + "://" + request.get("host");

  if (!banner || banner.length <= 0)
    return next(new ErrorResponse("No file", 422));

  const site = await SiteSettings.findOne();

  // Check if adoption banner one exists
  // If true then remove the previous file
  if (site.adoption_banner_one.length > 0) {
    fs.unlinkSync(
      path.join(
        __dirname,
        `../../uploads/site-settings/adoption-banner/${site.adoption_banner_one.filename}`
      )
    );
  }

  site.adoption_banner_one.filename = banner[0].filename;
  site.adoption_banner_one.path = `${url}/uploads/site-settings/${banner[0].filename}`;

  await site.save();

  return response.status(200).json({ success: true, site });
};

module.exports.updateAdoptionBannerTwo = async (request, response, next) => {
  let { banner } = request.files;

  // url of the api
  const url = request.protocol + "://" + request.get("host");

  if (!banner || banner.length <= 0)
    return next(new ErrorResponse("No file", 422));

  const site = await SiteSettings.findOne();

  // Check if adoption banner two exists
  // If true then remove the previous file
  if (site.adoption_banner_two.length > 0) {
    fs.unlinkSync(
      path.join(
        __dirname,
        `../../uploads/site-settings/adoption-banner/${site.adoption_banner_two.filename}`
      )
    );
  }

  site.adoption_banner_two.filename = banner[0].filename;
  site.adoption_banner_two.path = `${url}/uploads/site-settings/${banner[0].filename}`;

  await site.save();

  return response.status(200).json({ success: true, site });
};

module.exports.updateProductAd = async (request, response, next) => {
  const { title, description, button_text, button_link } = request.body;
  const url = request.protocol + "://" + request.get("host");

  const site = await SiteSettings.findOne();

  if (title !== undefined) site.product_ad.title = title;
  if (description !== undefined) site.product_ad.description = description;
  if (button_text !== undefined) site.product_ad.button_text = button_text;
  if (button_link !== undefined) site.product_ad.button_link = button_link;

  // Handle optional image upload
  if (request.files && request.files.image && request.files.image.length > 0) {
    const file = request.files.image[0];

    // Remove old image if it exists
    if (site.product_ad.image && site.product_ad.image.filename) {
      const oldPath = path.join(
        __dirname,
        `../../uploads/site-settings/product-ad/${site.product_ad.image.filename}`
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    site.product_ad.image.filename = file.filename;
    site.product_ad.image.path = `${url}/uploads/site-settings/product-ad/${file.filename}`;
  }

  await site.save();

  return response.status(200).json({ success: true, site });
};

const productLandingSliderStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../../uploads/site-settings/product-landing-slider");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(
      null,
      dir
    );
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "slider")
      cb(null, "slider-" + Date.now() + path.extname(file.originalname));
  },
});

const popularCategoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../../uploads/site-settings/popular-category")
    );
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "category")
      cb(null, "category-" + Date.now() + path.extname(file.originalname));
  },
});

const productBannerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/site-settings"));
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "banner")
      cb(null, "banner-" + Date.now() + path.extname(file.originalname));
  },
});

const brandInSpotlightStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../../uploads/site-settings/brand-in-spotlight")
    );
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "brand")
      cb(null, "brand-" + Date.now() + path.extname(file.originalname));
  },
});

const vetLandingSliderStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../../uploads/site-settings/vet-landing-slider")
    );
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "slider")
      cb(null, "slider-" + Date.now() + path.extname(file.originalname));
  },
});

const vetGridBannerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../../uploads/site-settings/vet-grid-banner")
    );
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "banner")
      cb(null, "banner-" + Date.now() + path.extname(file.originalname));
  },
});

const vetBannerOneStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/site-settings"));
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "banner")
      cb(null, "banner-" + Date.now() + path.extname(file.originalname));
  },
});

const adoptionBannerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../../uploads/site-settings/adoption-banner")
    );
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "banner")
      cb(null, "banner-" + Date.now() + path.extname(file.originalname));
  },
});

exports.uploadProductLandingSliders = Upload(
  productLandingSliderStorage
).fields([{ name: "slider", maxCount: 10 }]);

exports.uploadPopularCategory = Upload(popularCategoryStorage).fields([
  { name: "category", maxCount: 1 },
]);

exports.uploadProductBanner = Upload(productBannerStorage).fields([
  { name: "banner", maxCount: 1 },
]);

exports.uploadBrandInSpotlight = Upload(brandInSpotlightStorage).fields([
  { name: "brand", maxCount: 1 },
]);

exports.uploadVetLandingSliders = Upload(vetLandingSliderStorage).fields([
  { name: "slider", maxCount: 10 },
]);

exports.uploadVetGridBanners = Upload(vetGridBannerStorage).fields([
  { name: "banner", maxCount: 3 },
]);

exports.uploadVetBannerOne = Upload(vetBannerOneStorage).fields([
  { name: "banner", maxCount: 1 },
]);

exports.uploadAdoptionBanner = Upload(adoptionBannerStorage).fields([
  { name: "banner", maxCount: 1 },
]);

const productAdStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../../uploads/site-settings/product-ad");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "image")
      cb(null, "product-ad-" + Date.now() + path.extname(file.originalname));
  },
});

exports.uploadProductAd = Upload(productAdStorage).fields([
  { name: "image", maxCount: 1 },
]);
