const router = require("express").Router();

const { protectVendor } = require("../middleware/auth");
const {
  uploadVendor,
  createVendor,
  fetchAllProducts,
  fetchAllOrders,
  fetchOrder,
  getProduct,
  getPublicStore,
} = require("../controllers/vendor");

router.route("/create").post(uploadVendor, createVendor);
router.route("/store/:id").get(getPublicStore);

router.use(protectVendor);

router.route("/products").get(fetchAllProducts);
router.route("/products/:id").get(getProduct);
router.route("/orders").get(fetchAllOrders);
router.route("/order/:id").get(fetchOrder);

module.exports = router;
