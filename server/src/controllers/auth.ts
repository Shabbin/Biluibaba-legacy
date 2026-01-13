import { Request, Response, NextFunction } from 'express';
import { google, oauth2_v2 } from 'googleapis';
import axios from 'axios';
import User, { IUser } from '../models/user.model';
import Order from '../models/order.model';
import Appointment from '../models/appointment.model';
import ErrorResponse from '../utils/ErrorResponse';
import { AuthenticatedRequest } from '../types';

// Initialize Google OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Helper function to send JWT token in cookie
const sendToken = async (
  user: IUser,
  statusCode: number,
  response: Response
): Promise<Response> => {
  const token = user.getSignedToken();
  
  return response
    .status(statusCode)
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.NODE_ENV === 'production' ? '.biluibaba.com' : undefined,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
    })
    .json({ success: true });
};

// Helper function to redirect with token
const redirectAndSendToken = async (
  url: string,
  user: IUser,
  statusCode: number,
  response: Response
): Promise<void> => {
  const token = user.getSignedToken();
  
  response
    .status(statusCode)
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.NODE_ENV === 'production' ? '.biluibaba.com' : undefined,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'lax',
    })
    .redirect(`${process.env.FRONTEND_URL}${url}`);
};

// Helper function to register a new user
const registerUser = async (
  name: string,
  email: string,
  phoneNumber: string,
  password: string,
  authType: 'traditional' | 'google' | 'facebook',
  avatar: string
): Promise<IUser> => {
  const user = await User.create({
    name,
    email,
    verified: true,
    authType,
    phoneNumber,
    password,
    avatar,
    package: 'free',
    promotionalEmails: true,
  });

  return user;
};

// Helper function for Google OAuth
const handleGoogleOAuth = async (
  response: Response,
  state?: string
): Promise<Response> => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];
  
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state,
  });
  
  return response.status(200).json({ success: true, url });
};

// Helper function for Facebook OAuth
const handleFacebookOAuth = async (response: Response): Promise<Response> => {
  const facebookAuthURL = `https://www.facebook.com/v11.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&scope=email,public_profile`;
  
  return response.status(200).json({ success: true, url: facebookAuthURL });
};

/**
 * Get current user info
 * @route GET /api/auth/me
 */
export const getUserInfo = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(request.user?.id).select('-password');
    
    response.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @route POST /api/auth/update-profile
 */
export const updateUserInfo = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, phoneNumber, shippingAddress } = request.body;

    if (!name || !phoneNumber) {
      return next(new ErrorResponse('Missing information', 422));
    }

    const user = await User.findById(request.user?.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    user.name = name;
    user.phoneNumber = phoneNumber;

    if (shippingAddress) {
      user.shipping = shippingAddress;
    }

    await user.save();

    response.status(200).json({ success: true, data: 'Profile updated' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user orders
 * @route GET /api/auth/orders
 */
export const getOrders = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = request.query;

    if (!type) {
      return next(new ErrorResponse('Missing information', 422));
    }

    const user = await User.findById(request.user?.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    const filter = type === 'all' 
      ? { userId: user._id } 
      : { userId: user._id, status: type };

    const orders = await Order.find(filter);

    response.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user vet bookings
 * @route GET /api/auth/vet
 */
export const getBookings = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = request.query;

    if (!type) {
      return next(new ErrorResponse('Missing information', 422));
    }

    const user = await User.findById(request.user?.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    const bookings = await Appointment.find({
      user: user._id,
      type,
    }).populate('vet');

    response.status(200).json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

/**
 * User login
 * @route POST /api/auth/login
 */
export const login = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, email, password, from } = request.body;

    if (!type) {
      return next(new ErrorResponse('Missing information', 422));
    }

    if (type === 'google') {
      handleGoogleOAuth(response, from);
      return;
    }
    
    if (type === 'facebook') {
      handleFacebookOAuth(response);
      return;
    }

    // Traditional login
    if (!email || !password) {
      return next(new ErrorResponse('Missing information', 422));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Incorrect email or password', 401));
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return next(new ErrorResponse('Incorrect email or password', 401));
    }

    await sendToken(user, 200, response);
  } catch (error) {
    next(new ErrorResponse('Server Error Occurred. Please try again later...', 500));
  }
};

/**
 * User registration
 * @route POST /api/auth/register
 */
export const register = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, name, phoneNumber, email, password } = request.body;

    if (!type) {
      return next(new ErrorResponse('Please provide auth type', 422));
    }

    if (type === 'google') {
      handleGoogleOAuth(response);
      return;
    }
    
    if (type === 'facebook') {
      handleFacebookOAuth(response);
      return;
    }

    // Traditional registration
    if (!name || !phoneNumber || !email || !password) {
      return next(new ErrorResponse('Missing information', 422));
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ErrorResponse('Account already exists. Please try logging in...', 401));
    }

    const url = `${request.protocol}://${request.get('host')}`;
    const newUser = await registerUser(
      name,
      email,
      phoneNumber,
      password,
      'traditional',
      `${url}/uploads/profile/default.jpg`
    );

    await sendToken(newUser, 200, response);
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate with Google (callback)
 * @route GET /api/auth/google
 */
export const authenticateGoogle = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, state } = request.query;

    if (!code) {
      response.status(400).json({ 
        success: false, 
        data: "Missing 'code' parameter" 
      });
      return;
    }

    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    if (!data.email) {
      response.redirect(`${process.env.FRONTEND_URL}/login`);
      return;
    }

    const user = await User.findOne({ email: data.email });

    if (user) {
      redirectAndSendToken((state as string) || '/', user, 200, response);
    } else {
      const newUser = await registerUser(
        data.name || '',
        data.email,
        '',
        '',
        'google',
        data.picture || ''
      );

      redirectAndSendToken((state as string) || '/', newUser, 200, response);
    }
  } catch (error) {
    console.error(error);
    response.redirect(`${process.env.FRONTEND_URL}/login`);
  }
};

interface FacebookUserResponse {
  id: string;
  name: string;
  email: string;
  picture: {
    data: {
      url: string;
    };
  };
}

/**
 * Authenticate with Facebook (callback)
 * @route GET /api/auth/facebook
 */
export const authenticateFacebook = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code } = request.query;

    if (!code) {
      response.status(400).send('No code returned from facebook');
      return;
    }

    const tokenResponse = await axios.get(
      `https://graph.facebook.com/v11.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get<FacebookUserResponse>(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    const user = await User.findOne({ email: userResponse.data.email });
    
    if (user) {
      redirectAndSendToken('/', user, 200, response);
    } else {
      const newUser = await registerUser(
        userResponse.data.name,
        userResponse.data.email,
        '',
        '',
        'facebook',
        userResponse.data.picture.data.url
      );

      redirectAndSendToken('/', newUser, 200, response);
    }
  } catch (error) {
    console.error(error);
    response.status(500).send('Error authenticating with Facebook');
  }
};

/**
 * Logout user
 * @route GET /api/auth/logout
 */
export const logoutUser = (
  request: Request,
  response: Response,
  next: NextFunction
): Response => {
  return response
    .status(200)
    .clearCookie('token', {
      httpOnly: true,
      domain: process.env.NODE_ENV === 'production' ? '.biluibaba.com' : undefined,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .json({ success: true, data: 'Logged out successfully' });
};
