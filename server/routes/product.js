const router = require("express").Router();

const { protectVendor, protectUser } = require("../middleware/auth");

const {
  createProduct,
  uploadProductImage,
  getProducts,
  getProduct,
  getPetProducts,
  submitReview,
  getBestDeals,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  searchProducts,
} = require("../controllers/product");

router.route("/get/:slug").get(getProduct);
router.route("/search").get(searchProducts);

router.route("/:type/:category").get(getProducts);
router.route("/get").get(getPetProducts);
router.route("/best-deals").get(getBestDeals);
router.route("/create").post(protectVendor, uploadProductImage, createProduct);
router.route("/update").post(protectVendor, updateProduct);
router.route("/delete/:id").delete(protectVendor, deleteProduct);
router.route("/status/:id").post(protectVendor, updateProductStatus);

router.use(protectUser);

router.route("/rating").post(submitReview);

module.exports = router;
