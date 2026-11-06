import { pool } from '../config/db.js';

export const getAllSubjects = async (req, res) => {
  try {
    const { department_id } = req.query;
    let query = `
      SELECT 
        s.id,
        s.name,
        s.code,
        s.credits,
        s.semester,
        s.department_id,
        d.name AS department_name,
        d.code AS department_code,
        s.teacher_id,
        t.name AS teacher_name,
        t.email AS teacher_email,
        t.designation AS teacher_designation,
        t.avatar_url AS teacher_avatar,
        COUNT(ss.student_id) AS enrolled_students_count
      FROM subjects s
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN teachers t ON s.teacher_id = t.id
      LEFT JOIN student_subjects ss ON s.id = ss.subject_id
      WHERE 1=1
    `;
    const params = [];
    if (department_id) {
      query += ` AND s.department_id = ?`;
      params.push(department_id);
    }
    query += ` GROUP BY s.id ORDER BY s.code ASC`;

    const [rows] = await pool.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { name, code, department_id, credits, teacher_id, semester } = req.body;
    if (!name || !code || !department_id) {
      return res.status(400).json({ success: false, message: 'Name, Code, and Department are required' });
    }

    const [result] = await pool.query(`
      INSERT INTO subjects (name, code, department_id, credits, teacher_id, semester)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, code.toUpperCase(), department_id, credits || 3, teacher_id || null, semester || 'Semester 1']);

    res.status(201).json({ success: true, message: 'Subject created', subjectId: result.insertId });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

