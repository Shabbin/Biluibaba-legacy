const router = require("express").Router();

const { protectUser } = require("../middleware/auth");

const { validateCoupon, getActiveCoupons } = require("../controllers/coupon");

router.use(protectUser);

router.route("/validate").post(validateCoupon);
router.route("/active").get(getActiveCoupons);

module.exports = router;
