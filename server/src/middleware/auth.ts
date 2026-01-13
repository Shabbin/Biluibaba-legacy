import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import ErrorResponse from '../utils/ErrorResponse.js';
import User from '../models/user.model.js';
import Vendor from '../models/vendor.model.js';
import Vet from '../models/vet.model.js';
import type { AuthenticatedRequest, JwtPayload } from '../types/index.js';

/**
 * Protect routes for authenticated users
 */
export const protectUser = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET ?? ''
    ) as JwtPayload;

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new ErrorResponse('This route is only authorized for user accounts', 401)
      );
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

/**
 * Protect routes for authenticated vendors
 */
export const protectVendor = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies?.['app-token'] ||
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET ?? ''
    ) as JwtPayload;

    const vendor = await Vendor.findById(decoded.id);

    if (!vendor) {
      return next(
        new ErrorResponse('This route is only authorized for vendor accounts', 401)
      );
    }

    req.vendor = vendor;
    return next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

/**
 * Protect routes for authenticated vets
 */
export const protectVet = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies?.['app-token'] ||
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET ?? ''
    ) as JwtPayload;

    const vet = await Vet.findById(decoded.id);

    if (!vet) {
      return next(
        new ErrorResponse('This route is only authorized for vet accounts', 401)
      );
    }

    req.vet = vet;
    return next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

/**
 * Protect routes for admin users
 */
export const protectAdmin = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.['admin-token'];

    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET ?? ''
    ) as JwtPayload;

    // Add admin verification logic here
    if (decoded.id !== process.env.ADMIN_ID) {
      return next(
        new ErrorResponse('This route is only authorized for admin accounts', 401)
      );
    }

    return next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};
