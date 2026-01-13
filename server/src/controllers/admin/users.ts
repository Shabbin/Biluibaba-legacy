import { Request, Response, NextFunction } from 'express';
import { User } from '../../models';

/**
 * Admin Users Controller
 * Handles user management for admins
 */

/**
 * Get Users List
 * @route GET /api/admin/users
 * @access Private (Admin)
 */
export const getUsers = async (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const { count } = request.query;
  const countNum = parseInt(count as string) || 0;

  const users = await User.find()
    .skip(countNum * 10)
    .limit(10)
    .sort('-createdAt')
    .select('name email avatar createdAt');

  response.status(200).json({ success: true, users });
};
