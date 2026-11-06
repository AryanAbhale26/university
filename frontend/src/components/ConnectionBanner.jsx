import React from 'react';
import { AlertCircle, Terminal, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ConnectionBanner({ dbHealth, onRetry, isRetrying }) {
  if (dbHealth?.database?.connected) {
    return null; // Don't show warning banner if healthy
  }

  return (
    <div className="mb-6 rounded-2xl bg-amber-50/80 border border-amber-200 p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900">
              Docker MySQL Connection Pending
            </h4>
            <p className="text-xs text-amber-700 mt-0.5">
              The backend is attempting to connect to MySQL on <code className="font-mono font-semibold">127.0.0.1:3306</code>.
              Make sure the Docker container is running:
            </p>
            <div className="mt-2 inline-flex items-center space-x-2 bg-slate-900 text-slate-100 font-mono text-xs px-3 py-1.5 rounded-lg">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>docker-compose up -d mysql-db</span>
            </div>
          </div>
        </div>

        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="self-end sm:self-center inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Checking...' : 'Retry Connection'}</span>
        </button>
      </div>
    </div>
  );
}

