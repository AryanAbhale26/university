-- University Management Database Schema & Seed Data
CREATE DATABASE IF NOT EXISTS university_db;
USE university_db;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    building VARCHAR(100) DEFAULT 'Main Campus',
    head_of_department VARCHAR(100),
    established_year INT DEFAULT 2010,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Classes Table (Year / Semester / Section)
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    department_id INT NOT NULL,
    semester VARCHAR(30) NOT NULL,
    academic_year VARCHAR(20) NOT NULL DEFAULT '2025-2026',
    room_number VARCHAR(30) DEFAULT 'Hall A',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- 3. Teachers / Faculty Table
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(25),
    department_id INT NOT NULL,
    designation VARCHAR(60) DEFAULT 'Assistant Professor',
    qualification VARCHAR(100) DEFAULT 'M.Tech / Ph.D.',
    avatar_url VARCHAR(255),
    joining_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- 4. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    department_id INT NOT NULL,
    credits INT DEFAULT 3,
    teacher_id INT,
    semester VARCHAR(30) DEFAULT 'Semester 1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- 5. Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(25),
    gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
    dob DATE,
    admission_date DATE,
    department_id INT NOT NULL,
    class_id INT NOT NULL,
    address TEXT,
    status ENUM('Active', 'Graduated', 'Suspended') DEFAULT 'Active',
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- 6. Student Subjects Enrollment & Performance
CREATE TABLE IF NOT EXISTS student_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    grade VARCHAR(20) DEFAULT 'In Progress',
    attendance_percentage DECIMAL(5, 2) DEFAULT 85.00,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_student_subject (student_id, subject_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- ==========================================
-- SEED DATA
-- ==========================================

-- Insert Departments
INSERT INTO departments (id, name, code, building, head_of_department, established_year) VALUES
(1, 'Computer Science & Engineering', 'CSE', 'Alan Turing Building, 3rd Floor', 'Dr. Alistair Vance', 2005),
(2, 'Electrical & Electronics Engineering', 'EEE', 'Nikola Tesla Hall, 2nd Floor', 'Dr. Eleanor Campbell', 2006),
(3, 'Mechanical Engineering', 'ME', 'James Watt Block, 1st Floor', 'Dr. Robert Stirling', 2008),
(4, 'Business & Information Systems', 'BIS', 'Grace Hopper Complex, 4th Floor', 'Dr. Margaret Hamilton', 2012)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Classes
INSERT INTO classes (id, name, department_id, semester, academic_year, room_number) VALUES
(1, 'CSE-Year3-SecA', 1, 'Semester 5', '2025-2026', 'Turing Lab 301'),
(2, 'CSE-Year3-SecB', 1, 'Semester 5', '2025-2026', 'Turing Lab 302'),
(3, 'CSE-Year2-SecA', 1, 'Semester 3', '2025-2026', 'Room 204'),
(4, 'EEE-Year3-SecA', 2, 'Semester 5', '2025-2026', 'Tesla Hall 201'),
(5, 'EEE-Year2-SecA', 2, 'Semester 3', '2025-2026', 'Tesla Hall 105'),
(6, 'ME-Year4-SecA', 3, 'Semester 7', '2025-2026', 'Watt Workshop 102'),
(7, 'BIS-Year2-SecA', 4, 'Semester 3', '2025-2026', 'Hopper Seminar 402')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Teachers
INSERT INTO teachers (id, name, email, phone, department_id, designation, qualification, avatar_url, joining_date) VALUES
(1, 'Dr. Marcus Reynolds', 'marcus.reynolds@apex.edu', '+1 (555) 234-5671', 1, 'Professor & Chair', 'Ph.D. in Computer Science (MIT)', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', '2014-08-15'),
(2, 'Prof. Elena Rostova', 'elena.rostova@apex.edu', '+1 (555) 345-6782', 1, 'Associate Professor', 'Ph.D. in Algorithms & Complexity', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250', '2017-01-10'),
(3, 'Dr. Jonathan Blake', 'jonathan.blake@apex.edu', '+1 (555) 456-7893', 1, 'Assistant Professor', 'Ph.D. in Distributed Systems', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', '2019-06-01'),
(4, 'Dr. Sarah Chen', 'sarah.chen@apex.edu', '+1 (555) 567-8904', 2, 'Professor', 'Ph.D. in VLSI & Microelectronics', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250', '2015-09-20'),
(5, 'Prof. David Kalu', 'david.kalu@apex.edu', '+1 (555) 678-9015', 2, 'Associate Professor', 'Ph.D. in Power Systems', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250', '2018-03-15'),
(6, 'Dr. Arthur Pendelton', 'arthur.p@apex.edu', '+1 (555) 789-0126', 3, 'Senior Professor', 'Ph.D. in Thermodynamics (Cambridge)', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250', '2011-04-12'),
(7, 'Dr. Maya Lin', 'maya.lin@apex.edu', '+1 (555) 890-1237', 4, 'Associate Professor', 'Ph.D. in Enterprise Architecture', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250', '2020-02-18')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Subjects (With Assigned Teachers!)
INSERT INTO subjects (id, name, code, department_id, credits, teacher_id, semester) VALUES
(1, 'Data Structures & Algorithms', 'CS301', 1, 4, 2, 'Semester 5'),
(2, 'Database Management Systems', 'CS302', 1, 4, 1, 'Semester 5'),
(3, 'Operating Systems & Concurrency', 'CS303', 1, 4, 3, 'Semester 5'),
(4, 'Computer Networks & Security', 'CS304', 1, 3, 3, 'Semester 5'),
(5, 'Object Oriented Programming with Java', 'CS201', 1, 4, 2, 'Semester 3'),
(6, 'Digital Circuit Design', 'EE301', 2, 4, 4, 'Semester 5'),
(7, 'Control Systems & Instrumentation', 'EE302', 2, 4, 5, 'Semester 5'),
(8, 'Microcontrollers & Embedded Systems', 'EE201', 2, 4, 4, 'Semester 3'),
(9, 'Fluid Mechanics & Turbomachinery', 'ME401', 3, 4, 6, 'Semester 7'),
(10, 'Enterprise Resource Planning & Cloud', 'BIS201', 4, 3, 7, 'Semester 3')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Students
INSERT INTO students (id, roll_number, first_name, last_name, email, phone, gender, dob, admission_date, department_id, class_id, address, status, avatar_url) VALUES
(1, 'CSE-2023-001', 'Alexander', 'Wright', 'alex.wright@student.apex.edu', '+1 (555) 901-2301', 'Male', '2003-04-12', '2023-08-20', 1, 1, '42 Maple Street, Tech District', 'Active', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250'),
(2, 'CSE-2023-002', 'Sophia', 'Martinez', 'sophia.m@student.apex.edu', '+1 (555) 901-2302', 'Female', '2003-09-18', '2023-08-20', 1, 1, '118 Horizon Boulevard, Metro City', 'Active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250'),
(3, 'CSE-2023-003', 'Liam', 'Patel', 'liam.patel@student.apex.edu', '+1 (555) 901-2303', 'Male', '2003-11-25', '2023-08-20', 1, 1, '77 Silicon Way, Innovation Hub', 'Active', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250'),
(4, 'CSE-2023-004', 'Emily', 'Zhang', 'emily.zhang@student.apex.edu', '+1 (555) 901-2304', 'Female', '2003-02-14', '2023-08-20', 1, 2, '210 University Ave, Campus View', 'Active', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250'),
(5, 'CSE-2023-005', 'Daniel', 'Kim', 'daniel.kim@student.apex.edu', '+1 (555) 901-2305', 'Male', '2002-12-05', '2023-08-20', 1, 2, '54 Meadow Lane, Riverside', 'Active', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250'),
(6, 'CSE-2024-010', 'Chloe', 'Dubois', 'chloe.d@student.apex.edu', '+1 (555) 901-2306', 'Female', '2004-06-30', '2024-08-22', 1, 3, '89 Park Crest, Oakridge', 'Active', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250'),
(7, 'EEE-2023-001', 'Ethan', 'Brooks', 'ethan.brooks@student.apex.edu', '+1 (555) 901-2307', 'Male', '2003-08-11', '2023-08-20', 2, 4, '305 Amber Court, Highland', 'Active', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250'),
(8, 'EEE-2023-002', 'Aisha', 'Khan', 'aisha.khan@student.apex.edu', '+1 (555) 901-2308', 'Female', '2003-10-09', '2023-08-20', 2, 4, '12 Cedar Ridge, West End', 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'),
(9, 'ME-2022-001', 'Lucas', 'Mendoza', 'lucas.m@student.apex.edu', '+1 (555) 901-2309', 'Male', '2002-05-19', '2022-08-25', 3, 6, '415 Ironwood Terrace, Northpoint', 'Active', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=250'),
(10, 'BIS-2024-001', 'Jessica', 'Taylor', 'jessica.t@student.apex.edu', '+1 (555) 901-2310', 'Female', '2004-03-22', '2024-08-22', 4, 7, '99 Beacon Hill, Downtown', 'Active', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=250')
ON DUPLICATE KEY UPDATE roll_number=VALUES(roll_number);

-- Insert Student Subjects Enrollments (Linking Students to Subjects and their Teachers!)
INSERT INTO student_subjects (student_id, subject_id, grade, attendance_percentage) VALUES
-- Alex Wright (CSE Year 3)
(1, 1, 'A', 94.50),  -- DSA (Prof. Elena)
(1, 2, 'A+', 98.00), -- DBMS (Dr. Marcus)
(1, 3, 'B+', 89.20), -- OS (Dr. Jonathan)
(1, 4, 'A-', 91.00), -- Networks (Dr. Jonathan)

-- Sophia Martinez (CSE Year 3)
(2, 1, 'A+', 97.50), -- DSA
(2, 2, 'A', 95.00),  -- DBMS
(2, 3, 'A', 93.80),  -- OS
(2, 4, 'A+', 99.00), -- Networks

-- Liam Patel (CSE Year 3)
(3, 1, 'B', 82.50),  -- DSA
(3, 2, 'B+', 86.00), -- DBMS
(3, 3, 'A-', 90.50), -- OS
(3, 4, 'B', 84.00),  -- Networks

-- Emily Zhang (CSE Year 3)
(4, 1, 'A', 92.00),
(4, 2, 'A-', 90.00),
(4, 3, 'B+', 88.00),
(4, 4, 'A', 94.00),

-- Daniel Kim (CSE Year 3)
(5, 1, 'B-', 79.50),
(5, 2, 'B', 83.00),
(5, 3, 'C+', 76.50),
(5, 4, 'B', 81.00),

-- Chloe Dubois (CSE Year 2)
(6, 5, 'A', 95.00),  -- Java OOP

-- Ethan Brooks (EEE Year 3)
(7, 6, 'A', 92.50),  -- Digital Circuit (Dr. Sarah)
(7, 7, 'B+', 88.00), -- Control Systems (Prof. David)

-- Aisha Khan (EEE Year 3)
(8, 6, 'A+', 97.00),
(8, 7, 'A', 94.00),

-- Lucas Mendoza (ME Year 4)
(9, 9, 'A', 91.00),  -- Fluid Mechanics (Dr. Arthur)

-- Jessica Taylor (BIS Year 2)
(10, 10, 'A+', 96.50) -- ERP & Cloud (Dr. Maya)
ON DUPLICATE KEY UPDATE grade=VALUES(grade);
