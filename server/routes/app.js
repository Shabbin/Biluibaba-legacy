const router = require("express").Router();

const { checkEmail, login, logout, forgotPassword, resetPassword } = require("../controllers/app");

router.route("/check-email").post(checkEmail);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

module.exports = router;