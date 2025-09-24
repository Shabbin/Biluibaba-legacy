const crypto = require("crypto");

module.exports.generateRandomId = (length = 32) => {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^A-Z0-9]/g, "")
    .substring(0, length);
};
