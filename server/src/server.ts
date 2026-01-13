import 'dotenv/config';
import logger from 'coders-logger';
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db';
import { errorHandler } from './middleware/error';

// Routes
import authRoutes from './routes/auth';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import appRoutes from './routes/app';
import vendorRoutes from './routes/vendor';
import vetRoutes from './routes/vet';
import roomRoutes from './routes/room';
import adoptionsRoutes from './routes/adoptions';
import adminRoutes from './routes/admin';

/**
 * Server Entry Point
 * Main Express application setup
 */

// Connect to database
connectDB();

const app = express();

// CORS configuration
const corsOrigins = [
  process.env.CORS_ORIGIN,
  process.env.APP_CORS_ORIGIN,
  process.env.ADMIN_CORS_ORIGIN,
  process.env.ROOM_CORS_ORIGIN,
].filter(Boolean) as string[];

app.use(
  cors({
    credentials: true,
    origin: corsOrigins,
  })
);

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Static file serving
app.use('/uploads/profile', express.static('./uploads/profile'));
app.use('/uploads/product', express.static('./uploads/product'));
app.use('/uploads/adoptions', express.static('./uploads/adoptions'));
app.use('/uploads/site-settings', express.static('./uploads/site-settings'));
app.use('/uploads/logo', express.static('./uploads/logo.png'));
app.use('/uploads/vendor', express.static('./uploads/vendor'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/app', appRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/vet', vetRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/adoptions', adoptionsRoutes);
app.use('/api/admin', adminRoutes);

// Location API endpoint
interface ILocationQuery {
  lat?: string;
  lng?: string;
}

interface IOpenCageResponse {
  results: Array<{
    components: {
      city?: string;
      town?: string;
      village?: string;
      state?: string;
      country?: string;
    };
  }>;
}

app.get('/location', async (request: Request<{}, {}, {}, ILocationQuery>, response: Response) => {
  try {
    const { lat, lng } = request.query;

    if (!lat || !lng) {
      return response.status(400).json({ message: 'Missing coordinates' });
    }

    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.OPENCAGE_API_KEY}`
    );

    const data: IOpenCageResponse = await res.json();

    if (data.results.length > 0) {
      const components = data.results[0].components;
      return response.status(200).json({
        city: components.city || components.town || components.village,
        state: components.state,
        country: components.country,
      });
    }

    return response.status(200).json({ message: false });
  } catch (error) {
    console.error('Location API error:', error);
    return response.status(500).json({ message: 'Error fetching location' });
  }
});

// Error handler middleware
app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.success(`Server is running on port ${PORT}`);
});

// Graceful shutdown on unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;
