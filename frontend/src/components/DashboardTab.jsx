import React from 'react';
import { 
  GraduationCap, 
  Users, 
  Building2, 
  BookOpen, 
  Award, 
  ArrowUpRight, 
  UserPlus, 
  Sparkles,
  School,
  Database,
  Eye
} from 'lucide-react';
import StatCard from './StatCard';

export default function DashboardTab({ 
  stats, 
  onSelectStudent, 
  onOpenAddStudent, 
  setActiveTab 
}) {
  const summary = stats?.summary || {
    totalStudents: 10,
    totalTeachers: 7,
    totalDepartments: 4,
    totalSubjects: 10,
    avgAttendance: 91.2
  };

  const deptDistribution = stats?.deptDistribution || [];
  const recentStudents = stats?.recentStudents || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-7 shadow-lg border border-indigo-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Academic Session 2025-2026 Active</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight leading-tight">
            Apex Institute of Technology
          </h1>
          <p className="text-sm text-indigo-100/90 mt-2 font-medium leading-relaxed">
            Integrated university management system powering students, academic departments, semester sections, and subject teachers with Docker MySQL.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onOpenAddStudent}
              className="px-4 py-2 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-indigo-700" />
              <span>Enroll New Student</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className="px-4 py-2 bg-indigo-700/60 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl border border-indigo-500/40 transition-all flex items-center space-x-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>View All Students</span>
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className="px-4 py-2 bg-indigo-700/60 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl border border-indigo-500/40 transition-all flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Faculty Directory</span>
            </button>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={summary.totalStudents}
          subtext="Enrolled across all depts"
          icon={GraduationCap}
          color="indigo"
        />
        <StatCard
          title="Total Faculty"
          value={summary.totalTeachers}
          subtext="Active teaching staff"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Departments"
          value={summary.totalDepartments}
          subtext="Engineering & Business"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Subjects / Courses"
          value={summary.totalSubjects}
          subtext="With assigned teachers"
          icon={BookOpen}
          color="amber"
        />
        <StatCard
          title="Avg Attendance"
          value={`${summary.avgAttendance}%`}
          subtext="Campus-wide compliance"
          icon={Award}
          color="rose"
        />
      </div>

      {/* Split Section: Department Breakdown & Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Department Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Departments Overview</h3>
                <p className="text-xs text-slate-500">Student enrollment distribution</p>
              </div>
              <button 
                onClick={() => setActiveTab('departments')}
                className="text-indigo-600 hover:text-indigo-700 text-xs font-bold inline-flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {deptDistribution.map((dept) => {
                const total = summary.totalStudents || 1;
                const percent = Math.round((dept.student_count / total) * 100) || 0;
                return (
                  <div key={dept.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">{dept.name} ({dept.code})</span>
                      <span className="font-bold text-indigo-700">{dept.student_count} students ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-800">Faculty Ratio: </span>
            {(summary.totalStudents / (summary.totalTeachers || 1)).toFixed(1)} students per faculty member.
          </div>
        </div>

        {/* Right: Recent Student Registrations */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Student Admissions</h3>
              <p className="text-xs text-slate-500">Recently registered students and their details</p>
            </div>
            <button 
              onClick={() => setActiveTab('students')}
              className="text-indigo-600 hover:text-indigo-700 text-xs font-bold inline-flex items-center space-x-1"
            >
              <span>View full directory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Roll No</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Class</th>
                  <th className="pb-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={st.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                          alt={st.full_name}
                          className="w-8 h-8 rounded-full object-cover shadow-sm"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{st.full_name}</p>
                          <p className="text-[10px] text-slate-400">{st.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-mono font-bold text-indigo-700">{st.roll_number}</td>
                    <td className="py-3 font-medium text-slate-700">{st.department_code}</td>
                    <td className="py-3 text-slate-600">{st.class_name}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onSelectStudent(st.id)}
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

