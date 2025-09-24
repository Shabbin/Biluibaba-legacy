const router = require("express").Router();

const { protectUser } = require("../middleware/auth");

const {
  createProductOrder,
  validateProductOrder,
} = require("../controllers/order");

router.route("/validate").post(validateProductOrder);

// Protect user
router.use(protectUser);

router.route("/").post(createProductOrder);

module.exports = router;
