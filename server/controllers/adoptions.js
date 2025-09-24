const path = require("path");
const multer = require("multer");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const fs = require("fs");

const ErrorResponse = require("../utils/ErrorResponse");
const Upload = require("../utils/Upload");
const { generateRandomId } = require("../utils/GenerateId");
const { createPaymentRequest, validatePayment } = require("../utils/Payment");
const { sendEmail } = require("../utils/SendMail");
const { generateInvoicePDF } = require("../utils/GeneratePDF");

const Users = require("../models/user.model");
const Adoptions = require("../models/adoption.model");
const AdoptionOrder = require("../models/adoption-order.model");

const approvalAdoptionTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/adoption/application-approve.hbs"),
  "utf-8"
);
const rejectedAdoptionTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/adoption/application-reject.hbs"),
  "utf-8"
);
const applicantAdoptionTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/adoption/adoption-applicant.hbs"),
  "utf-8"
);
const adoptionApplication = fs.readFileSync(
  path.join(__dirname, "../templates/adoption/application.hbs"),
  "utf-8"
);
const adminAdoptionTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/admin/adoption-invoice.hbs"),
  "utf-8"
);
const newAdoptionTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/admin/new-adoption.hbs"),
  "utf-8"
);
const adminApplicantApprove = fs.readFileSync(
  path.join(__dirname, "../templates/admin/adoption-application-approved.hbs"),
  "utf-8"
);
const adminApplicantReject = fs.readFileSync(
  path.join(__dirname, "../templates/admin/adoption-application-rejected.hbs"),
  "utf-8"
);

const invoiceTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/adoption/invoice.hbs"),
  "utf-8"
);

module.exports.createAdoption = async (request, response, next) => {
  const {
    name,
    species,
    gender,
    age,
    breed,
    size,
    vaccinated,
    neutered,
    color,
    location,
    phoneNumber,
    description,
  } = request.body;

  const { images } = request.files;

  // url of the api
  const url = request.protocol + "://" + request.get("host");

  if (!name || !location || !description)
    return next(new ErrorResponse("Missing information", 421));

  if (!images || images.length === 0)
    return next(new ErrorResponse("Missing images", 421));

  try {
    const formattedImages = images.map((image) => ({
      filename: image.filename,
      path: `${url}/uploads/adoptions/${image.filename}`,
    }));

    const adoption = await Adoptions.create({
      adoptionId: generateRandomId(20),
      status: "pending",
      name,
      species,
      gender,
      age,
      breed,
      size,
      vaccinated,
      neutered,
      location,
      description,
      phoneNumber,
      images: formattedImages,
      userId: request.user._id,
    });

    JSON.parse(color).map((c) => adoption.color.push(c));

    await adoption.save();

    await Users.findByIdAndUpdate(request.user._id, {
      $push: { adoptionIDs: adoption.id },
    });

    const message = handlebars.compile(newAdoptionTemplate)({
      name: adoption.name,
      cus_name: request.user.name,
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "Admin Notice",
      message,
    });

    return response
      .status(200)
      .json({ success: true, data: "Successfully created adoption" });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteAdoption = async (request, response, next) => {
  const { id } = request.params;

  const adoption = await Adoptions.findOne({ adoptionId: id });
  if (!adoption) return next(new ErrorResponse("No adoption found", 404));

  if (adoption.userId.toString() !== request.user._id.toString())
    return next(
      new ErrorResponse("Not authorized to delete this adoption", 403)
    );

  await Adoptions.findByIdAndDelete(adoption._id);
  await Users.findByIdAndUpdate(request.user._id, {
    $pull: { adoptionIDs: adoption._id },
  });

  return response
    .status(200)
    .json({ success: true, data: "Successfully deleted adoption" });
};

module.exports.getAdoptionsList = async (request, response, next) => {
  const adoptions = await Adoptions.find({ userId: request.user._id });
  return response.status(200).json({ success: true, adoptions });
};

module.exports.getAdoptions = async (request, response, next) => {
  const { count } = request.query;

  const filter = Object.entries(request.query).reduce((acc, [key, value]) => {
    // Skip count parameter, empty strings, null, or undefined values
    if (
      key === "count" ||
      value === "" ||
      value === null ||
      value === undefined
    )
      return acc;

    // Handle different field types
    if (
      [
        "age",
        "species",
        "breed",
        "gender",
        "size",
        "vaccinated",
        "location",
        "neutered",
      ].includes(key)
    ) {
      acc[key] = value; // Case-insensitive partial match
    } else if (key === "color") {
      acc[key] = { $in: value }; // Handle color array
    } else {
      acc[key] = value; // Handle exact match fields
    }
    return acc;
  }, {});

  filter.status = "approved"; // Ensure only approved adoptions are returned

  const adoptions = await Adoptions.find(filter)
    .skip(count * 40)
    .limit(40)
    .sort("-createdAt");

  const adoptionCount = await Adoptions.countDocuments({ status: "approved" });

  return response.status(200).json({
    success: true,
    adoptions,
    adoptionCount,
  });
};

module.exports.getAdoptionsWishlist = async (request, response, next) => {
  const ids = request.query.ids; // will be an array of strings
  const adoptionIds = ids.split(","); // convert to array

  const adoptions = await Adoptions.find({ adoptionId: { $in: adoptionIds } });

  return response.status(200).json({ success: true, adoptions });
};

module.exports.getAdoption = async (request, response, next) => {
  const { id } = request.params;

  const adoption = await Adoptions.findOne({
    adoptionId: id,
  }).populate("userId", "name avatar email");
  if (!adoption) return next(new ErrorResponse("No adoption found", 404));

  const moreAdoption = await Adoptions.find({ status: true }).limit(4);

  return response.status(200).json({ success: true, adoption, moreAdoption });
};

module.exports.getOrderDetails = async (request, response, next) => {
  const { id } = request.query;

  if (!id) return next(new ErrorResponse("Missing order ID", 421));

  const order = await AdoptionOrder.findById(id);

  if (!order) return next(new ErrorResponse("No order found", 404));

  return response.status(200).json({
    success: true,
    order: {
      orderId: order.orderId,
      status: order.status,
    },
  });
};

module.exports.updateOrderDetails = async (request, response, next) => {
  const { status, id } = request.body;

  const order = await AdoptionOrder.findById(id)
    .populate("adoptionId", "name")
    .populate("userId", "name email");
  if (!order) return next(new ErrorResponse("No order found", 404));

  const updateOrder = await AdoptionOrder.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updateOrder)
    return next(new ErrorResponse("Failed to update order", 500));

  const adoption = await Adoptions.findById(order.adoptionId).populate(
    "userId",
    "name email"
  );

  if (status === "Accepted") {
    const message = handlebars.compile(approvalAdoptionTemplate)({
      cus_name: order.userId.name,
      pet_name: order.adoptionId.name,
    });

    await Adoptions.findByIdAndUpdate(order.adoptionId, {
      status: "adopted",
    });

    // Send approval email
    await sendEmail({
      to: order.userId.email,
      subject: "Your Adoption Application Was Approved!",
      message,
    });
  } else if (status === "Rejected") {
    const message = handlebars.compile(rejectedAdoptionTemplate)({
      cus_name: order.userId.name,
      pet_name: order.adoptionId.name,
      orderId: order.orderId,
      amount: `${order.payment} BDT`,
    });

    // Send rejection email
    await sendEmail({
      to: order.userId.email,
      subject: "Your Adoption Fee Refund Is On Its Way! Application Rejected.",
      message,
    });
  }

  const adminMessage = handlebars.compile(
    status === "Accepted" ? adminApplicantApprove : adminApplicantReject
  )({
    applicant_name: order.userId.name,
    pet_name: order.adoptionId.name,
    poster_name: adoption.userId.name,
  });

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: "Admin Notice",
    message: adminMessage,
  });

  return response.status(200).json({
    success: true,
  });
};

module.exports.orderAdoption = async (request, response, next) => {
  const {
    adoptionId,
    name,
    payment,
    phoneNumber,
    area,
    address,
    whyAdopt,
    petProof,
    takeCareOfPet,
  } = request.body;

  if (
    !adoptionId ||
    !name ||
    !phoneNumber ||
    !area ||
    !address ||
    !payment ||
    !whyAdopt ||
    !petProof ||
    !takeCareOfPet
  )
    return next(new ErrorResponse("Missing information", 421));

  const orderId = generateRandomId(20);

  const sslURLs = {
    success: `/api/adoptions/validate`,
    fail: "/api/adoptions/validate",
    cancel: "/api/adoptions/validate",
    ipn: `/api/adoptions/validate`,
  };

  const paymentResponse = await createPaymentRequest(
    payment,
    orderId,
    "Biluibaba Adoption",
    "Adoption",
    1,
    0,
    request.user,
    sslURLs,
    address,
    phoneNumber
  );

  const order = await AdoptionOrder.create({
    orderId,
    status: "Pending",
    adoptionId,
    userId: request.user._id,
    name,
    phoneNumber,
    area,
    payment,
    address,
    whyAdopt,
    petProof,
    takeCareOfPet,
    paymentSessionKey: paymentResponse.sessionkey,
  });

  return response.status(200).json({
    success: true,
    url: paymentResponse.GatewayPageURL,
    order,
  });
};

module.exports.validateAdoptionOrder = async (request, response, next) => {
  const { status, val_id, value_a } = request.body;

  if (status === "VALID") {
    const paymentResponse = await validatePayment(val_id);

    if (
      paymentResponse.status === "VALID" ||
      paymentResponse.status === "VALIDATED"
    ) {
      const adoptionOrder = await AdoptionOrder.findOne({
        orderId: value_a,
      }).populate("userId", "email name");

      if (!adoptionOrder) return next(new ErrorResponse("No order found", 404));

      const adoption = await Adoptions.findById(
        adoptionOrder.adoptionId
      ).populate("userId", "email name");

      await Users.findByIdAndUpdate(adoptionOrder.userId, {
        $push: { invoiceIDs: adoptionOrder._id },
      });

      const pdfBuffer = await generateInvoicePDF(invoiceTemplate, {
        invoiceNo: adoptionOrder.orderId,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        cus_name: adoptionOrder.name,
        address: adoptionOrder.address,
        phoneNumber: adoptionOrder.phoneNumber,
        species: adoption.species,
        petName: adoption.name,
        fee: adoptionOrder.payment,
        paidBy: adoptionOrder.userId.name,
        status: "Paid",
        total: adoptionOrder.payment,
      });

      const message = handlebars.compile(applicantAdoptionTemplate)({
        cus_name: adoptionOrder.name,
        pet_name: adoption.name,
        orderId: adoptionOrder.orderId,
        amount: `${adoptionOrder.payment} BDT`,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      });

      const userMessage = handlebars.compile(adoptionApplication)({
        cus_name: adoption.userId.name,
        pet_name: adoption.name,
        name: adoptionOrder.name,
        address: adoptionOrder.address,
        phoneNumber: adoptionOrder.phoneNumber,
        region: adoptionOrder.area,
        payment: adoptionOrder.payment,
        whyAdopt: adoptionOrder.whyAdopt,
        petProof: adoptionOrder.petProof,
        takeCareOfPet: adoptionOrder.takeCareOfPet,
        orderId: adoptionOrder.id,
      });

      const adminMessage = handlebars.compile(adminAdoptionTemplate)({
        name: adoptionOrder.name,
        address: adoptionOrder.address,
        phoneNumber: adoptionOrder.phoneNumber,
        region: adoptionOrder.area,
        payment: adoptionOrder.payment,
        whyAdopt: adoptionOrder.whyAdopt,
        petProof: adoptionOrder.petProof,
        takeCareOfPet: adoptionOrder.takeCareOfPet,
        adoptionId: adoptionOrder.adoptionId,
      });

      await sendEmail({
        to: adoptionOrder.userId.email,
        subject: `Your Payment for “${adoption.name}” – Invoice #${adoptionOrder.orderId}`,
        message,
        attachments: [
          {
            filename: `Invoice-${adoptionOrder.orderId}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });

      await sendEmail({
        to: adoption.userId.email,
        subject: `New Adoption Application for “${adoption.name}”`,
        message: userMessage,
      });

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Admin Notice`,
        message: adminMessage,
      });

      return response
        .status(200)
        .redirect(
          `${process.env.FRONTEND_URL}/adoptions/status?status=success&id=${adoptionOrder.orderId}`
        );
    } else {
      await AdoptionOrder.findOneAndDelete({ orderId: value_a });
      return response
        .status(200)
        .redirect(`${process.env.FRONTEND_URL}/adoptions/status?status=failed`);
    }
  } else {
    await AdoptionOrder.findOneAndDelete({ orderId: value_a });
    return response
      .status(200)
      .redirect(`${process.env.FRONTEND_URL}/adoptions/status?status=failed`);
  }
};

const adoptionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/adoptions"));
  },
  filename: (req, file, cb) => {
    const id = generateRandomId(20);
    if (file.fieldname === "images")
      cb(
        null,
        "adoption-" +
          Date.now() +
          id.toString() +
          path.extname(file.originalname)
      );
  },
});

exports.uploadAdoptionImage = Upload(adoptionStorage).fields([
  {
    name: "images",
    maxCount: 5,
  },
]);
