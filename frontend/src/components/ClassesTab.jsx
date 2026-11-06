import React, { useState } from 'react';
import { School, Building2, Users, Calendar, MapPin, Plus, Sparkles } from 'lucide-react';
import { api } from '../api/client';

export default function ClassesTab({ classes, departments, loading, onRefresh }) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    department_id: departments[0]?.id || '',
    semester: 'Semester 5',
    academic_year: '2025-2026',
    room_number: 'Room 301'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createClass(formData);
      setIsAdding(false);
      setFormData({
        name: '',
        department_id: departments[0]?.id || '',
        semester: 'Semester 5',
        academic_year: '2025-2026',
        room_number: 'Room 301'
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
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Classes & Sections</h2>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
              {classes.length} Academic Cohorts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Organized year cohorts, semesters, lecture halls, and active class enrollments.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Create Class'}</span>
        </button>
      </div>

      {/* Quick Add Form Drawer */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">Define New Class / Cohort</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Class Code / Name *</label>
              <input
                type="text"
                placeholder="e.g. CSE-Year4-SecA"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
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
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Semester *</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={`Semester ${s}`}>Semester {s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Room / Hall</label>
              <input
                type="text"
                placeholder="e.g. Turing Hall 301"
                value={formData.room_number}
                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow"
              >
                {submitting ? 'Creating...' : 'Save Class'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{cls.name}</h4>
                  <span className="text-xs font-semibold text-indigo-600">{cls.semester}</span>
                </div>
              </div>
              <span className="text-xs font-bold font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                {cls.department_code}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Department:</span>
                </span>
                <span className="font-semibold text-slate-800">{cls.department_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Room:</span>
                </span>
                <span className="font-semibold text-slate-800">{cls.room_number || 'Hall A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Academic Year:</span>
                </span>
                <span className="font-semibold text-slate-800">{cls.academic_year || '2025-2026'}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 text-slate-700">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="font-bold">{cls.student_count || 0} Students Enrolled</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Active Cohort
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

