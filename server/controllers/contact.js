const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

const ErrorResponse = require("../utils/ErrorResponse");
const { sendEmail } = require("../utils/SendMail");

const contactTemplate = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #FF6B61;">New Contact Form Submission</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{{name}}</td></tr>
    <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{{email}}</td></tr>
    <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{{phone}}</td></tr>
    <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Subject:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{{subject}}</td></tr>
  </table>
  <h3 style="margin-top: 20px;">Message:</h3>
  <p style="background: #f9f9f9; padding: 16px; border-radius: 8px;">{{message}}</p>
</div>
`;

module.exports.submitContactForm = async (request, response, next) => {
  const { name, email, phone, subject, message } = request.body;

  if (!name || !email || !subject || !message)
    return next(new ErrorResponse("Please fill in all required fields", 422));

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return next(new ErrorResponse("Please provide a valid email address", 422));

  const compiledTemplate = handlebars.compile(contactTemplate);
  const htmlMessage = compiledTemplate({ name, email, phone: phone || "Not provided", subject, message });

  await sendEmail({
    to: process.env.ADMIN_EMAIL || "support@biluibaba.com",
    subject: `Contact Form: ${subject}`,
    message: htmlMessage,
  });

  return response.status(200).json({
    success: true,
    data: "Your message has been sent successfully. We'll get back to you soon!",
  });
};

module.exports.subscribeNewsletter = async (request, response, next) => {
  const { email } = request.body;

  if (!email)
    return next(new ErrorResponse("Please provide an email address", 422));

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return next(new ErrorResponse("Please provide a valid email address", 422));

  // For now, we send a notification to admin about the new subscriber
  // In the future, integrate with a mailing list service (Mailchimp, etc.)
  const Users = require("../models/user.model");

  // Check if user exists and update their promotional emails preference
  const user = await Users.findOne({ email });
  if (user) {
    user.promotionalEmails = true;
    await user.save();
  }

  await sendEmail({
    to: process.env.ADMIN_EMAIL || "support@biluibaba.com",
    subject: "New Newsletter Subscriber",
    message: `<p>New newsletter subscription from: <strong>${email}</strong></p>`,
  });

  return response.status(200).json({
    success: true,
    data: "You've been subscribed to our newsletter!",
  });
};
