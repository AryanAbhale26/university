# 🎓 Apex University Portal - Academic Management System

A full-stack University & Student Management System built with **React + Vite + Tailwind CSS**, **Node.js (Express REST API)**, and **MySQL 8.0 running in Docker**.

---

## 🌟 Key Features

- **Students Directory & Dossier**:
  - Full student profile with Roll Number, Department, Class/Cohort, Semester, Contact & Address.
  - **Subject & Teacher Breakdown**: Lists each enrolled course, credit hours, performance grade, and **the exact assigned Faculty Teacher of each subject** (with teacher designation, email, phone, and avatar).
  - Search by roll number, student name, or email.
  - Filter by Department, Class, and Enrollment status (Active, Graduated, Suspended).
  - Add and delete students with automated roll-number suggestion and department course allotment.
- **Faculty & Teachers Directory**:
  - Detailed profiles of university professors, associate professors, and department chairs.
  - View all courses/subjects taught by each teacher.
  - Add new faculty members with department assignment.
- **Academic Classes & Cohorts**:
  - Class sections (e.g. `CSE-Year3-SecA`), semesters, academic years, lecture hall/room number, and enrolled student counts.
- **Departments & Courses Catalog**:
  - Department overview with student, faculty, and course distribution.
  - Complete course catalog with credit breakdown and assigned instructors.
- **Live Docker MySQL Health Diagnostics**:
  - Telemetry showing connection status, ping round-trip latency, active database schema, and table row counts.
  - One-click "Reseed Database" to restore fresh sample data anytime.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React | Modern responsive UI, modal drawers, badges, real-time filters |
| **Backend** | Node.js, Express.js, MySQL2 (Connection Pool) | RESTful API, connection auto-retry, auto-schema migration |
| **Database** | MySQL 8.0 in Docker Container | Persistent volume, automatic `init.sql` schema & sample seeds |
| **Containerization** | Docker Compose | Multi-container orchestration (`mysql-db`, `backend`, `frontend`) |

---

## 🚀 Quick Start Guide

### Option 1: Run with Docker Compose (Recommended)

1. Start all services:
   ```bash
   docker-compose up -d
   ```
2. Open your browser:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
   - **MySQL Container**: Port `3306` (`university-mysql`)

---

### Option 2: Run Database in Docker & Apps Locally

1. **Start the MySQL container in Docker**:
   ```bash
   docker-compose up -d mysql-db
   ```

2. **Start the Node.js Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *Backend starts at `http://localhost:5000`*

3. **Start the React Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend starts at `http://localhost:3000`*

---

## 🗄️ Database Schema & Entities

The system defines 6 relational tables with cascading foreign keys:

1. **`departments`**: `id`, `name`, `code`, `building`, `head_of_department`, `established_year`
2. **`classes`**: `id`, `name`, `department_id`, `semester`, `academic_year`, `room_number`
3. **`teachers`**: `id`, `name`, `email`, `phone`, `department_id`, `designation`, `qualification`, `avatar_url`
4. **`subjects`**: `id`, `name`, `code`, `department_id`, `credits`, `teacher_id` (FK to teachers)
5. **`students`**: `id`, `roll_number`, `first_name`, `last_name`, `email`, `phone`, `gender`, `dob`, `admission_date`, `department_id`, `class_id`, `address`, `status`
6. **`student_subjects`**: `student_id`, `subject_id`, `grade`, `attendance_percentage`

---

## 📡 API Endpoints Summary

- `GET /api/health` - Check MySQL connection status and query ping latency
- `POST /api/seed` - Reset & populate sample university data
- `GET /api/stats` - Summary dashboard metrics & department distribution
- `GET /api/students` - Query students with search & filter params
- `GET /api/students/:id` - Fetch student dossier with subjects & assigned teachers
- `POST /api/students` - Create student record & enroll courses
- `DELETE /api/students/:id` - Delete student record
- `GET /api/teachers` - Fetch teachers with assigned subjects
- `POST /api/teachers` - Add new faculty member
- `GET /api/departments` - List departments with student & faculty metrics
- `GET /api/classes` - List classes and semester cohorts
- `GET /api/subjects` - List subjects with designated instructors

