const express = require("express");
const router = express.Router();

const { protectAdmin } = require("../middleware/auth");

const { login } = require("../controllers/admin");

const {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  uploadTestimonialImage,
} = require("../controllers/admin/testimonials");

const { getUsers } = require("../controllers/admin/users");
const { getStats } = require("../controllers/admin/stats");

const {
  getVets,
  getVetById,
  updateVetStatus,
} = require("../controllers/admin/vets");

const {
  getVendors,
  getProducts,
  getOrders,
  fetchOrder,
  updateOrderStatus,
  getProduct,
  updateProductStatus,
  getVendorById,
  updateVendorStatus,
} = require("../controllers/admin/vendors");

const {
  getApprovedAdoptions,
  setAdoptionStatus,
  getAdoptionOrders,
  getAdoptionOrderById,
} = require("../controllers/admin/adoptions");

const {
  getSiteSettings,
  uploadProductLandingSliders,
  updateProductLandingSliders,
  deleteProductLandingSlider,
  uploadPopularCategory,
  updatePopularCategory,
  deletePopularCategory,
  updateFeaturedProduct,
  uploadProductBanner,
  updateProductBanner,
  uploadBrandInSpotlight,
  updateBrandInSpotlight,
  deleteBrandInSpotlight,
  uploadVetLandingSliders,
  updateVetLandingSliders,
  deleteVetLandingSlider,
  uploadVetGridBanners,
  updateVetGridBanners,
  deleteVetGridBanner,
  uploadVetBannerOne,
  updateVetBannerOne,
  uploadAdoptionBanner,
  updateAdoptionBannerOne,
  updateAdoptionBannerTwo,
  addBestDealsProduct,
  deleteBestDealsProduct,
  updateBestDealsDuration,
  updateProductAd,
  uploadProductAd,
} = require("../controllers/admin/site-settings");

router.route("/login").post(login);
router.route("/site-settings").get(getSiteSettings);

// Protecting all other routes except login for admin
router.use(protectAdmin);

// User route
router.route("/users").get(getUsers);
router.route("/stats").get(getStats);
router.route("/adoptions/fetch").get(getApprovedAdoptions);
router.route("/adoptions/status/:id").post(setAdoptionStatus);
router.route("/adoptions/order").get(getAdoptionOrders);
router.route("/adoptions/order/:id").get(getAdoptionOrderById);

// Vendor route
router.route("/vendors").get(getVendors);
router.route("/vendors/products").get(getProducts);
router.route("/vendors/:id").get(getVendorById);
router.route("/vendors/status").post(updateVendorStatus);

// Vet routes
router.route("/vets").get(getVets);
router.route("/vets/status").post(updateVetStatus);
router.route("/vets/:id").get(getVetById);

router.route("/orders").get(getOrders);
router.route("/orders/:id").get(fetchOrder);
router.route("/orders/status").post(updateOrderStatus);

router.route("/products/:productId").get(getProduct);
router.route("/products/status").post(updateProductStatus);

//Site settings route
router
  .route("/site-settings/product-landing-slider")
  .post(uploadProductLandingSliders, updateProductLandingSliders);
router
  .route("/site-settings/product-landing-slider/:filename")
  .delete(deleteProductLandingSlider);
router
  .route("/site-settings/popular-category")
  .post(uploadPopularCategory, updatePopularCategory);
router
  .route("/site-settings/popular-category/:id")
  .delete(deletePopularCategory);
router.route("/site-settings/featured-product").post(updateFeaturedProduct);
router
  .route("/site-settings/product-banner-one")
  .post(uploadProductBanner, updateProductBanner);
router
  .route("/site-settings/brand-in-spotlight")
  .post(uploadBrandInSpotlight, updateBrandInSpotlight);
router
  .route("/site-settings/brand-in-spotlight/:id")
  .delete(deleteBrandInSpotlight);
router
  .route("/site-settings/vet-landing-slider")
  .post(uploadVetLandingSliders, updateVetLandingSliders);
router
  .route("/site-settings/vet-landing-slider/:filename")
  .delete(deleteVetLandingSlider);
router
  .route("/site-settings/vet-grid-banners")
  .post(uploadVetGridBanners, updateVetGridBanners);
router
  .route("/site-settings/vet-grid-banners/:filename")
  .delete(deleteVetGridBanner);
router
  .route("/site-settings/vet-banner-one")
  .post(uploadVetBannerOne, updateVetBannerOne);
router
  .route("/site-settings/adoption-banner-one")
  .post(uploadAdoptionBanner, updateAdoptionBannerOne);
router
  .route("/site-settings/adoption-banner-two")
  .post(uploadAdoptionBanner, updateAdoptionBannerTwo);
router.route("/site-settings/best-deals/products").post(addBestDealsProduct);
router
  .route("/site-settings/best-deals/products/:productId")
  .delete(deleteBestDealsProduct);
router.route("/site-settings/best-deals").post(updateBestDealsDuration);
router
  .route("/site-settings/product-ad")
  .post(uploadProductAd, updateProductAd);

// Testimonials routes
router.route("/testimonials").get(getAllTestimonials);
router
  .route("/testimonials/create")
  .post(uploadTestimonialImage, createTestimonial);
router
  .route("/testimonials/:id")
  .put(uploadTestimonialImage, updateTestimonial)
  .delete(deleteTestimonial);

module.exports = router;
