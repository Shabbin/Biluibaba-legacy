const Users = require("../../models/user.model");

module.exports.getUsers = async (request, response, next) => {
  const { count } = request.query;

  const users = await Users.find()
    .skip(count * 10)
    .limit(10)
    .sort("-createdAt")
    .select("name email avatar createdAt");

  return response.status(200).json({ success: true, users });
};
