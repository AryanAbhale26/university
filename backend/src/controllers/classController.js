import { pool } from '../config/db.js';

export const getAllClasses = async (req, res) => {
  try {
    const { department_id } = req.query;
    let query = `
      SELECT 
        c.*,
        d.name AS department_name,
        d.code AS department_code,
        COUNT(s.id) AS student_count
      FROM classes c
      JOIN departments d ON c.department_id = d.id
      LEFT JOIN students s ON c.id = s.class_id
      WHERE 1=1
    `;
    const params = [];
    if (department_id) {
      query += ` AND c.department_id = ?`;
      params.push(department_id);
    }
    query += ` GROUP BY c.id ORDER BY c.department_id, c.name ASC`;

    const [rows] = await pool.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createClass = async (req, res) => {
  try {
    const { name, department_id, semester, academic_year, room_number } = req.body;
    if (!name || !department_id || !semester) {
      return res.status(400).json({ success: false, message: 'Name, Department, and Semester are required' });
    }

    const [result] = await pool.query(`
      INSERT INTO classes (name, department_id, semester, academic_year, room_number)
      VALUES (?, ?, ?, ?, ?)
    `, [name, department_id, semester, academic_year || '2025-2026', room_number || 'Room 101']);

    res.status(201).json({ success: true, message: 'Class created', classId: result.insertId });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

