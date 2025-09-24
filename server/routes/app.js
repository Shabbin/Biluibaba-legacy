const router = require("express").Router();

const { checkEmail, login, logout } = require("../controllers/app");

router.route("/check-email").post(checkEmail);
router.route("/login").post(login);
router.route("/logout").post(logout);

module.exports = router;