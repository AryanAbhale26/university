const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `HTTP error! status: ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Health & System
  getHealth: () => request('/health'),
  reseed: () => request('/seed', { method: 'POST' }),

  // Dashboard Stats
  getStats: () => request('/stats'),

  // Students
  getStudents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/students${query ? `?${query}` : ''}`);
  },
  getStudentById: (id) => request(`/students/${id}`),
  createStudent: (studentData) => request('/students', {
    method: 'POST',
    body: JSON.stringify(studentData)
  }),
  updateStudent: (id, studentData) => request(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(studentData)
  }),
  deleteStudent: (id) => request(`/students/${id}`, { method: 'DELETE' }),

  // Teachers / Faculty
  getTeachers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/teachers${query ? `?${query}` : ''}`);
  },
  getTeacherById: (id) => request(`/teachers/${id}`),
  createTeacher: (data) => request('/teachers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  deleteTeacher: (id) => request(`/teachers/${id}`, { method: 'DELETE' }),

  // Departments
  getDepartments: () => request('/departments'),
  createDepartment: (data) => request('/departments', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Classes
  getClasses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/classes${query ? `?${query}` : ''}`);
  },
  createClass: (data) => request('/classes', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Subjects
  getSubjects: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/subjects${query ? `?${query}` : ''}`);
  },
  createSubject: (data) => request('/subjects', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

