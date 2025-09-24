const express = require("express");
const router = express.Router();

const {
  createAdoption,
  uploadAdoptionImage,
  getAdoptions,
  getAdoption,
  orderAdoption,
  validateAdoptionOrder,
  getAdoptionsList,
  getAdoptionsWishlist,
  deleteAdoption,
  getOrderDetails,
  updateOrderDetails,
} = require("../controllers/adoptions");

const { protectUser } = require("../middleware/auth");

router.route("/").get(getAdoptions);
router.route("/get/:id").get(getAdoption);
router.route("/validate").post(validateAdoptionOrder);
router.route("/application").get(getOrderDetails);
router.route("/application").post(updateOrderDetails);

router.use(protectUser);

router.route("/create").post(uploadAdoptionImage, createAdoption);
router.route("/order").post(orderAdoption);
router.route("/list").get(getAdoptionsList);
router.route("/wishlist").get(getAdoptionsWishlist);
router.route("/delete/:id").post(deleteAdoption);

module.exports = router;
