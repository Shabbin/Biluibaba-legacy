const router = require("express").Router();

const {
  createVet,
  uploadVet,
  updateSlot,
  getVetDetails,
  updateAvailability,
  getVets,
  uploadProfilePicture,
  updateVet,
  getVet,
  getAllVetId,
  getExpertVets,
  bookAppointment,
  validateAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  getUpcomingAppointments,
  submitReview,
} = require("../controllers/vet");

const { protectVet, protectUser } = require("../middleware/auth");

router.route("/rating").post(protectUser, submitReview);

router.route("/").get(getExpertVets);
router.route("/get").get(getVets);
router.route("/get/:id").get(getVet);
router.route("/create").post(uploadVet, createVet);
router.route("/get-all-id").get(getAllVetId);
router.route("/appointment/create").post(protectUser, bookAppointment);
router.route("/appointment/validate").post(validateAppointment);

router.use(protectVet);

router.route("/me").get(getVetDetails);
router.route("/update").post(uploadProfilePicture, updateVet);
router.route("/update/slot").post(updateSlot);
router.route("/update/availability").post(updateAvailability);
router.route("/appointment").get(getAppointment);
router.route("/appointments").get(getAppointments);
router.route("/upcoming-appointments").get(getUpcomingAppointments);
router.route("/appointment/update").post(updateAppointment);

module.exports = router;
