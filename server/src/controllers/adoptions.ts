import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import handlebars from 'handlebars';
import ErrorResponse from '../utils/ErrorResponse';
import { uploadMiddleware } from '../utils/Upload';
import { generateRandomId } from '../utils/GenerateId';
import { sendEmail } from '../utils/SendMail';
import User from '../models/user.model';
import Adoption from '../models/adoption.model';
import AdoptionOrder from '../models/adoption-order.model';
import { AuthenticatedRequest } from '../types';

// Load email templates
const loadTemplate = (templatePath: string): string => {
  try {
    return fs.readFileSync(path.join(__dirname, templatePath), 'utf-8');
  } catch {
    return '';
  }
};

const approvalAdoptionTemplate = loadTemplate('../../templates/adoption/application-approve.hbs');
const rejectedAdoptionTemplate = loadTemplate('../../templates/adoption/application-reject.hbs');
const applicantAdoptionTemplate = loadTemplate('../../templates/adoption/adoption-applicant.hbs');
const adoptionApplication = loadTemplate('../../templates/adoption/application.hbs');
const newAdoptionTemplate = loadTemplate('../../templates/admin/new-adoption.hbs');
const adminApplicantApprove = loadTemplate('../../templates/admin/adoption-application-approved.hbs');
const adminApplicantReject = loadTemplate('../../templates/admin/adoption-application-rejected.hbs');
const invoiceTemplate = loadTemplate('../../templates/adoption/invoice.hbs');
const adminAdoptionTemplate = loadTemplate('../../templates/admin/adoption-invoice.hbs');

interface AdoptionRequest extends AuthenticatedRequest {
  files?: {
    images?: Express.Multer.File[];
  };
}

interface CreateAdoptionBody {
  name: string;
  species: string;
  gender: 'male' | 'female';
  age: string;
  breed: string;
  size: string;
  vaccinated: string;
  neutered: string;
  color: string;
  location: string;
  phoneNumber: string;
  description: string;
}

/**
 * Create a new adoption listing
 * @route POST /api/adoptions/create
 */
export const createAdoption = async (
  request: AdoptionRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      species,
      gender,
      age,
      breed,
      size,
      vaccinated,
      neutered,
      color,
      location,
      phoneNumber,
      description,
    } = request.body as CreateAdoptionBody;

    const images = request.files?.images;
    const url = `${request.protocol}://${request.get('host')}`;

    if (!name || !location || !description) {
      return next(new ErrorResponse('Missing information', 421));
    }

    if (!images || images.length === 0) {
      return next(new ErrorResponse('Missing images', 421));
    }

    const formattedImages = images.map((image) => ({
      filename: image.filename,
      path: `${url}/uploads/adoptions/${image.filename}`,
    }));

    const adoption = await Adoption.create({
      adoptionId: generateRandomId(20),
      status: 'pending',
      name,
      species,
      gender,
      age,
      breed,
      size,
      vaccinated,
      neutered,
      location,
      description,
      phoneNumber,
      images: formattedImages,
      userId: request.user!._id,
    });

    // Parse and add colors
    const colors = JSON.parse(color || '[]');
    colors.forEach((c: string) => adoption.color.push(c));
    await adoption.save();

    await User.findByIdAndUpdate(request.user!._id, {
      $push: { adoptionIDs: adoption._id },
    });

    const message = handlebars.compile(newAdoptionTemplate)({
      name: adoption.name,
      cus_name: request.user!.name,
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: 'Admin Notice',
      message,
    });

    response.status(200).json({ success: true, data: 'Successfully created adoption' });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an adoption listing
 * @route POST /api/adoptions/delete/:id
 */
export const deleteAdoption = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = request.params;

    const adoption = await Adoption.findOne({ adoptionId: id });
    if (!adoption) {
      return next(new ErrorResponse('No adoption found', 404));
    }

    if (adoption.userId.toString() !== request.user!._id.toString()) {
      return next(new ErrorResponse('Not authorized to delete this adoption', 403));
    }

    await Adoption.findByIdAndDelete(adoption._id);
    await User.findByIdAndUpdate(request.user!._id, {
      $pull: { adoptionIDs: adoption._id },
    });

    response.status(200).json({ success: true, data: 'Successfully deleted adoption' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's adoption listings
 * @route GET /api/adoptions/list
 */
export const getAdoptionsList = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adoptions = await Adoption.find({ userId: request.user!._id });
    response.status(200).json({ success: true, adoptions });
  } catch (error) {
    next(error);
  }
};

interface AdoptionQuery {
  count?: string;
  age?: string;
  species?: string;
  breed?: string;
  gender?: string;
  size?: string;
  vaccinated?: string;
  location?: string;
  neutered?: string;
  color?: string;
}

/**
 * Get all approved adoptions with filters
 * @route GET /api/adoptions
 */
export const getAdoptions = async (
  request: Request<{}, {}, {}, AdoptionQuery>,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { count, ...queryParams } = request.query;
    const pageCount = parseInt(count || '0');

    const filter: Record<string, any> = {};

    // Build filter from query params
    const filterFields = ['age', 'species', 'breed', 'gender', 'size', 'vaccinated', 'location', 'neutered'];
    
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== '' && value !== null && value !== undefined) {
        if (filterFields.includes(key)) {
          filter[key] = value;
        } else if (key === 'color') {
          filter[key] = { $in: (value as string).split(',') };
        }
      }
    }

    filter.status = 'approved';

    const adoptions = await Adoption.find(filter)
      .skip(pageCount * 40)
      .limit(40)
      .sort('-createdAt');

    const adoptionCount = await Adoption.countDocuments({ status: 'approved' });

    response.status(200).json({
      success: true,
      adoptions,
      adoptionCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get adoptions by IDs (wishlist)
 * @route GET /api/adoptions/wishlist
 */
export const getAdoptionsWishlist = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ids = request.query.ids as string;
    const adoptionIds = ids ? ids.split(',') : [];

    const adoptions = await Adoption.find({ adoptionId: { $in: adoptionIds } });

    response.status(200).json({ success: true, adoptions });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single adoption by ID
 * @route GET /api/adoptions/get/:id
 */
export const getAdoption = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = request.params;

    const adoption = await Adoption.findOne({ adoptionId: id })
      .populate('userId', 'name avatar email');

    if (!adoption) {
      return next(new ErrorResponse('No adoption found', 404));
    }

    const moreAdoption = await Adoption.find({ status: 'approved' }).limit(4);

    response.status(200).json({ success: true, adoption, moreAdoption });
  } catch (error) {
    next(error);
  }
};

/**
 * Get adoption order details
 * @route GET /api/adoptions/application
 */
export const getOrderDetails = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = request.query;

    if (!id) {
      return next(new ErrorResponse('Missing order ID', 421));
    }

    const order = await AdoptionOrder.findById(id);

    if (!order) {
      return next(new ErrorResponse('No order found', 404));
    }

    response.status(200).json({
      success: true,
      order: {
        orderId: order.orderId,
        status: order.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update adoption order status
 * @route POST /api/adoptions/application
 */
export const updateOrderDetails = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, id } = request.body;

    const order = await AdoptionOrder.findById(id)
      .populate('adoptionId', 'name')
      .populate('userId', 'name email') as any;

    if (!order) {
      return next(new ErrorResponse('No order found', 404));
    }

    const updateOrder = await AdoptionOrder.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updateOrder) {
      return next(new ErrorResponse('Failed to update order', 500));
    }

    const adoption = await Adoption.findById(order.adoptionId)
      .populate('userId', 'name email') as any;

    if (status === 'approved') {
      const message = handlebars.compile(approvalAdoptionTemplate)({
        cus_name: order.userId.name,
        pet_name: order.adoptionId.name,
      });

      await Adoption.findByIdAndUpdate(order.adoptionId, { status: 'adopted' });

      await sendEmail({
        to: order.userId.email,
        subject: 'Your Adoption Application Was Approved!',
        message,
      });
    } else if (status === 'rejected') {
      const message = handlebars.compile(rejectedAdoptionTemplate)({
        cus_name: order.userId.name,
        pet_name: order.adoptionId.name,
        orderId: order.orderId,
        amount: `${order.payment} BDT`,
      });

      await sendEmail({
        to: order.userId.email,
        subject: 'Your Adoption Fee Refund Is On Its Way! Application Rejected.',
        message,
      });
    }

    const adminMessage = handlebars.compile(
      status === 'approved' ? adminApplicantApprove : adminApplicantReject
    )({
      applicant_name: order.userId.name,
      pet_name: order.adoptionId.name,
      poster_name: adoption?.userId?.name || 'Unknown',
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: 'Admin Notice',
      message: adminMessage,
    });

    response.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

interface OrderAdoptionBody {
  adoptionId: string;
  name: string;
  payment: number;
  phoneNumber: string;
  area: string;
  address: string;
  whyAdopt: string;
  petProof: string;
  takeCareOfPet: string;
}

/**
 * Create an adoption order
 * @route POST /api/adoptions/order
 */
export const orderAdoption = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      adoptionId,
      name,
      payment,
      phoneNumber,
      area,
      address,
      whyAdopt,
      petProof,
      takeCareOfPet,
    } = request.body as OrderAdoptionBody;

    if (
      !adoptionId ||
      !name ||
      !phoneNumber ||
      !area ||
      !address ||
      !payment ||
      !whyAdopt ||
      !petProof ||
      !takeCareOfPet
    ) {
      return next(new ErrorResponse('Missing information', 421));
    }

    const orderId = generateRandomId(20);

    // For production, integrate with payment gateway
    // const paymentResponse = await createPaymentRequest(...);

    const order = await AdoptionOrder.create({
      orderId,
      status: 'pending',
      adoptionId,
      userId: request.user!._id,
      name,
      phoneNumber,
      area,
      payment,
      address,
      whyAdopt,
      petProof,
      takeCareOfPet,
      // paymentSessionKey: paymentResponse.sessionkey, // Uncomment for production
    });

    response.status(200).json({
      success: true,
      // url: paymentResponse.GatewayPageURL, // Uncomment for production
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Validate adoption order payment
 * @route POST /api/adoptions/validate
 */
export const validateAdoptionOrder = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, val_id, value_a } = request.body;

    if (status === 'VALID') {
      // For production, validate with payment gateway
      // const paymentResponse = await validatePayment(val_id);

      const adoptionOrder = await AdoptionOrder.findOne({ orderId: value_a })
        .populate('userId', 'email name') as any;

      if (!adoptionOrder) {
        return next(new ErrorResponse('No order found', 404));
      }

      const adoption = await Adoption.findById(adoptionOrder.adoptionId)
        .populate('userId', 'email name') as any;

      await User.findByIdAndUpdate(adoptionOrder.userId._id, {
        $push: { invoiceIDs: adoptionOrder._id },
      });

      // Send emails...

      response.status(200).redirect(
        `${process.env.FRONTEND_URL}/adoptions/status?status=success&id=${adoptionOrder.orderId}`
      );
    } else {
      await AdoptionOrder.findOneAndDelete({ orderId: value_a });
      response.status(200).redirect(`${process.env.FRONTEND_URL}/adoptions/status?status=failed`);
    }
  } catch (error) {
    next(error);
  }
};

// Multer storage configuration for adoption images
const adoptionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/adoptions'));
  },
  filename: (req, file, cb) => {
    const id = generateRandomId(20);
    if (file.fieldname === 'images') {
      cb(null, `adoption-${Date.now()}${id}${path.extname(file.originalname)}`);
    } else {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
  },
});

export const uploadAdoptionImage = uploadMiddleware(adoptionStorage).fields([
  { name: 'images', maxCount: 5 },
]);
