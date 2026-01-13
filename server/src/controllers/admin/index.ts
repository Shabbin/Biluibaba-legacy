import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Admin Controller
 * Handles admin authentication
 */

// Helper function to send admin token
const sendAdminToken = async (statusCode: number, response: Response): Promise<void> => {
  const token = jwt.sign(
    { id: process.env.ADMIN_ID },
    process.env.ADMIN_TOKEN_SECRET as string,
    { expiresIn: process.env.TOKEN_EXPIRE }
  );

  response
    .status(statusCode)
    .cookie('super-token', token, {
      httpOnly: true,
      domain: process.env.NODE_ENV === 'production' ? '.biluibaba.com' : '',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: 'strict',
    })
    .json({ success: true });
};

/**
 * Admin Login
 * @route POST /api/admin/login
 * @access Public
 */
export const login = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = request.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new Error('Missing information'));
  }

  // Check if email and password are correct from .env
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return sendAdminToken(200, response);
  } else {
    return next(new Error('Incorrect email or password'));
  }
};
