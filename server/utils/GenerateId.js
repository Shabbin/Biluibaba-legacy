const crypto = require("crypto");

module.exports.generateRandomId = (length = 32) => {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^A-Z0-9]/g, "")
    .substring(0, length);
};

module.exports.generateRoomId = () => {
  const groups = [3, 4, 3];
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let codeParts = groups.map((len) =>
    Array.from(
      { length: len },
      () => letters[Math.floor(Math.random() * letters.length)]
    ).join("")
  );
  return codeParts.join("-");
};
