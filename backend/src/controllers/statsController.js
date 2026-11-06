import { pool } from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [[{ total_students }]] = await pool.query('SELECT COUNT(*) AS total_students FROM students');
    const [[{ total_teachers }]] = await pool.query('SELECT COUNT(*) AS total_teachers FROM teachers');
    const [[{ total_departments }]] = await pool.query('SELECT COUNT(*) AS total_departments FROM departments');
    const [[{ total_subjects }]] = await pool.query('SELECT COUNT(*) AS total_subjects FROM subjects');
    const [[{ avg_attendance }]] = await pool.query('SELECT ROUND(AVG(attendance_percentage), 1) AS avg_attendance FROM student_subjects');

    // Students per department
    const [deptDistribution] = await pool.query(`
      SELECT 
        d.id,
        d.name,
        d.code,
        COUNT(s.id) AS student_count
      FROM departments d
      LEFT JOIN students s ON d.id = s.department_id
      GROUP BY d.id
      ORDER BY student_count DESC
    `);

    // Recent 5 students
    const [recentStudents] = await pool.query(`
      SELECT 
        s.id,
        s.roll_number,
        CONCAT(s.first_name, ' ', s.last_name) AS full_name,
        s.email,
        s.avatar_url,
        s.admission_date,
        s.status,
        d.name AS department_name,
        d.code AS department_code,
        c.name AS class_name
      FROM students s
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN classes c ON s.class_id = c.id
      ORDER BY s.id DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        summary: {
          totalStudents: total_students || 0,
          totalTeachers: total_teachers || 0,
          totalDepartments: total_departments || 0,
          totalSubjects: total_subjects || 0,
          avgAttendance: avg_attendance || 0
        },
        deptDistribution,
        recentStudents
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

