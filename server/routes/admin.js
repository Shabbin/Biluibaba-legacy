const express = require("express");
const router = express.Router();

const { protectAdmin } = require("../middleware/auth");

const { login } = require("../controllers/admin");

const { getUsers } = require("../controllers/admin/users");

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
} = require("../controllers/admin/site-settings");

router.route("/login").post(login);
router.route("/site-settings").get(getSiteSettings);

// Protecting all other routes except login for admin
router.use(protectAdmin);

// User route
router.route("/users").get(getUsers);
router.route("/adoptions/fetch").get(getApprovedAdoptions);
router.route("/adoptions/status/:id").post(setAdoptionStatus);
router.route("/adoptions/order").get(getAdoptionOrders);
router.route("/adoptions/order/:id").get(getAdoptionOrderById);

// Vendor route
router.route("/vendors").get(getVendors);
router.route("/vendors/products").get(getProducts);
router.route("/vendors/:id").get(getVendorById);
router.route("/vendors/status").post(updateVendorStatus);

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

module.exports = router;
