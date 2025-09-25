const {
  jwt: { AccessToken },
} = require("twilio");

const ErrorResponse = require("../utils/ErrorResponse");

const Appointments = require("../models/appointment.model");

const VideoGrant = AccessToken.VideoGrant;
const MAX_ALLOWED_SESSION_DURATION = 14400;

module.exports.getAccessToken = async (request, response, next) => {
  const { roomName } = request.body;

  if (!roomName) next(new ErrorResponse("Room name is required", 400));

  const appointment = await Appointments.findOne({ roomLink: roomName });

  if (!appointment) return next(new ErrorResponse("Invalid room name", 404));

  try {
    const identity = "user-" + Math.random().toString(36).substring(2, 15);

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_VIDEO_SID,
      process.env.TWILIO_VIDEO_SECRET_KEY,
      {
        identity: identity,
        ttl: MAX_ALLOWED_SESSION_DURATION,
      }
    );

    const videoGrant = new VideoGrant({
      room: roomName,
    });

    token.addGrant(videoGrant);

    response.status(200).json({ success: true, token: token.toJwt() });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Failed to generate access token", 500));
  }
};
