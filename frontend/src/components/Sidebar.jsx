import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  School, 
  Building2, 
  BookOpen, 
  Database,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, counts }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students Directory', icon: GraduationCap, count: counts?.students },
    { id: 'teachers', label: 'Faculty & Teachers', icon: Users, count: counts?.teachers },
    { id: 'classes', label: 'Classes & Sections', icon: School, count: counts?.classes },
    { id: 'departments', label: 'Departments', icon: Building2, count: counts?.departments },
    { id: 'subjects', label: 'Subjects / Courses', icon: BookOpen, count: counts?.subjects },
    { id: 'docker', label: 'Docker DB Status', icon: Database, badge: 'MySQL 8.0' }
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-20 space-y-6">
        
        {/* Navigation list */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm space-y-1">
          <p className="px-3 py-2 text-[11px] font-bold tracking-wider uppercase text-slate-400">
            University Management
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count !== null && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* System & Architecture Quick Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-4 text-white shadow-md border border-slate-800">
          <div className="flex items-center space-x-2 text-indigo-400 mb-2">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Stack Overview</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Frontend:</span>
              <span className="font-semibold text-white">React + Vite + Tailwind</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Backend:</span>
              <span className="font-semibold text-white">Node.js Express API</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Database:</span>
              <span className="font-semibold text-emerald-400">Docker MySQL 8.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Container:</span>
              <span className="font-mono text-[11px] text-slate-300">university-mysql</span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}

