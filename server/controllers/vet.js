const fs = require("fs");
const path = require("path");
const multer = require("multer");
const handlebars = require("handlebars");

const ErrorResponse = require("../utils/ErrorResponse");
const Upload = require("../utils/Upload");

const User = require("../models/user.model");
const Vet = require("../models/vet.model");
const Appointments = require("../models/appointment.model");

const { generateRandomId } = require("../utils/GenerateId");
const { parseTime, calculateTimeSlot } = require("../utils/Time");
const { createPaymentRequest, validatePayment } = require("../utils/Payment");
const { generateInvoicePDF } = require("../utils/GeneratePDF");
const { sendEmail } = require("../utils/SendMail");

const physicalAppointmentConfirm = fs.readFileSync(
  path.join(__dirname, "../templates/appointments/physical-confirm.hbs"),
  "utf-8"
);
const physicalAppointmentCancel = fs.readFileSync(
  path.join(__dirname, "../templates/appointments/physical-cancel.hbs"),
  "utf-8"
);
const physicalAppointmentVet = fs.readFileSync(
  path.join(__dirname, "../templates/appointments/physical-vet.hbs"),
  "utf-8"
);
const physicalAppointmentAdmin = fs.readFileSync(
  path.join(__dirname, "../templates/admin/physical-appointment.hbs"),
  "utf-8"
);
const invoiceTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/appointments/invoice.hbs"),
  "utf-8"
);

module.exports.getVets = async (request, response, next) => {
  const { type } = request.query;

  if (!type) return next(new ErrorResponse("Missing information", 421));

  const vets = await Vet.find({
    [`appointments.${type}.status`]: true,
    status: true,
  });

  if (vets) return response.status(200).json({ success: true, vets });
};

module.exports.getExpertVets = async (request, response, next) => {
  const vets = await Vet.find().limit(6);

  return response.status(200).json({ success: true, vets });
};

module.exports.getVet = async (request, response, next) => {
  const { id } = request.params;

  const vet = await Vet.findById(id);

  if (vet) return response.status(200).json({ success: true, vet });
};

module.exports.getAllVetId = async (request, response, next) => {
  const vets = await Vet.find({ status: true }).select("_id");

  if (vets) return response.status(200).json({ success: true, vets });
};

module.exports.bookAppointment = async (request, response, next) => {
  const {
    petName,
    petConcern,
    vetId,
    date,
    time,
    totalAmount,
    type,
    phoneNumber,
    species,
    detailedConcern,
    homeAddress,
  } = request.body;

  if (
    !petName ||
    !petConcern ||
    !vetId ||
    !date ||
    !time ||
    !totalAmount ||
    !type ||
    !species ||
    !detailedConcern ||
    !phoneNumber
  )
    return next(new ErrorResponse("Missing information", 421));

  try {
    const appointment = await Appointments.create({
      status: "pending",
      appointmentId: generateRandomId(20),
      petName,
      petConcern,
      species,
      vet: vetId,
      user: request.user._id,
      date,
      time,
      totalAmount,
      phoneNumber,
      type,
      detailedConcern,
      homeAddress: type === "homeService" ? homeAddress : "",
    });

    const sslURLs = {
      success: "/api/vet/appointment/validate",
      fail: "/api/vet/appointment/validate",
      cancel: "/api/vet/appointment/validate",
      ipn: "/api/vet/appointment/validate",
    };

    const paymentResponse = await createPaymentRequest(
      totalAmount,
      appointment.appointmentId,
      "Biluibaba Vet Appointment",
      "Appointment",
      1,
      0,
      request.user,
      sslURLs,
      "",
      phoneNumber
    );

    appointment.paymentSessionKey = paymentResponse.sessionkey;
    await appointment.save();

    return response.status(200).json({
      success: true,
      appointmentId: appointment.appointmentId,
      url: paymentResponse.GatewayPageURL,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Server Error", 500));
  }
};

module.exports.validateAppointment = async (request, response, next) => {
  const { status, val_id, value_a } = request.body;

  if (status === "VALID") {
    const paymentResponse = await validatePayment(val_id);

    if (
      paymentResponse.status === "VALID" ||
      paymentResponse.status === "VALIDATED"
    ) {
      const appointment = await Appointments.findOne({ appointmentId: value_a })
        .populate("vet")
        .populate("user");
      const user = await User.findById(appointment.user._id);

      if (!appointment)
        return next(new ErrorResponse("No appointment found", 404));

      await User.findByIdAndUpdate(appointment.user._id, {
        $push: { appointmentIDs: appointment._id },
      });

      appointment.status = "confirmed";
      appointment.paymentStatus = true;
      appointment.paymentSessionKey = val_id;

      user.appointmentIDs.push(appointment._id);

      await appointment.save();
      await user.save();

      const pdfBuffer = await generateInvoicePDF(invoiceTemplate, {
        invoiceNo: appointment.appointmentId,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        vet_name: appointment.vet.name,
        degree: appointment.vet.degree,
        license: appointment.vet.license,
        pet_name: appointment.petName,
        species: appointment.species,
        breed: appointment.breed,
        service: "Appointment",
        type:
          appointment.type === "physical" || appointment.type === "homeService"
            ? "Physical Visit"
            : "Online Visit",
        price: appointment.totalAmount.toFixed(2),
        subTotal: appointment.totalAmount.toFixed(2),
        total: appointment.totalAmount.toFixed(2),
      });

      const userMessage = await handlebars.compile(physicalAppointmentConfirm)({
        pet_name: appointment.petName,
        name: user.name,
        date: appointment.date,
        time: appointment.time,
        vet_name: appointment.vet.name,
        location: appointment.vet.address.fullAddress,
        total_amount: appointment.totalAmount.toFixed(2),
      });

      const message = await handlebars.compile(physicalAppointmentVet)({
        pet_name: appointment.petName,
        cus_name: user.name,
        date: appointment.date,
        time: appointment.time,
        location: appointment.vet.address.fullAddress,
        notes: appointment.detailedConcern || "N/A",
      });

      const adminMessage = await handlebars.compile(physicalAppointmentAdmin)({
        appointment_id: appointment.appointmentId,
        pet_name: appointment.petName,
        cus_name: user.name,
        date: appointment.date,
        time: appointment.time,
        address: appointment.vet.address.fullAddress,
        total_amount: appointment.totalAmount.toFixed(2),
      });

      await sendEmail({
        to: appointment.user.email,
        subject: `Appointment Confirmed: ${appointment.petName} on ${appointment.date}`,
        message: userMessage,
        attachments: [
          {
            filename: `Invoice-${appointment.appointmentId}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });

      await sendEmail({
        to: appointment.vet.email,
        subject: `New ${appointment.type} appointment: ${appointment.petName} on ${appointment.date}`,
        message,
      });

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New ${appointment.type} appointment booked (ID: ${appointment.appointmentId})`,
        message: adminMessage,
      });

      return response
        .status(200)
        .redirect(
          `${process.env.FRONTEND_URL}/vets/status?status=success&id=${appointment.appointmentId}`
        );
    }
  } else {
    await Appointments.findOneAndDelete({ appointmentId: value_a });

    return response
      .status(200)
      .redirect(`${process.env.FRONTEND_URL}/vets/status?status=failed`);
  }
};

module.exports.getUpcomingAppointments = async (request, response, next) => {
  const { count } = request.query;
  try {
    const now = new Date();
    const currentDateStr = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const currentTime = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    let query = Appointments.find({ status: "confirmed", vet: request.vet._id })
      .populate("vet", "name email phone")
      .populate("user", "name email phone");

    const appointments = await query;

    const upcomingAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(
        appointment.date.replace(/(\d+)(st|nd|rd|th)/, "$1")
      );
      const currentDate = new Date(currentDateStr);

      appointmentDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (appointmentDate.getTime() !== currentDate.getTime()) {
        return appointmentDate > currentDate;
      }

      return appointment.time > currentTime;
    });

    let paginatedAppointments = upcomingAppointments;
    if (count !== undefined) {
      const start = count * 10;
      const end = start + 10;
      paginatedAppointments = upcomingAppointments.slice(start, end);
    }

    return response.status(200).json({
      success: true,
      appointments: paginatedAppointments,
      totalAppointments: upcomingAppointments.length,
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorResponse(error.message, 500));
  }
};

module.exports.updateAppointment = async (request, response, next) => {
  const { id, status, prescription } = request.body;

  const appointment = await Appointments.findById(id)
    .populate("vet")
    .populate("user");

  if (!appointment) return next(new ErrorResponse("No appointment found", 404));

  if (status === "completed") {
    appointment.status = "completed";
    appointment.prescription = prescription;

    await appointment.save();

    return response
      .status(200)
      .json({ success: true, data: "Appointment Updated" });
  } else if (status === "cancelled") {
    const message = await handlebars.compile(physicalAppointmentCancel)({
      name: appointment.user.name,
      date: appointment.date,
      time: appointment.time,
      total_amount: appointment.totalAmount.toFixed(2),
    });

    await sendEmail({
      to: appointment.user.email,
      subject: `Appointment Cancelled: ${appointment.petName} on ${appointment.date}`,
      message,
    });

    appointment.status = "cancelled";
    await appointment.save();

    return response
      .status(200)
      .json({ success: true, data: "Appointment Cancelled" });
  } else {
    return response
      .status(404)
      .json({ success: false, message: "Invalid Status" });
  }
};

module.exports.getAppointments = async (request, response, next) => {
  const { type, count } = request.query;

  if (!type) return next(new ErrorResponse("Missing information", 421));

  const appointments = await Appointments.find({
    vet: request.vet._id,
    status:
      type === "all"
        ? { $in: ["pending", "confirmed", "completed", "cancelled"] }
        : type,
  })
    .skip(10 * count)
    .limit(10)
    .populate("user", "name email phone")
    .sort("-createdAt");

  const totalAppointments = await Appointments.countDocuments({
    vet: request.vet._id,
    status: type,
  });

  return response
    .status(200)
    .json({ success: true, appointments, totalAppointments });
};

module.exports.getAppointment = async (request, response, next) => {
  const { id } = request.query;

  if (!id) return next(new ErrorResponse("Missing information", 421));

  const appointment = await Appointments.findOne({
    appointmentId: id,
    vet: request.vet._id,
  })
    .populate("user", "name email avatar")
    .populate("vet", "name email phone address");

  if (!appointment) return next(new ErrorResponse("No appointment found", 404));

  return response.status(200).json({ success: true, appointment });
};

module.exports.createVet = async (request, response, next) => {
  const {
    name,
    email,
    phoneNumber,
    password,
    gender,
    address,
    nidNumber,
    degree,
    license,
    hospital,
    tin,
    specializedZone,
    state,
    district,
    postcode,
    fullAddress,
    bankAccountType,
    bankAccountName,
    bankAccountNumber,
  } = request.body;
  const { nidFront, nidBack, certificate } = request.files;

  if (
    !name ||
    !email ||
    !phoneNumber ||
    !password ||
    !gender ||
    !nidNumber ||
    !degree ||
    !license ||
    !tin ||
    !specializedZone ||
    !bankAccountType ||
    !bankAccountName ||
    !bankAccountNumber ||
    !state ||
    !district ||
    !postcode ||
    !fullAddress
  )
    return next(new ErrorResponse("Missing information", 421));

  let specializedZoneArray = [];
  for (const [key, value] of Object.entries(JSON.parse(specializedZone))) {
    specializedZoneArray.push({
      pet: value.pet,
      concerns: [...value.concerns.map((concern) => concern.value)],
    });
  }

  try {
    const vet = await Vet.create({
      status: false,
      verified: false,
      name,
      email,
      phoneNumber,
      password,
      gender,
      address: {
        state,
        district,
        postcode,
        fullAddress,
      },
      degree,
      license,
      hospital,
      certificate: certificate[0].filename,
      nid: {
        front: nidFront[0].filename,
        back: nidBack[0].filename,
        number: nidNumber,
      },
      tax: {
        tin,
      },
      specializedZone: specializedZoneArray,
      bank: {
        accountType: bankAccountType,
        accountName: bankAccountName,
        accountNumber: bankAccountNumber,
      },
    });

    if (vet)
      return response.status(200).json({ success: true, data: "Vet Created" });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Server Error", 500));
  }
};

module.exports.getVetDetails = async (request, response, next) => {
  const vet = await Vet.findById(request.vet.id).select("-password");

  if (vet) return response.status(200).json({ success: true, vet });
};

module.exports.updateVet = async (request, response, next) => {
  const { name, bio } = request.body;
  const { filename } = request.file;

  const url = request.protocol + "://" + request.get("host");

  const vet = await Vet.findById(request.vet.id);

  vet.name = name;
  vet.bio = bio;
  vet.profilePicture = url + "/uploads/profile/" + filename;

  await vet.save();

  return response.status(200).json({ success: true, data: "Vet Updated" });
};

module.exports.updateSlot = async (request, response, next) => {
  const { slots } = request.body;

  const vet = await Vet.findById(request.vet.id);

  vet.appointments.slots.monday.startTime = slots.monday.startTime;
  vet.appointments.slots.monday.endTime = slots.monday.endTime;
  vet.appointments.slots.monday.duration = Number(slots.monday.duration);
  vet.appointments.slots.monday.interval = Number(slots.monday.interval);
  vet.appointments.slots.monday.availableSlots = calculateTimeSlot(
    parseTime(slots.monday.startTime),
    parseTime(slots.monday.endTime),
    Number(slots.monday.duration),
    Number(slots.monday.interval)
  );

  vet.appointments.slots.tuesday.startTime = slots.tuesday.startTime;
  vet.appointments.slots.tuesday.endTime = slots.tuesday.endTime;
  vet.appointments.slots.tuesday.duration = Number(slots.tuesday.duration);
  vet.appointments.slots.tuesday.interval = Number(slots.tuesday.interval);
  vet.appointments.slots.tuesday.availableSlots = calculateTimeSlot(
    parseTime(slots.tuesday.startTime),
    parseTime(slots.tuesday.endTime),
    Number(slots.tuesday.duration),
    Number(slots.tuesday.interval)
  );

  vet.appointments.slots.wednesday.startTime = slots.wednesday.startTime;
  vet.appointments.slots.wednesday.endTime = slots.wednesday.endTime;
  vet.appointments.slots.wednesday.duration = Number(slots.wednesday.duration);
  vet.appointments.slots.wednesday.interval = Number(slots.wednesday.interval);
  vet.appointments.slots.wednesday.availableSlots = calculateTimeSlot(
    parseTime(slots.wednesday.startTime),
    parseTime(slots.wednesday.endTime),
    Number(slots.wednesday.duration),
    Number(slots.wednesday.interval)
  );

  vet.appointments.slots.thursday.startTime = slots.thursday.startTime;
  vet.appointments.slots.thursday.endTime = slots.thursday.endTime;
  vet.appointments.slots.thursday.duration = Number(slots.thursday.duration);
  vet.appointments.slots.thursday.interval = Number(slots.thursday.interval);
  vet.appointments.slots.thursday.availableSlots = calculateTimeSlot(
    parseTime(slots.thursday.startTime),
    parseTime(slots.thursday.endTime),
    Number(slots.thursday.duration),
    Number(slots.thursday.interval)
  );

  vet.appointments.slots.friday.startTime = slots.friday.startTime;
  vet.appointments.slots.friday.endTime = slots.friday.endTime;
  vet.appointments.slots.friday.duration = Number(slots.friday.duration);
  vet.appointments.slots.friday.interval = Number(slots.friday.interval);
  vet.appointments.slots.friday.availableSlots = calculateTimeSlot(
    parseTime(slots.friday.startTime),
    parseTime(slots.friday.endTime),
    Number(slots.friday.duration),
    Number(slots.friday.interval)
  );

  vet.appointments.slots.saturday.startTime = slots.saturday.startTime;
  vet.appointments.slots.saturday.endTime = slots.saturday.endTime;
  vet.appointments.slots.saturday.duration = Number(slots.saturday.duration);
  vet.appointments.slots.saturday.interval = Number(slots.saturday.interval);
  vet.appointments.slots.saturday.availableSlots = calculateTimeSlot(
    parseTime(slots.saturday.startTime),
    parseTime(slots.saturday.endTime),
    Number(slots.saturday.duration),
    Number(slots.saturday.interval)
  );

  vet.appointments.slots.sunday.startTime = slots.sunday.startTime;
  vet.appointments.slots.sunday.endTime = slots.sunday.endTime;
  vet.appointments.slots.sunday.duration = Number(slots.sunday.duration);
  vet.appointments.slots.sunday.interval = Number(slots.sunday.interval);
  vet.appointments.slots.sunday.availableSlots = calculateTimeSlot(
    parseTime(slots.sunday.startTime),
    parseTime(slots.sunday.endTime),
    Number(slots.sunday.duration),
    Number(slots.sunday.interval)
  );

  await vet.save();

  return response.status(200).json({ success: true, data: "Slot Updated" });
};

module.exports.updateAvailability = async (request, response, next) => {
  const {
    physical,
    online,
    emergency,
    homeService,
    instantChat,
    physicalFee,
    onlineFee,
    emergencyFee,
    homeServiceFee,
  } = request.body;

  const vet = await Vet.findById(request.vet.id);

  vet.appointments.physical.status = physical;
  vet.appointments.online.status = online;
  vet.appointments.emergency.status = emergency;
  vet.appointments.homeService.status = homeService;
  vet.appointments.instantChat.status = instantChat;
  vet.appointments.physical.fee = physicalFee;
  vet.appointments.online.fee = onlineFee;
  vet.appointments.emergency.fee = emergencyFee;
  vet.appointments.homeService.fee = homeServiceFee;

  await vet.save();

  return response
    .status(200)
    .json({ success: true, data: "Availability Updated" });
};

const vetStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/vet"));
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "nidFront")
      cb(null, "nidFront-" + Date.now() + path.extname(file.originalname));
    if (file.fieldname === "nidBack")
      cb(null, "nidBack-" + Date.now() + path.extname(file.originalname));
    if (file.fieldname === "certificate")
      cb(null, "certificate-" + Date.now() + path.extname(file.originalname));
  },
});

const profilePictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/profile"));
  },
  filename: function (req, file, cb) {
    cb(null, "profile-" + Date.now() + path.extname(file.originalname));
  },
});

exports.uploadProfilePicture = Upload(profilePictureStorage).single("profile");

exports.uploadVet = Upload(vetStorage).fields([
  { name: "nidFront", maxCount: 1 },
  { name: "nidBack", maxCount: 1 },
  { name: "certificate", maxCount: 1 },
]);
