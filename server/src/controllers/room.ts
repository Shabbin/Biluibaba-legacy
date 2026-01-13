import { Request, Response, NextFunction } from 'express';
import { jwt as TwilioJwt } from 'twilio';
import ErrorResponse from '../utils/ErrorResponse';
import Appointment from '../models/appointment.model';

const { AccessToken } = TwilioJwt;
const VideoGrant = AccessToken.VideoGrant;
const MAX_ALLOWED_SESSION_DURATION = 14400; // 4 hours

/**
 * Get Twilio video access token for a room
 * @route POST /api/room/token
 */
export const getAccessToken = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { roomName } = request.body;

    if (!roomName) {
      return next(new ErrorResponse('Room name is required', 400));
    }

    // Verify room exists
    const appointment = await Appointment.findOne({ roomLink: roomName });

    if (!appointment) {
      return next(new ErrorResponse('Invalid room name', 404));
    }

    // Generate unique identity
    const identity = `user-${Math.random().toString(36).substring(2, 15)}`;

    // Create access token
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_VIDEO_SID!,
      process.env.TWILIO_VIDEO_SECRET_KEY!,
      {
        identity,
        ttl: MAX_ALLOWED_SESSION_DURATION,
      }
    );

    // Grant video access
    const videoGrant = new VideoGrant({
      room: roomName,
    });

    token.addGrant(videoGrant);

    response.status(200).json({ success: true, token: token.toJwt() });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse('Failed to generate access token', 500));
  }
};
