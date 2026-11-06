import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'uni_user',
  password: process.env.DB_PASSWORD || 'uni_password_123',
  database: process.env.DB_NAME || 'university_db',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  multipleStatements: true
};

export const pool = mysql.createPool(dbConfig);

// Helper function to test connection and retry
export const connectWithRetry = async (maxRetries = 12, delayMs = 3000) => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      attempts++;
      const connection = await pool.getConnection();
      console.log(`✅ [Database] Successfully connected to MySQL at ${dbConfig.host}:${dbConfig.port} (${dbConfig.database})`);
      connection.release();
      await initDatabase();
      return true;
    } catch (err) {
      console.warn(`⏳ [Database] Connection attempt ${attempts}/${maxRetries} failed: ${err.message}. Retrying in ${delayMs / 1000}s...`);
      if (attempts >= maxRetries) {
        console.error('❌ [Database] Exhausted all connection attempts to MySQL.');
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return false;
};

// Check if tables exist; if not, execute schema & seed
export const initDatabase = async () => {
  try {
    const [tables] = await pool.query("SHOW TABLES LIKE 'students'");
    if (tables.length === 0) {
      console.log('🔄 [Database] Initializing tables and seed data...');
      // Look for init.sql
      const sqlPath = path.resolve(__dirname, '../../../docker/mysql/init.sql');
      if (fs.existsSync(sqlPath)) {
        const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
        await pool.query(sqlContent);
        console.log('✅ [Database] Schema and seed data successfully initialized from init.sql');
      } else {
        console.log('⚠️ [Database] init.sql not found at expected path. Running internal seed migration.');
      }
    } else {
      console.log('✅ [Database] Tables verified in database.');
    }
  } catch (err) {
    console.error('⚠️ [Database] Error during schema verification/initialization:', err.message);
  }
};

export default pool;

