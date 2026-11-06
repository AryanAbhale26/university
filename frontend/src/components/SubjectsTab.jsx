import React, { useState } from 'react';
import { BookOpen, Users, Building2, UserCheck, Plus, Sparkles, Mail } from 'lucide-react';
import { api } from '../api/client';

export default function SubjectsTab({ subjects, departments, teachers, loading, onRefresh }) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department_id: departments[0]?.id || '',
    credits: 4,
    teacher_id: teachers[0]?.id || '',
    semester: 'Semester 5'
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');

  const filteredSubjects = selectedDept 
    ? subjects.filter(s => s.department_id == selectedDept)
    : subjects;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createSubject(formData);
      setIsAdding(false);
      setFormData({
        name: '',
        code: '',
        department_id: departments[0]?.id || '',
        credits: 4,
        teacher_id: teachers[0]?.id || '',
        semester: 'Semester 5'
      });
      onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Subjects & Courses Catalog</h2>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
              {subjects.length} Courses
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Curriculum subjects, assigned course teachers, and semester credits.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
            ))}
          </select>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Cancel' : 'Add Subject'}</span>
          </button>
        </div>
      </div>

      {/* Add Drawer */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add New Subject & Assign Teacher</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Subject Name *</label>
              <input
                type="text"
                placeholder="e.g. Artificial Intelligence"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Course Code *</label>
              <input
                type="text"
                placeholder="e.g. CS405"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Department *</label>
              <select
                value={formData.department_id}
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Assign Teacher *</label>
              <select
                value={formData.teacher_id}
                onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              >
                <option value="">-- No Teacher Assigned --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.designation})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Credits</label>
              <select
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              >
                <option value={1}>1 Credit</option>
                <option value={2}>2 Credits</option>
                <option value={3}>3 Credits</option>
                <option value={4}>4 Credits</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow"
            >
              {submitting ? 'Creating...' : 'Register Subject'}
            </button>
          </div>
        </form>
      )}

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubjects.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200/60">
                  {sub.code}
                </span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {sub.credits} Credits
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-base mt-2.5 leading-snug">{sub.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{sub.department_name} • {sub.semester}</p>

              {/* Assigned Teacher Card */}
              <div className="mt-4 bg-slate-50 border border-slate-200/90 rounded-xl p-3 flex items-center space-x-3">
                <img
                  src={sub.teacher_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                  alt={sub.teacher_name || 'Subject Teacher'}
                  className="w-10 h-10 rounded-full object-cover border border-slate-300 shadow-sm flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                    Assigned Teacher
                  </span>
                  <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {sub.teacher_name || 'Instructor Not Assigned'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{sub.teacher_designation || 'Faculty'}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>{sub.enrolled_students_count || 0} Students Enrolled</span>
              </span>
              <span className="font-semibold text-indigo-600">Active Syllabus</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

