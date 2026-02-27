const ErrorResponse = require("../../utils/ErrorResponse");
const Vets = require("../../models/vet.model");

module.exports.getVets = async (request, response, next) => {
  let { status, count } = request.query;

  if (!status || count === undefined)
    return next(new ErrorResponse("Missing information", 422));

  const filter = status === "approved" ? { status: true } : { status: false };

  const totalVets = await Vets.countDocuments(filter);

  const vets = await Vets.find(filter)
    .select("name email phoneNumber degree hospital status ratings totalReviews createdAt profilePicture")
    .skip(count * 10)
    .limit(10)
    .sort("-createdAt");

  return response.status(200).json({ success: true, vets, totalVets });
};

module.exports.getVetById = async (request, response, next) => {
  const { id } = request.params;

  if (!id) return next(new ErrorResponse("Missing vet ID", 422));

  const vet = await Vets.findById(id).select("-password -resetPasswordToken -resetPasswordExpire -verificationCode");

  if (!vet) return next(new ErrorResponse("Vet not found", 404));

  return response.status(200).json({ success: true, vet });
};

module.exports.updateVetStatus = async (request, response, next) => {
  const { status, vetId } = request.body;

  if (status === undefined || !vetId)
    return next(new ErrorResponse("Missing information", 422));

  const vet = await Vets.findById(vetId);

  if (!vet) return next(new ErrorResponse("Vet not found", 404));

  vet.status = status === "approved" ? true : false;

  await vet.save();

  return response.status(200).json({ success: true, vet });
};
