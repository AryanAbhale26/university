import React, { useState } from 'react';
import { Users, Mail, Phone, BookOpen, GraduationCap, Building2, UserPlus, Trash2 } from 'lucide-react';
import AddTeacherModal from './AddTeacherModal';

export default function TeachersTab({ teachers, departments, loading, onRefresh, onDeleteTeacher }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');

  const filteredTeachers = selectedDept 
    ? teachers.filter(t => t.department_id == selectedDept)
    : teachers;

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Faculty & Teachers</h2>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              {teachers.length} Faculty Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic professors, subject instructors, and designated department faculty.
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
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Faculty</span>
          </button>
        </div>
      </div>

      {/* Teachers Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500 font-medium">Loading faculty members...</p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No faculty found</h3>
          <p className="text-xs text-slate-400 mt-1">Try selecting another department or add a new faculty member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={teacher.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt={teacher.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{teacher.name}</h4>
                      <p className="text-xs text-emerald-700 font-semibold">{teacher.designation}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{teacher.qualification}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTeacher(teacher.id, teacher.name)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove Teacher"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Contact info */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800">{teacher.department_name} ({teacher.department_code})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  {teacher.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{teacher.phone}</span>
                    </div>
                  )}
                </div>

                {/* Subjects taught by this teacher */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-700 flex items-center space-x-1">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Subjects Taught ({teacher.subjects_taught?.length || 0})</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.subjects_taught && teacher.subjects_taught.length > 0 ? (
                      teacher.subjects_taught.map((subjStr, i) => (
                        <span 
                          key={i}
                          className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] px-2.5 py-1 rounded-lg font-medium"
                        >
                          {subjStr}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No assigned courses currently</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Faculty ID: #{teacher.id}</span>
                <span>Active Instructor</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Teacher Modal */}
      <AddTeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTeacherAdded={onRefresh}
        departments={departments}
      />

    </div>
  );
}

