import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ConnectionBanner from './components/ConnectionBanner';
import DashboardTab from './components/DashboardTab';
import StudentsTab from './components/StudentsTab';
import TeachersTab from './components/TeachersTab';
import ClassesTab from './components/ClassesTab';
import DepartmentsTab from './components/DepartmentsTab';
import SubjectsTab from './components/SubjectsTab';
import DockerStatusTab from './components/DockerStatusTab';
import StudentDetailsModal from './components/StudentDetailsModal';
import AddStudentModal from './components/AddStudentModal';
import { api } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data States
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [dbHealth, setDbHealth] = useState(null);

  // Modal & Selection States
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter States for Students
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Fetch all primary collections
  const loadAllData = useCallback(async () => {
    try {
      // 1. Check health
      const healthData = await api.getHealth().catch(() => ({ database: { connected: false } }));
      setDbHealth(healthData);

      // 2. Load core collections in parallel
      const [statsRes, deptsRes, classesRes, teachersRes, subjectsRes] = await Promise.allSettled([
        api.getStats(),
        api.getDepartments(),
        api.getClasses(),
        api.getTeachers(),
        api.getSubjects()
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (deptsRes.status === 'fulfilled') setDepartments(deptsRes.value.data);
      if (classesRes.status === 'fulfilled') setClasses(classesRes.value.data);
      if (teachersRes.status === 'fulfilled') setTeachers(teachersRes.value.data);
      if (subjectsRes.status === 'fulfilled') setSubjects(subjectsRes.value.data);

    } catch (err) {
      console.error('Error during data fetch:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch filtered students
  const loadStudents = useCallback(async () => {
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filterDept) params.department_id = filterDept;
      if (filterClass) params.class_id = filterClass;
      if (filterStatus) params.status = filterStatus;

      const res = await api.getStudents(params);
      setStudents(res.data);
    } catch (err) {
      console.error('Error loading students:', err);
    }
  }, [searchQuery, filterDept, filterClass, filterStatus]);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Debounced/updated student search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadStudents();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadStudents]);

  // Reseed database handler
  const handleReseed = async () => {
    if (!window.confirm('Reset database with complete sample university data?')) return;
    setIsReseeding(true);
    try {
      await api.reseed();
      await loadAllData();
      await loadStudents();
      alert('✅ Database re-seeded successfully with fresh university records!');
    } catch (err) {
      alert(`Reseed failed: ${err.message}`);
    } finally {
      setIsReseeding(false);
    }
  };

  // Delete student
  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student "${name}"?`)) return;
    try {
      await api.deleteStudent(id);
      loadStudents();
      loadAllData();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Delete teacher
  const handleDeleteTeacher = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete faculty member "${name}"?`)) return;
    try {
      await api.deleteTeacher(id);
      loadAllData();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const counts = {
    students: students.length,
    teachers: teachers.length,
    classes: classes.length,
    departments: departments.length,
    subjects: subjects.length
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        dbHealth={dbHealth}
        onRefreshHealth={loadAllData}
        onReseed={handleReseed}
        isReseeding={isReseeding}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner if Docker DB not connected */}
        <ConnectionBanner
          dbHealth={dbHealth}
          onRetry={loadAllData}
          isRetrying={loading}
        />

        <div className="flex gap-6">
          {/* Left Navigation Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            counts={counts}
          />

          {/* Main Tab Content */}
          <main className="flex-1 min-w-0">
            {activeTab === 'dashboard' && (
              <DashboardTab
                stats={stats}
                onSelectStudent={setSelectedStudentId}
                onOpenAddStudent={() => setIsAddStudentOpen(true)}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'students' && (
              <StudentsTab
                students={students}
                loading={loading}
                departments={departments}
                classes={classes}
                onSelectStudent={setSelectedStudentId}
                onOpenAddModal={() => setIsAddStudentOpen(true)}
                onDeleteStudent={handleDeleteStudent}
                filterDept={filterDept}
                setFilterDept={setFilterDept}
                filterClass={filterClass}
                setFilterClass={setFilterClass}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {activeTab === 'teachers' && (
              <TeachersTab
                teachers={teachers}
                departments={departments}
                loading={loading}
                onRefresh={loadAllData}
                onDeleteTeacher={handleDeleteTeacher}
              />
            )}

            {activeTab === 'classes' && (
              <ClassesTab
                classes={classes}
                departments={departments}
                loading={loading}
                onRefresh={loadAllData}
              />
            )}

            {activeTab === 'departments' && (
              <DepartmentsTab
                departments={departments}
                loading={loading}
                onRefresh={loadAllData}
              />
            )}

            {activeTab === 'subjects' && (
              <SubjectsTab
                subjects={subjects}
                departments={departments}
                teachers={teachers}
                loading={loading}
                onRefresh={loadAllData}
              />
            )}

            {activeTab === 'docker' && (
              <DockerStatusTab
                dbHealth={dbHealth}
                onRefresh={loadAllData}
                onReseed={handleReseed}
                isReseeding={isReseeding}
              />
            )}
          </main>
        </div>
      </div>

      {/* Student Details Dossier Modal */}
      {selectedStudentId && (
        <StudentDetailsModal
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}

      {/* Add Student Modal */}
      {isAddStudentOpen && (
        <AddStudentModal
          isOpen={isAddStudentOpen}
          onClose={() => setIsAddStudentOpen(false)}
          onStudentAdded={() => {
            loadStudents();
            loadAllData();
          }}
          departments={departments}
          classes={classes}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        <p>Apex University Academic Information Portal • React + Tailwind CSS + Node.js + Docker MySQL</p>
      </footer>
    </div>
  );
}

