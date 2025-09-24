const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: options.to,
    subject: options.subject,
    html: options.message,
    attachments: options.attachments || [],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Error sending email:", error);
    }
    console.log("Email sent successfully:", info.response);
  });
};

module.exports = {
  sendEmail,
};
