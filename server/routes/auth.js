const express = require("express");
const router = express.Router();

const {
  login,
  register,
  authenticateFacebook,
  authenticateGoogle,
  getUserInfo,
  logoutUser,
  updateUserInfo,
  getOrders,
  getBookings,
  forgotPassword,
  resetPassword,
  updateAvatar,
  uploadAvatar,
} = require("../controllers/auth");

const { protectUser } = require("../middleware/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/facebook").get(authenticateFacebook);
router.route("/google").get(authenticateGoogle);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

router.use(protectUser);

router.route("/me").get(getUserInfo);
router.route("/update-profile").post(updateUserInfo);
router.route("/update-avatar").post(uploadAvatar, updateAvatar);
router.route("/orders").get(getOrders);
router.route("/vet").get(getBookings);
router.route("/logout").get(logoutUser);

module.exports = router;
