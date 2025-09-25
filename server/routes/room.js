const router = require("express").Router();

const { getAccessToken } = require("../controllers/room");

router.route("/token").post(getAccessToken);

module.exports = router;
