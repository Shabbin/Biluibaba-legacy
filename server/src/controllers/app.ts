import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/ErrorResponse';
import Vendor, { IVendor } from '../models/vendor.model';
import Vet, { IVet } from '../models/vet.model';

type AppUser = IVendor | IVet;

/**
 * Send JWT token in cookie
 */
const sendAppToken = async (
  app: AppUser,
  statusCode: number,
  response: Response
): Promise<void> => {
  const token = app.getSignedToken();
  
  response
    .status(statusCode)
    .cookie('app-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24,
      domain: process.env.NODE_ENV === 'production' ? '.biluibaba.com' : undefined,
      sameSite: 'lax',
    })
    .json({ success: true });
};

/**
 * Check if email is already registered
 * @route POST /api/app/check-email
 */
export const checkEmail = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = request.body;

    if (!email) {
      return next(new ErrorResponse('Please provide a valid email address to check', 404));
    }

    const vendor = await Vendor.findOne({ email });
    const vet = await Vet.findOne({ email });

    if (vendor || vet) {
      return next(
        new ErrorResponse(
          'This email account is already registered with us. Please provide a different one or try logging in.',
          401
        )
      );
    }

    response.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * Login for vendors and vets
 * @route POST /api/app/login
 */
export const login = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return next(new ErrorResponse('Missing Information', 421));
    }

    // Try to find vendor first
    let appUser: AppUser | null = await Vendor.findOne({ email }).select('+password');

    // If not found, try to find vet
    if (!appUser) {
      appUser = await Vet.findOne({ email }).select('+password');
    }

    if (!appUser) {
      return next(new ErrorResponse('Invalid email or password', 401));
    }

    const isPasswordMatch = await appUser.matchPassword(password);

    if (!isPasswordMatch) {
      return next(new ErrorResponse('Invalid email or password', 401));
    }

    await sendAppToken(appUser, 200, response);
  } catch (error) {
    next(new ErrorResponse('Server Error Occurred. Please try again later', 500));
  }
};

/**
 * Logout for vendors and vets
 * @route POST /api/app/logout
 */
export const logout = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response> => {
  return response
    .status(200)
    .clearCookie('app-token', {
      httpOnly: true,
      domain: process.env.NODE_ENV === 'production' ? '.biluibaba.com' : undefined,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .json({ success: true, data: 'Logged out successfully' });
};
