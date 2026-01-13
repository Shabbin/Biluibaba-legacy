import { Request, Response, NextFunction } from 'express';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

import { sendEmail } from '../../utils/SendMail';
import { Adoption, AdoptionOrder } from '../../models';

/**
 * Admin Adoptions Controller
 * Handles adoption management for admins
 */

// Email templates
const approvalAdoptionTemplate = fs.readFileSync(
  path.join(__dirname, '../../templates/adoption/approval.hbs'),
  'utf-8'
);
const rejectedAdoptionTemplate = fs.readFileSync(
  path.join(__dirname, '../../templates/adoption/rejection.hbs'),
  'utf-8'
);

/**
 * Get Approved Adoptions List
 * @route GET /api/admin/adoptions
 * @access Private (Admin)
 */
export const getApprovedAdoptions = async (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const { count, status } = request.query;
  const countNum = parseInt(count as string) || 0;

  const adoptions = await Adoption.find({ status })
    .skip(countNum * 10)
    .limit(10)
    .sort('-createdAt')
    .select('name species userId createdAt images adoptionId')
    .populate('userId', 'name email avatar');

  const totalAdoptions = await Adoption.countDocuments({ status });

  response.status(200).json({ success: true, adoptions, totalAdoptions });
};

/**
 * Set Adoption Status
 * @route PUT /api/admin/adoptions/:id/status
 * @access Private (Admin)
 */
export const setAdoptionStatus = async (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const { id } = request.params;
  const { status } = request.body;

  const adoption = await Adoption.findById(id).populate('userId', 'name email');

  if (!adoption) {
    response.status(404).json({ success: false, message: 'Adoption not found' });
    return;
  }

  await Adoption.findByIdAndUpdate(
    id,
    { status: status ? 'approved' : 'rejected' },
    { new: true }
  );

  const userInfo = adoption.userId as any;

  const message = handlebars.compile(
    status ? approvalAdoptionTemplate : rejectedAdoptionTemplate
  )({
    cus_name: userInfo.name,
    pet_name: adoption.name,
  });

  await sendEmail({
    to: userInfo.email,
    subject: status
      ? 'Your Adoption Post Is Live'
      : 'Your Adoption Post Needs Revision',
    message,
  });

  response.status(200).json({ success: true, adoption });
};

/**
 * Get Adoption Orders List
 * @route GET /api/admin/adoptions/orders
 * @access Private (Admin)
 */
export const getAdoptionOrders = async (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const { count } = request.query;
  const countNum = parseInt(count as string) || 0;

  const adoptionOrders = await AdoptionOrder.find()
    .skip(countNum * 10)
    .limit(10)
    .sort('-createdAt')
    .populate('adoptionId', 'name species userId images adoptionId')
    .populate('userId', 'name email avatar');

  const totalAdoptionOrders = await AdoptionOrder.countDocuments();

  response.status(200).json({
    success: true,
    orders: adoptionOrders,
    totalOrders: totalAdoptionOrders,
  });
};

/**
 * Get Adoption Order By ID
 * @route GET /api/admin/adoptions/orders/:id
 * @access Private (Admin)
 */
export const getAdoptionOrderById = async (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const { id } = request.params;

  const adoptionOrder = await AdoptionOrder.findOne({ orderId: id })
    .populate('adoptionId', 'name species userId images adoptionId')
    .populate('userId', 'name email avatar');

  if (!adoptionOrder) {
    response.status(404).json({ success: false, message: 'Adoption order not found' });
    return;
  }

  response.status(200).json({ success: true, order: adoptionOrder });
};
