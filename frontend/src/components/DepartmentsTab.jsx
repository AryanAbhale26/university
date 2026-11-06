import React, { useState } from 'react';
import { Building2, Users, School, BookOpen, GraduationCap, MapPin, UserCheck, Plus } from 'lucide-react';
import { api } from '../api/client';

export default function DepartmentsTab({ departments, loading, onRefresh }) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    building: '',
    head_of_department: '',
    established_year: 2020
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createDepartment(formData);
      setIsAdding(false);
      setFormData({ name: '', code: '', building: '', head_of_department: '', established_year: 2025 });
      onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Academic Departments</h2>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
              {departments.length} Faculties
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Engineering divisions, collegiate blocks, department chairs, and academic metrics.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'New Department'}</span>
        </button>
      </div>

      {/* Add Drawer */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add Academic Department</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Department Name *</label>
              <input
                type="text"
                placeholder="e.g. Aerospace Engineering"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Code *</label>
              <input
                type="text"
                placeholder="e.g. AERO"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Building Location</label>
              <input
                type="text"
                placeholder="e.g. Von Karman Hall"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Head of Department (HOD)</label>
              <input
                type="text"
                placeholder="e.g. Dr. Jane Goodall"
                value={formData.head_of_department}
                onChange={(e) => setFormData({ ...formData, head_of_department: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow"
            >
              {submitting ? 'Creating...' : 'Create Department'}
            </button>
          </div>
        </form>
      )}

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200/60 inline-block mb-2">
                    {dept.code}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{dept.name}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{dept.building || 'Main Campus'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="font-medium text-slate-800">
                    Chair: {dept.head_of_department || 'Faculty Chair'}
                  </span>
                </div>
              </div>
            </div>

            {/* Department Metric Badges */}
            <div className="mt-5 grid grid-cols-4 gap-2 text-center pt-4 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Students</span>
                <span className="font-extrabold text-indigo-700 text-sm">{dept.student_count || 0}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Faculty</span>
                <span className="font-extrabold text-emerald-700 text-sm">{dept.teacher_count || 0}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Classes</span>
                <span className="font-extrabold text-slate-800 text-sm">{dept.class_count || 0}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Courses</span>
                <span className="font-extrabold text-slate-800 text-sm">{dept.subject_count || 0}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

