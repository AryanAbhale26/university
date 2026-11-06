import { pool } from '../config/db.js';

export const getAllDepartments = async (req, res) => {
  try {
    const [departments] = await pool.query(`
      SELECT 
        d.*,
        COUNT(DISTINCT s.id) AS student_count,
        COUNT(DISTINCT t.id) AS teacher_count,
        COUNT(DISTINCT c.id) AS class_count,
        COUNT(DISTINCT sub.id) AS subject_count
      FROM departments d
      LEFT JOIN students s ON d.id = s.department_id
      LEFT JOIN teachers t ON d.id = t.department_id
      LEFT JOIN classes c ON d.id = c.department_id
      LEFT JOIN subjects sub ON d.id = sub.department_id
      GROUP BY d.id
      ORDER BY d.name ASC
    `);

    res.json({ success: true, count: departments.length, data: departments });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name, code, building, head_of_department, established_year } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and Code are required' });
    }

    const [result] = await pool.query(`
      INSERT INTO departments (name, code, building, head_of_department, established_year)
      VALUES (?, ?, ?, ?, ?)
    `, [name, code.toUpperCase(), building || 'Main Campus', head_of_department || null, established_year || 2025]);

    res.status(201).json({ success: true, message: 'Department created', departmentId: result.insertId });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

