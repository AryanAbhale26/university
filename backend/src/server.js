import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectWithRetry } from './config/db.js';

// Import Routes
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import classRoutes from './routes/classRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/seed', healthRoutes); // allow POST /api/seed
app.use('/api/stats', statsRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🎓 University Management API is running',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/stats',
      '/api/students',
      '/api/teachers',
      '/api/departments',
      '/api/classes',
      '/api/subjects'
    ]
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 [Backend] University API listening on port ${PORT}`);
  console.log(`🔗 [Backend] Healthcheck URL: http://localhost:${PORT}/api/health`);
  // Attempt DB connection in background
  connectWithRetry();
});

