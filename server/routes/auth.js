const express = require("express");
const router = express.Router();

const {
  login,
  register,
  authenticateFacebook,
  authenticateGoogle,
  getUserInfo,
  logoutUser,
} = require("../controllers/auth");

const { protectUser } = require("../middleware/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/facebook").get(authenticateFacebook);
router.route("/google").get(authenticateGoogle);

router.use(protectUser);

router.route("/me").get(getUserInfo);
router.route("/logout").get(logoutUser);

module.exports = router;
