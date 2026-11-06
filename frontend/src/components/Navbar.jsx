import React from 'react';
import { 
  GraduationCap, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function Navbar({ 
  dbHealth, 
  onRefreshHealth, 
  onReseed, 
  isReseeding,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab
}) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & University Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg">Apex University</span>
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200/60 uppercase tracking-wider">
                  Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Academic Management System</p>
            </div>
          </div>

          {/* Search bar (active in Students tab or directs to it) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students, roll numbers, or faculty..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'students') {
                    setActiveTab('students');
                  }
                }}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-150"
              />
            </div>
          </div>

          {/* Right Action & Docker DB Status Pill */}
          <div className="flex items-center space-x-3">
            {/* Database Connection Pill */}
            <div 
              onClick={() => setActiveTab('docker')}
              className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-2 border transition-all ${
                dbHealth?.database?.connected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
              }`}
              title="Click to view Docker DB status"
            >
              <span className="relative flex h-2 w-2">
                {dbHealth?.database?.connected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  dbHealth?.database?.connected ? 'bg-emerald-500' : 'bg-rose-500'
                }`}></span>
              </span>
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {dbHealth?.database?.connected ? `Docker MySQL (${dbHealth.database.latencyMs}ms)` : 'DB Disconnected'}
              </span>
            </div>

            {/* Reseed / Reset Data Button */}
            <button
              onClick={onReseed}
              disabled={isReseeding}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Reset & Seed Sample Data"
            >
              <RefreshCw className={`w-4 h-4 ${isReseeding ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            {/* Profile Avatar Badge */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-indigo-500/30">
                AU
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-none">Registrar Office</p>
                <p className="text-[10px] text-slate-500 leading-tight">Admin Portal</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}

