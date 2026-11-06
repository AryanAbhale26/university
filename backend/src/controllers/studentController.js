import { pool } from '../config/db.js';

// Get all students with department & class info + search/filter
export const getAllStudents = async (req, res) => {
  try {
    const { search, department_id, class_id, status } = req.query;

    let query = `
      SELECT 
        s.id,
        s.roll_number,
        s.first_name,
        s.last_name,
        CONCAT(s.first_name, ' ', s.last_name) AS full_name,
        s.email,
        s.phone,
        s.gender,
        s.dob,
        s.admission_date,
        s.status,
        s.avatar_url,
        s.address,
        s.department_id,
        d.name AS department_name,
        d.code AS department_code,
        s.class_id,
        c.name AS class_name,
        c.semester AS class_semester,
        c.room_number,
        COUNT(ss.id) AS enrolled_subjects_count,
        ROUND(AVG(ss.attendance_percentage), 1) AS avg_attendance
      FROM students s
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN student_subjects ss ON s.id = ss.student_id
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      query += ` AND (
        s.roll_number LIKE ? OR 
        s.first_name LIKE ? OR 
        s.last_name LIKE ? OR 
        s.email LIKE ? OR
        CONCAT(s.first_name, ' ', s.last_name) LIKE ?
      )`;
      const sTerm = `%${search}%`;
      params.push(sTerm, sTerm, sTerm, sTerm, sTerm);
    }

    if (department_id) {
      query += ` AND s.department_id = ?`;
      params.push(department_id);
    }

    if (class_id) {
      query += ` AND s.class_id = ?`;
      params.push(class_id);
    }

    if (status) {
      query += ` AND s.status = ?`;
      params.push(status);
    }

    query += ` GROUP BY s.id ORDER BY s.roll_number ASC`;

    const [rows] = await pool.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single student by ID with complete subject and teacher details
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [studentRows] = await pool.query(`
      SELECT 
        s.*,
        CONCAT(s.first_name, ' ', s.last_name) AS full_name,
        d.name AS department_name,
        d.code AS department_code,
        d.building AS department_building,
        d.head_of_department,
        c.name AS class_name,
        c.semester AS class_semester,
        c.academic_year,
        c.room_number
      FROM students s
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE s.id = ?
    `, [id]);

    if (studentRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = studentRows[0];

    // Fetch subjects enrolled along with each subject's assigned teacher
    const [subjects] = await pool.query(`
      SELECT 
        sub.id AS subject_id,
        sub.name AS subject_name,
        sub.code AS subject_code,
        sub.credits,
        sub.semester,
        ss.grade,
        ss.attendance_percentage,
        t.id AS teacher_id,
        t.name AS teacher_name,
        t.email AS teacher_email,
        t.phone AS teacher_phone,
        t.designation AS teacher_designation,
        t.qualification AS teacher_qualification,
        t.avatar_url AS teacher_avatar
      FROM student_subjects ss
      JOIN subjects sub ON ss.subject_id = sub.id
      LEFT JOIN teachers t ON sub.teacher_id = t.id
      WHERE ss.student_id = ?
      ORDER BY sub.code ASC
    `, [id]);

    student.subjects = subjects;

    res.json({ success: true, data: student });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new student
export const createStudent = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      roll_number,
      first_name,
      last_name,
      email,
      phone,
      gender,
      dob,
      admission_date,
      department_id,
      class_id,
      address,
      status = 'Active',
      avatar_url,
      subject_ids = []
    } = req.body;

    if (!roll_number || !first_name || !last_name || !email || !department_id || !class_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: roll_number, first_name, last_name, email, department_id, class_id' 
      });
    }

    const defaultAvatar = avatar_url || (gender === 'Female' 
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250');

    const [result] = await connection.query(`
      INSERT INTO students (
        roll_number, first_name, last_name, email, phone, gender,
        dob, admission_date, department_id, class_id, address, status, avatar_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      roll_number,
      first_name,
      last_name,
      email,
      phone || null,
      gender || 'Male',
      dob || null,
      admission_date || new Date().toISOString().split('T')[0],
      department_id,
      class_id,
      address || null,
      status,
      defaultAvatar
    ]);

    const newStudentId = result.insertId;

    // Enroll in subjects if provided
    if (Array.isArray(subject_ids) && subject_ids.length > 0) {
      for (const subjId of subject_ids) {
        await connection.query(`
          INSERT INTO student_subjects (student_id, subject_id, grade, attendance_percentage)
          VALUES (?, ?, 'In Progress', 85.00)
          ON DUPLICATE KEY UPDATE student_id = student_id
        `, [newStudentId, subjId]);
      }
    } else {
      // Auto-enroll in subjects that match this department
      const [deptSubjects] = await connection.query(`
        SELECT id FROM subjects WHERE department_id = ? LIMIT 4
      `, [department_id]);
      for (const sub of deptSubjects) {
        await connection.query(`
          INSERT INTO student_subjects (student_id, subject_id, grade, attendance_percentage)
          VALUES (?, ?, 'In Progress', 90.00)
        `, [newStudentId, sub.id]);
      }
    }

    await connection.commit();

    res.status(201).json({ 
      success: true, 
      message: 'Student created successfully', 
      studentId: newStudentId 
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating student:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Roll number or Email already exists!' });
    }
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// Update an existing student
export const updateStudent = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    const {
      roll_number,
      first_name,
      last_name,
      email,
      phone,
      gender,
      dob,
      admission_date,
      department_id,
      class_id,
      address,
      status,
      avatar_url,
      subject_ids
    } = req.body;

    await connection.query(`
      UPDATE students SET
        roll_number = COALESCE(?, roll_number),
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        gender = COALESCE(?, gender),
        dob = COALESCE(?, dob),
        admission_date = COALESCE(?, admission_date),
        department_id = COALESCE(?, department_id),
        class_id = COALESCE(?, class_id),
        address = COALESCE(?, address),
        status = COALESCE(?, status),
        avatar_url = COALESCE(?, avatar_url)
      WHERE id = ?
    `, [
      roll_number, first_name, last_name, email, phone, gender,
      dob, admission_date, department_id, class_id, address, status, avatar_url, id
    ]);

    // If subject_ids provided, update enrollments
    if (Array.isArray(subject_ids)) {
      await connection.query('DELETE FROM student_subjects WHERE student_id = ?', [id]);
      for (const subjId of subject_ids) {
        await connection.query(`
          INSERT INTO student_subjects (student_id, subject_id, grade, attendance_percentage)
          VALUES (?, ?, 'In Progress', 85.00)
        `, [id, subjId]);
      }
    }

    await connection.commit();
    res.json({ success: true, message: 'Student updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// Delete a student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

