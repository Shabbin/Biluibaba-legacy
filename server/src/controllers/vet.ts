import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import handlebars from 'handlebars';
import ErrorResponse from '../utils/ErrorResponse';
import { uploadMiddleware } from '../utils/Upload';
import User from '../models/user.model';
import Vet, { IVet } from '../models/vet.model';
import Appointment from '../models/appointment.model';
import { generateRandomId, generateRoomId } from '../utils/GenerateId';
import { parseTime, calculateTimeSlot } from '../utils/Time';
import { sendEmail } from '../utils/SendMail';
import { AuthenticatedRequest } from '../types';

// Load email templates
const loadTemplate = (templatePath: string): string => {
  try {
    return fs.readFileSync(path.join(__dirname, templatePath), 'utf-8');
  } catch {
    return '';
  }
};

const physicalAppointmentConfirm = loadTemplate('../../templates/appointments/physical-confirm.hbs');
const physicalAppointmentCancel = loadTemplate('../../templates/appointments/physical-cancel.hbs');
const physicalAppointmentVet = loadTemplate('../../templates/appointments/physical-vet.hbs');
const physicalAppointmentAdminCancel = loadTemplate('../../templates/admin/physical-cancel.hbs');
const physicalAppointmentAdmin = loadTemplate('../../templates/admin/physical-appointment.hbs');
const onlineAppointmentConfirm = loadTemplate('../../templates/appointments/online-confirm.hbs');
const onlineAppointmentCancel = loadTemplate('../../templates/appointments/online-cancel.hbs');
const onlineAppointmentVet = loadTemplate('../../templates/appointments/online-vet.hbs');
const onlineAppointmentAdminCancel = loadTemplate('../../templates/admin/online-cancel.hbs');
const onlineAppointmentAdmin = loadTemplate('../../templates/admin/online-appointment.hbs');
const invoiceTemplate = loadTemplate('../../templates/appointments/invoice.hbs');

interface VetRequest extends AuthenticatedRequest {
  vet?: {
    id: string;
    _id: string;
    name: string;
    email: string;
  };
  files?: {
    nidFront?: Express.Multer.File[];
    nidBack?: Express.Multer.File[];
    certificate?: Express.Multer.File[];
  };
  file?: Express.Multer.File;
}

interface DaySlot {
  startTime: string;
  endTime: string;
  duration: string | number;
  interval: string | number;
}

interface WeekSlots {
  monday: DaySlot;
  tuesday: DaySlot;
  wednesday: DaySlot;
  thursday: DaySlot;
  friday: DaySlot;
  saturday: DaySlot;
  sunday: DaySlot;
}

/**
 * Get vets by appointment type
 * @route GET /api/vet/get
 */
export const getVets = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = request.query;

    if (!type) {
      return next(new ErrorResponse('Missing information', 421));
    }

    const vets = await Vet.find({
      status: 'approved',
    });

    response.status(200).json({ success: true, vets });
  } catch (error) {
    next(error);
  }
};

/**
 * Get expert vets for homepage
 * @route GET /api/vet
 */
export const getExpertVets = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const vets = await Vet.find({ status: 'approved' }).limit(6);
    response.status(200).json({ success: true, vets });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single vet by ID
 * @route GET /api/vet/get/:id
 */
export const getVet = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = request.params;

    const vet = await Vet.findById(id);

    if (vet) {
      response.status(200).json({ success: true, vet });
    } else {
      next(new ErrorResponse('Vet not found', 404));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get all approved vet IDs
 * @route GET /api/vet/get-all-id
 */
export const getAllVetId = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const vets = await Vet.find({ status: 'approved' }).select('_id');
    response.status(200).json({ success: true, vets });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit vet review
 * @route POST /api/vet/rating
 */
export const submitReview = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { vetId, rating, comment } = request.body;

    if (!vetId || !rating) {
      return next(new ErrorResponse('Missing information', 421));
    }

    if (rating < 1 || rating > 5) {
      return next(new ErrorResponse('Invalid rating value', 422));
    }

    const vet = await Vet.findById(vetId) as any;

    if (!vet) {
      return next(new ErrorResponse('Vet not found', 404));
    }

    const review = {
      userId: request.user!.id,
      comment,
      rating,
      date: new Date(),
    };

    if (!vet.reviews) vet.reviews = [];
    vet.reviews.push(review);
    vet.totalRatings = (vet.totalRatings || 0) + rating;
    vet.totalReviews = (vet.totalReviews || 0) + 1;

    await vet.save();

    response.status(200).json({ success: true, data: 'Review submitted successfully' });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse('Server Error', 500));
  }
};

interface BookAppointmentBody {
  petName: string;
  petConcern: string[];
  vetId: string;
  date: string;
  time: string;
  totalAmount: number;
  type: 'online' | 'physical' | 'homeService';
  phoneNumber: string;
  species: string;
  detailedConcern: string;
  homeAddress?: string;
}

/**
 * Book an appointment
 * @route POST /api/vet/appointment/create
 */
export const bookAppointment = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      petName,
      petConcern,
      vetId,
      date,
      time,
      totalAmount,
      type,
      phoneNumber,
      species,
      detailedConcern,
      homeAddress,
    } = request.body as BookAppointmentBody;

    if (
      !petName ||
      !petConcern ||
      !vetId ||
      !date ||
      !time ||
      !totalAmount ||
      !type ||
      !species ||
      !detailedConcern ||
      !phoneNumber
    ) {
      return next(new ErrorResponse('Missing information', 421));
    }

    const appointment = await Appointment.create({
      status: 'pending',
      appointmentId: generateRandomId(20),
      petName,
      petConcern,
      species,
      vet: vetId,
      user: request.user!._id,
      date,
      time,
      totalAmount,
      phoneNumber,
      roomLink: type === 'online' ? generateRoomId() : '',
      type,
      detailedConcern,
      homeAddress: type === 'home-visit' ? homeAddress : '',
    });

    // For production, integrate with payment gateway
    // const paymentResponse = await createPaymentRequest(...);
    // appointment.paymentSessionKey = paymentResponse.sessionkey;
    // await appointment.save();

    response.status(200).json({
      success: true,
      appointmentId: appointment.appointmentId,
      // url: paymentResponse.GatewayPageURL, // Uncomment for production
    });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse('Server Error', 500));
  }
};

/**
 * Validate appointment payment
 * @route POST /api/vet/appointment/validate
 */
export const validateAppointment = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, val_id, value_a } = request.body;

    if (status === 'VALID') {
      // For production, validate with payment gateway
      // const paymentResponse = await validatePayment(val_id);

      const appointment = await Appointment.findOne({ appointmentId: value_a })
        .populate('vet')
        .populate('user');

      if (!appointment) {
        return next(new ErrorResponse('No appointment found', 404));
      }

      appointment.status = 'confirmed';
      appointment.paymentStatus = true;
      appointment.paymentSessionKey = val_id;
      await appointment.save();

      response.status(200).redirect(
        `${process.env.FRONTEND_URL}/vets/status?status=success&id=${appointment.appointmentId}`
      );
    } else {
      await Appointment.findOneAndDelete({ appointmentId: value_a });

      response.status(200).redirect(`${process.env.FRONTEND_URL}/vets/status?status=failed`);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get upcoming appointments for vet
 * @route GET /api/vet/upcoming-appointments
 */
export const getUpcomingAppointments = async (
  request: VetRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { count } = request.query;
    const pageCount = parseInt(count as string) || 0;

    const now = new Date();
    const currentDateStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const currentTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    const appointments = await Appointment.find({
      status: 'confirmed',
      vet: request.vet!._id,
    })
      .populate('vet', 'name email phone')
      .populate('user', 'name email phone');

    const upcomingAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(
        appointment.date.replace(/(\d+)(st|nd|rd|th)/, '$1')
      );
      const currentDate = new Date(currentDateStr);

      appointmentDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (appointmentDate.getTime() !== currentDate.getTime()) {
        return appointmentDate > currentDate;
      }

      return appointment.time > currentTime;
    });

    const start = pageCount * 10;
    const end = start + 10;
    const paginatedAppointments = upcomingAppointments.slice(start, end);

    response.status(200).json({
      success: true,
      appointments: paginatedAppointments,
      totalAppointments: upcomingAppointments.length,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse((error as Error).message, 500));
  }
};

/**
 * Update appointment status
 * @route POST /api/vet/appointment/update
 */
export const updateAppointment = async (
  request: VetRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, status, prescription } = request.body;

    const appointment = await Appointment.findById(id)
      .populate('vet')
      .populate('user') as any;

    if (!appointment) {
      return next(new ErrorResponse('No appointment found', 404));
    }

    if (status === 'completed') {
      appointment.status = 'completed';
      appointment.prescription = prescription;
      await appointment.save();

      response.status(200).json({ success: true, data: 'Appointment Updated' });
    } else if (status === 'cancelled') {
      appointment.status = 'cancelled';
      await appointment.save();

      // Send cancellation emails
      // ... (email sending logic)

      response.status(200).json({ success: true, data: 'Appointment Cancelled' });
    } else {
      response.status(404).json({ success: false, message: 'Invalid Status' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get appointments by type
 * @route GET /api/vet/appointments
 */
export const getAppointments = async (
  request: VetRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, count } = request.query;
    const pageCount = parseInt(count as string) || 0;

    if (!type) {
      return next(new ErrorResponse('Missing information', 421));
    }

    const statusFilter = type === 'all'
      ? { $in: ['pending', 'confirmed', 'completed', 'cancelled'] }
      : type;

    const appointments = await Appointment.find({
      vet: request.vet!._id,
      status: statusFilter,
    })
      .skip(10 * pageCount)
      .limit(10)
      .populate('user', 'name email phone')
      .sort('-createdAt');

    const totalAppointments = await Appointment.countDocuments({
      vet: request.vet!._id,
      status: type === 'all' ? { $in: ['pending', 'confirmed', 'completed', 'cancelled'] } : type,
    });

    response.status(200).json({ success: true, appointments, totalAppointments });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single appointment
 * @route GET /api/vet/appointment
 */
export const getAppointment = async (
  request: VetRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = request.query;

    if (!id) {
      return next(new ErrorResponse('Missing information', 421));
    }

    const appointment = await Appointment.findOne({
      appointmentId: id,
      vet: request.vet!._id,
    })
      .populate('user', 'name email avatar')
      .populate('vet', 'name email phone address');

    if (!appointment) {
      return next(new ErrorResponse('No appointment found', 404));
    }

    response.status(200).json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

interface CreateVetBody {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  nidNumber: string;
  degree: string;
  license: string;
  hospital?: string;
  tin: string;
  specializedZone: string;
  state: string;
  district: string;
  postcode: string;
  fullAddress: string;
  bankAccountType: string;
  bankAccountName: string;
  bankAccountNumber: string;
}

/**
 * Create new vet account
 * @route POST /api/vet/create
 */
export const createVet = async (
  request: VetRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      gender,
      nidNumber,
      degree,
      license,
      hospital,
      tin,
      state,
      district,
      postcode,
      fullAddress,
      bankAccountType,
      bankAccountName,
      bankAccountNumber,
    } = request.body as CreateVetBody;

    const { nidFront, nidBack, certificate } = request.files || {};

    if (
      !name ||
      !email ||
      !phoneNumber ||
      !password ||
      !gender ||
      !nidNumber ||
      !degree ||
      !license ||
      !tin ||
      !bankAccountType ||
      !bankAccountName ||
      !bankAccountNumber ||
      !state ||
      !district ||
      !postcode ||
      !fullAddress
    ) {
      return next(new ErrorResponse('Missing information', 421));
    }

    const vet = await Vet.create({
      status: 'pending',
      verified: false,
      name,
      email,
      phoneNumber,
      password,
      gender,
      address: {
        area: state,
        district,
        postcode,
        fullAddress,
      },
      degree,
      license,
      hospital,
      certificate: certificate?.[0]?.filename || '',
      nid: {
        front: nidFront?.[0]?.filename || '',
        back: nidBack?.[0]?.filename || '',
        number: nidNumber,
      },
      tax: {
        tin,
      },
    });

    response.status(200).json({ success: true, data: 'Vet Created' });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse('Server Error', 500));
  }
};

/**
 * Get vet details (for logged in vet)
 * @route GET /api/vet/me
 */
export const getVetDetails = async (
  request: VetRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const vet = await Vet.findById(request.vet!.id).select('-password');

    if (vet) {
      response.status(200).json({ success: true, vet });
    } else {
      next(new ErrorResponse('Vet not found', 404));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Update vet profile
 * @route POST /api/vet/update
 */
export const updateVet = async (
  request: VetRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, bio } = request.body;
    const filename = request.file?.filename;

    const url = `${request.protocol}://${request.get('host')}`;

    const vet = await Vet.findById(request.vet!.id);

    if (!vet) {
      return next(new ErrorResponse('Vet not found', 404));
    }

    vet.name = name;
    vet.bio = bio;
    if (filename) {
      vet.profilePicture = `${url}/uploads/profile/${filename}`;
    }

    await vet.save();

    response.status(200).json({ success: true, data: 'Vet Updated' });
  } catch (error) {
    next(error);
  }
};

/**
 * Update appointment slots
 * @route POST /api/vet/update/slot
 */
export const updateSlot = async (
  request: VetRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slots } = request.body as { slots: WeekSlots };

    const vet = await Vet.findById(request.vet!.id) as any;

    if (!vet) {
      return next(new ErrorResponse('Vet not found', 404));
    }

    // Initialize appointments.slots if it doesn't exist
    if (!vet.appointments) vet.appointments = { slots: {} };
    if (!vet.appointments.slots) vet.appointments.slots = {};

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

    for (const day of days) {
      const daySlot = slots[day];
      if (!vet.appointments.slots[day]) {
        vet.appointments.slots[day] = {};
      }

      vet.appointments.slots[day].startTime = daySlot.startTime;
      vet.appointments.slots[day].endTime = daySlot.endTime;
      vet.appointments.slots[day].duration = Number(daySlot.duration);
      vet.appointments.slots[day].interval = Number(daySlot.interval);
      vet.appointments.slots[day].availableSlots = calculateTimeSlot(
        parseTime(daySlot.startTime),
        parseTime(daySlot.endTime),
        Number(daySlot.duration),
        Number(daySlot.interval)
      );
    }

    await vet.save();

    response.status(200).json({ success: true, data: 'Slot Updated' });
  } catch (error) {
    next(error);
  }
};

interface AvailabilityBody {
  physical: boolean;
  online: boolean;
  emergency: boolean;
  homeService: boolean;
  instantChat: boolean;
  physicalFee: number;
  onlineFee: number;
  emergencyFee: number;
  homeServiceFee: number;
}

/**
 * Update vet availability
 * @route POST /api/vet/update/availability
 */
export const updateAvailability = async (
  request: VetRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      physical,
      online,
      emergency,
      homeService,
      instantChat,
      physicalFee,
      onlineFee,
      emergencyFee,
      homeServiceFee,
    } = request.body as AvailabilityBody;

    const vet = await Vet.findById(request.vet!.id) as any;

    if (!vet) {
      return next(new ErrorResponse('Vet not found', 404));
    }

    // Initialize appointments if needed
    if (!vet.appointments) vet.appointments = {};

    // Update availability settings
    vet.appointments.fee = onlineFee; // Default fee

    await vet.save();

    response.status(200).json({ success: true, data: 'Availability Updated' });
  } catch (error) {
    next(error);
  }
};

// Multer storage configurations
const vetStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/vet'));
  },
  filename: (req, file, cb) => {
    if (file.fieldname === 'nidFront') {
      cb(null, `nidFront-${Date.now()}${path.extname(file.originalname)}`);
    } else if (file.fieldname === 'nidBack') {
      cb(null, `nidBack-${Date.now()}${path.extname(file.originalname)}`);
    } else if (file.fieldname === 'certificate') {
      cb(null, `certificate-${Date.now()}${path.extname(file.originalname)}`);
    } else {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
  },
});

const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/profile'));
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const uploadProfilePicture = uploadMiddleware(profilePictureStorage).single('profile');

export const uploadVet = uploadMiddleware(vetStorage).fields([
  { name: 'nidFront', maxCount: 1 },
  { name: 'nidBack', maxCount: 1 },
  { name: 'certificate', maxCount: 1 },
]);
