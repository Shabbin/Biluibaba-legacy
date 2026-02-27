const router = require("express").Router();

const {
  submitContactForm,
  subscribeNewsletter,
} = require("../controllers/contact");

router.route("/").post(submitContactForm);
router.route("/newsletter").post(subscribeNewsletter);

module.exports = router;
