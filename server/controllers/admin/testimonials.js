const fs = require("fs");
const multer = require("multer");
const path = require("path");

const Upload = require("../../utils/Upload");
const ErrorResponse = require("../../utils/ErrorResponse");

const Testimonials = require("../../models/testimonial.model");

// Multer storage for testimonial images
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "./uploads/testimonials"),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`),
});

const upload = Upload(storage);

module.exports.uploadTestimonialImage = upload.single("image");

// Public: Get all active testimonials (sorted by display_order)
module.exports.getTestimonials = async (request, response, next) => {
  const testimonials = await Testimonials.find({ is_active: true }).sort({
    display_order: 1,
    createdAt: 1,
  });

  return response.status(200).json({ success: true, testimonials });
};

// Admin: Get all testimonials (active and inactive)
module.exports.getAllTestimonials = async (request, response, next) => {
  const testimonials = await Testimonials.find().sort({
    display_order: 1,
    createdAt: 1,
  });

  return response.status(200).json({ success: true, testimonials });
};

// Admin: Create a new testimonial
module.exports.createTestimonial = async (request, response, next) => {
  const { name, role, quote_title, review, display_order, is_active } =
    request.body;

  if (!name || !role || !quote_title || !review)
    return next(
      new ErrorResponse("name, role, quote_title and review are required", 422)
    );

  const imageData = request.file
    ? { filename: request.file.filename, path: request.file.filename }
    : { filename: "", path: "" };

  const testimonial = await Testimonials.create({
    name,
    role,
    quote_title,
    review,
    image: imageData,
    display_order: display_order ? Number(display_order) : 0,
    is_active:
      is_active !== undefined ? is_active === "true" || is_active === true : true,
  });

  return response.status(201).json({ success: true, testimonial });
};

// Admin: Update testimonial
module.exports.updateTestimonial = async (request, response, next) => {
  const { id } = request.params;
  const { name, role, quote_title, review, display_order, is_active } =
    request.body;

  const testimonial = await Testimonials.findById(id);
  if (!testimonial) return next(new ErrorResponse("Testimonial not found", 404));

  if (name) testimonial.name = name;
  if (role) testimonial.role = role;
  if (quote_title) testimonial.quote_title = quote_title;
  if (review) testimonial.review = review;
  if (display_order !== undefined)
    testimonial.display_order = Number(display_order);
  if (is_active !== undefined)
    testimonial.is_active = is_active === "true" || is_active === true;

  if (request.file) {
    // Remove old image file if it exists
    if (testimonial.image?.filename) {
      const oldFilePath = path.join(
        __dirname,
        "../../uploads/testimonials",
        testimonial.image.filename
      );
      if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
    }
    testimonial.image = {
      filename: request.file.filename,
      path: request.file.filename,
    };
  }

  await testimonial.save();

  return response.status(200).json({ success: true, testimonial });
};

// Admin: Delete testimonial
module.exports.deleteTestimonial = async (request, response, next) => {
  const { id } = request.params;

  const testimonial = await Testimonials.findById(id);
  if (!testimonial) return next(new ErrorResponse("Testimonial not found", 404));

  if (testimonial.image?.filename) {
    const filePath = path.join(
      __dirname,
      "../../uploads/testimonials",
      testimonial.image.filename
    );
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await testimonial.deleteOne();

  return response.status(200).json({
    success: true,
    data: "Testimonial deleted successfully",
  });
};
