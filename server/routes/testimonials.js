const router = require("express").Router();

const { getTestimonials } = require("../controllers/admin/testimonials");

// Public route — no auth required
router.route("/").get(getTestimonials);

module.exports = router;
