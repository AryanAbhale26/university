import { pool } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const reseedDatabase = async () => {
  try {
    const sqlPath = path.resolve(__dirname, '../../../docker/mysql/init.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`init.sql not found at ${sqlPath}`);
    }
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Disable foreign key checks, execute script, re-enable
    const connection = await pool.getConnection();
    try {
      await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      await connection.query(sql);
      await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
      console.log('✅ Database reset and seeded successfully.');
      return { success: true, message: 'Database reset and seeded successfully.' };
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('❌ Reseed failed:', err);
    throw err;
  }
};

// If run directly
if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  reseedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

