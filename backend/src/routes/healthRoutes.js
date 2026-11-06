import { Router } from 'express';
import { pool } from '../config/db.js';
import { reseedDatabase } from '../seed/seedData.js';

const router = Router();

router.get('/', async (req, res) => {
  const startTime = Date.now();
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution, DATABASE() as db_name, VERSION() as version');
    const latency = Date.now() - startTime;

    // Check counts
    const [[{ students }]] = await pool.query('SELECT COUNT(*) as students FROM students').catch(() => [[{ students: 0 }]]);
    const [[{ teachers }]] = await pool.query('SELECT COUNT(*) as teachers FROM teachers').catch(() => [[{ teachers: 0 }]]);
    const [[{ departments }]] = await pool.query('SELECT COUNT(*) as departments FROM departments').catch(() => [[{ departments: 0 }]]);

    res.json({
      status: 'healthy',
      database: {
        connected: true,
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        name: rows[0]?.db_name || 'university_db',
        version: rows[0]?.version,
        latencyMs: latency
      },
      counts: {
        students,
        teachers,
        departments
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: {
        connected: false,
        error: error.message,
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306
      },
      timestamp: new Date().toISOString()
    });
  }
});

router.post('/seed', async (req, res) => {
  try {
    const result = await reseedDatabase();
    res.json({ success: true, message: 'Database reset and sample data re-seeded successfully', result });
  } catch (error) {
    console.error('Error in /api/seed:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

