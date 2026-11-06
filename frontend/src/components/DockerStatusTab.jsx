import React from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, Terminal, Server, Cpu, ShieldCheck } from 'lucide-react';

export default function DockerStatusTab({ dbHealth, onRefresh, onReseed, isReseeding }) {
  const isConnected = dbHealth?.database?.connected;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Docker MySQL Database Status</h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                isConnected 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {isConnected ? 'ONLINE & READY' : 'OFFLINE / CONNECTING'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time health telemetry of the containerized MySQL 8.0 instance and connection pool.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Health</span>
          </button>
          <button
            onClick={onReseed}
            disabled={isReseeding || !isConnected}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReseeding ? 'animate-spin' : ''}`} />
            <span>{isReseeding ? 'Reseeding...' : 'Reseed Database'}</span>
          </button>
        </div>
      </div>

      {/* Connection Diagnostics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Host & Port</span>
          <div className="text-base font-extrabold font-mono text-slate-900 mt-1">
            {dbHealth?.database?.host || '127.0.0.1'}:{dbHealth?.database?.port || '3306'}
          </div>
          <p className="text-xs text-slate-400 mt-1">Standard MySQL Docker bridge</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Database Name</span>
          <div className="text-base font-extrabold font-mono text-indigo-700 mt-1">
            {dbHealth?.database?.name || 'university_db'}
          </div>
          <p className="text-xs text-slate-400 mt-1">Active University schema</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Ping Latency</span>
          <div className="text-base font-extrabold text-emerald-600 mt-1 flex items-center space-x-1">
            <span>{dbHealth?.database?.latencyMs ?? '--'} ms</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xs text-slate-400 mt-1">Query round-trip time</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">MySQL Engine</span>
          <div className="text-base font-extrabold text-slate-900 mt-1">
            {dbHealth?.database?.version || 'MySQL 8.0.x Community'}
          </div>
          <p className="text-xs text-slate-400 mt-1">InnoDB ACID compliant</p>
        </div>
      </div>

      {/* Docker Terminal Commands Guide */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-3 text-indigo-400">
          <Terminal className="w-5 h-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Docker CLI Reference Commands</h3>
        </div>

        <p className="text-xs text-slate-300">
          Useful commands to inspect, manage, and interact with the university database container directly from your terminal:
        </p>

        <div className="space-y-2 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-emerald-400">docker-compose up -d mysql-db</span>
            <span className="text-slate-500 text-[11px]"># Start MySQL in background</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-emerald-400">docker ps --filter "name=university-mysql"</span>
            <span className="text-slate-500 text-[11px]"># Check container status</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-emerald-400">docker exec -it university-mysql mysql -u uni_user -puni_password_123 university_db</span>
            <span className="text-slate-500 text-[11px]"># Interactive MySQL CLI</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-emerald-400">docker-compose down</span>
            <span className="text-slate-500 text-[11px]"># Stop and remove containers</span>
          </div>
        </div>
      </div>

    </div>
  );
}

