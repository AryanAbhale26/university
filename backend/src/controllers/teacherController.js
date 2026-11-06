import { pool } from '../config/db.js';

export const getAllTeachers = async (req, res) => {
  try {
    const { department_id } = req.query;
    let query = `
      SELECT 
        t.id,
        t.name,
        t.email,
        t.phone,
        t.department_id,
        d.name AS department_name,
        d.code AS department_code,
        t.designation,
        t.qualification,
        t.avatar_url,
        t.joining_date,
        COUNT(DISTINCT s.id) AS subjects_count,
        GROUP_CONCAT(CONCAT(s.code, ': ', s.name) SEPARATOR ' || ') AS subjects_taught_str
      FROM teachers t
      LEFT JOIN departments d ON t.department_id = d.id
      LEFT JOIN subjects s ON t.id = s.teacher_id
      WHERE 1=1
    `;
    const params = [];
    if (department_id) {
      query += ` AND t.department_id = ?`;
      params.push(department_id);
    }
    query += ` GROUP BY t.id ORDER BY t.name ASC`;

    const [rows] = await pool.query(query, params);

    const formatted = rows.map(teacher => ({
      ...teacher,
      subjects_taught: teacher.subjects_taught_str 
        ? teacher.subjects_taught_str.split(' || ') 
        : []
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const [teachers] = await pool.query(`
      SELECT 
        t.*,
        d.name AS department_name,
        d.code AS department_code
      FROM teachers t
      LEFT JOIN departments d ON t.department_id = d.id
      WHERE t.id = ?
    `, [id]);

    if (teachers.length === 0) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const teacher = teachers[0];

    const [subjects] = await pool.query(`
      SELECT 
        s.*,
        COUNT(ss.student_id) AS enrolled_students_count
      FROM subjects s
      LEFT JOIN student_subjects ss ON s.id = ss.subject_id
      WHERE s.teacher_id = ?
      GROUP BY s.id
    `, [id]);

    teacher.subjects = subjects;
    res.json({ success: true, data: teacher });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const { name, email, phone, department_id, designation, qualification, avatar_url } = req.body;
    if (!name || !email || !department_id) {
      return res.status(400).json({ success: false, message: 'Name, email, and department are required' });
    }

    const defaultAvatar = avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';

    const [result] = await pool.query(`
      INSERT INTO teachers (name, email, phone, department_id, designation, qualification, avatar_url, joining_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())
    `, [name, email, phone || null, department_id, designation || 'Assistant Professor', qualification || 'M.Tech / Ph.D.', defaultAvatar]);

    res.status(201).json({ success: true, message: 'Teacher added successfully', teacherId: result.insertId });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, department_id, designation, qualification, avatar_url } = req.body;

    await pool.query(`
      UPDATE teachers SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        department_id = COALESCE(?, department_id),
        designation = COALESCE(?, designation),
        qualification = COALESCE(?, qualification),
        avatar_url = COALESCE(?, avatar_url)
      WHERE id = ?
    `, [name, email, phone, department_id, designation, qualification, avatar_url, id]);

    res.json({ success: true, message: 'Teacher updated successfully' });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM teachers WHERE id = ?', [id]);
    res.json({ success: true, message: 'Teacher removed successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

