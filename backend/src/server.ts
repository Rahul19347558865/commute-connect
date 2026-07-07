import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authMiddleware, AuthenticatedRequest } from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Security & Logging Middlewares
app.use(helmet());
app.use(cors({
  origin: true, // Allow all origins for development; in production restrict to frontend URL
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// Public Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Commute Connect API',
  });
});

// Auth Routes mount
app.use('/api/auth', authRoutes);

// Protected Test Route to verify Supabase SDK Session verification
app.get('/api/auth/test-auth', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Authentication successful. Supabase SDK session verified.',
    user: req.user,
  });
});

// Centralized Error Handler Middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred on the server.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[Server] Commute Connect backend running on http://localhost:${PORT}`);
});
