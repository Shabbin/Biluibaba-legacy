const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const { sendEmail } = require("../../utils/SendMail");

const Adoptions = require("../../models/adoption.model");
const AdoptionOrders = require("../../models/adoption-order.model");

const approvalAdoptionTemplate = fs.readFileSync(
  path.join(__dirname, "../../templates/adoption/approval.hbs"),
  "utf-8"
);
const rejectedAdoptionTemplate = fs.readFileSync(
  path.join(__dirname, "../../templates/adoption/rejection.hbs"),
  "utf-8"
);

module.exports.getApprovedAdoptions = async (request, response, next) => {
  const { count, status } = request.query;

  const adoptions = await Adoptions.find({
    status,
  })
    .skip(count * 10)
    .limit(10)
    .sort("-createdAt")
    .select("name species userId createdAt images adoptionId")
    .populate("userId", "name email avatar");

  const totalAdoptions = await Adoptions.countDocuments({
    status,
  });

  return response
    .status(200)
    .json({ success: true, adoptions, totalAdoptions });
};

module.exports.setAdoptionStatus = async (request, response, next) => {
  const { id } = request.params;
  const { status } = request.body;

  const adoption = await Adoptions.findById(id).populate(
    "userId",
    "name email"
  );

  await Adoptions.findByIdAndUpdate(
    id,
    { status: status ? "approved" : "rejected" },
    { new: true }
  );

  if (!adoption) {
    return response
      .status(404)
      .json({ success: false, message: "Adoption not found" });
  }

  const message = handlebars.compile(
    status ? approvalAdoptionTemplate : rejectedAdoptionTemplate
  )({
    cus_name: adoption.userId.name,
    pet_name: adoption.name,
  });

  await sendEmail({
    to: adoption.userId.email,
    subject: status
      ? "Your Adoption Post Is Live"
      : "Your Adoption Post Needs Revision",
    message,
  });

  return response.status(200).json({ success: true, adoption });
};

module.exports.getAdoptionOrders = async (request, response, next) => {
  const { count } = request.query;

  const adoptionOrders = await AdoptionOrders.find()
    .skip(count * 10)
    .limit(10)
    .sort("-createdAt")
    .populate("adoptionId", "name species userId images adoptionId")
    .populate("userId", "name email avatar");

  const totalAdoptionOrders = await AdoptionOrders.countDocuments();

  return response.status(200).json({
    success: true,
    orders: adoptionOrders,
    totalOrders: totalAdoptionOrders,
  });
};

module.exports.getAdoptionOrderById = async (request, response, next) => {
  const { id } = request.params;

  const adoptionOrder = await AdoptionOrders.findOne({ orderId: id })
    .populate("adoptionId", "name species userId images adoptionId")
    .populate("userId", "name email avatar");

  if (!adoptionOrder) {
    return response
      .status(404)
      .json({ success: false, message: "Adoption order not found" });
  }

  return response.status(200).json({ success: true, order: adoptionOrder });
};
