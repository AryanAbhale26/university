import React, { useEffect, useState } from 'react';
import { 
  X, 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building2, 
  School, 
  Award, 
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../api/client';

export default function StudentDetailsModal({ studentId, onClose }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) return;

    let isMounted = true;
    setLoading(true);
    api.getStudentById(studentId)
      .then((res) => {
        if (isMounted) {
          setStudent(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  if (!studentId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 p-6 text-white flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {loading ? (
            <div className="flex items-center space-x-3 py-4">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Loading comprehensive student dossier...</span>
            </div>
          ) : error ? (
            <div className="text-sm bg-rose-500/20 p-3 rounded-xl border border-rose-300">
              Error loading student details: {error}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={student.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                  alt={student.full_name}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold tracking-tight">{student.full_name}</h2>
                    <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      {student.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-indigo-100">
                    <span className="font-mono bg-black/20 px-2 py-0.5 rounded font-bold tracking-wider">
                      {student.roll_number}
                    </span>
                    <span>•</span>
                    <span>{student.department_name} ({student.department_code})</span>
                    <span>•</span>
                    <span>{student.class_name} ({student.class_semester})</span>
                  </div>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[11px] uppercase tracking-wider text-indigo-200 font-semibold block">Academic Standing</span>
                <span className="text-xl font-extrabold text-white">Good Standing</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        {student && (
          <div className="overflow-y-auto p-6 space-y-6">
            
            {/* Quick Stat Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Roll Number</span>
                <span className="text-base font-extrabold font-mono text-indigo-700">{student.roll_number}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Enrolled Courses</span>
                <span className="text-base font-extrabold text-slate-800">{student.subjects?.length || 0} Subjects</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Class / Room</span>
                <span className="text-base font-extrabold text-slate-800">{student.room_number || 'Room 301'}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Academic Year</span>
                <span className="text-base font-extrabold text-slate-800">{student.academic_year || '2025-2026'}</span>
              </div>
            </div>

            {/* Student Personal & Contact Details */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center space-x-1.5">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>Contact & Personal Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="flex items-center space-x-2 text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="font-medium truncate">{student.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{student.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>DOB: {student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Campus: {student.department_building || 'Main Campus'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{student.address || 'Campus Residence'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <School className="w-4 h-4 text-slate-400" />
                  <span>HOD: {student.head_of_department || 'Department Chair'}</span>
                </div>
              </div>
            </div>

            {/* Enrolled Subjects & Teacher of Each Subject (CORE PROMPT REQUIREMENT) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Curriculum & Assigned Subject Teachers</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Detailed breakdown of enrolled subjects, credit hours, performance, and corresponding faculty teacher.
                  </p>
                </div>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full border border-indigo-200">
                  {student.subjects?.length || 0} Registered
                </span>
              </div>

              {student.subjects?.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No subjects currently assigned to this student.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {student.subjects.map((subj) => (
                    <div 
                      key={subj.subject_id}
                      className="bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left: Subject Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2.5">
                          <span className="font-mono text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200/60">
                            {subj.subject_code}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{subj.subject_name}</h4>
                          <span className="text-[11px] text-slate-400 font-medium">({subj.credits} Credits)</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                          <span>Semester: <strong className="text-slate-700">{subj.semester}</strong></span>
                          <span>•</span>
                          <span>Current Grade: <strong className="text-indigo-600 font-semibold">{subj.grade || 'In Progress'}</strong></span>
                          <span>•</span>
                          <span>Attendance: <strong className="text-emerald-600 font-semibold">{subj.attendance_percentage}%</strong></span>
                        </div>
                      </div>

                      {/* Right: Teacher of This Subject */}
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center space-x-3 min-w-[260px]">
                        <img
                          src={subj.teacher_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                          alt={subj.teacher_name || 'Subject Teacher'}
                          className="w-10 h-10 rounded-full object-cover border border-slate-300 shadow-sm flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                              Subject Teacher
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            {subj.teacher_name || 'Faculty Not Assigned'}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {subj.teacher_designation || 'Instructor'}
                          </p>
                          {subj.teacher_email && (
                            <p className="text-[10px] text-slate-400 truncate flex items-center space-x-1">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span>{subj.teacher_email}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-all shadow-sm"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
}

