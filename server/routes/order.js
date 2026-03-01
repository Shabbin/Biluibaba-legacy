const router = require("express").Router();

const { protectUser } = require("../middleware/auth");

const {
  createProductOrder,
  validateProductOrder,
  getOrderById,
  cancelOrder,
  returnOrder,
} = require("../controllers/order");

router.route("/validate").post(validateProductOrder);

// Protect user
router.use(protectUser);

router.route("/").post(createProductOrder);
router.route("/cancel").post(cancelOrder);
router.route("/return").post(returnOrder);
router.route("/:id").get(getOrderById);

module.exports = router;
