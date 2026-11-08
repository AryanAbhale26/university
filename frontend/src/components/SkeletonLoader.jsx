import React from 'react';

export default function SkeletonLoader({ rows = 4 }) {
  return (
    <div className="space-y-3 p-4 bg-white rounded-2xl border border-slate-200 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
            <div className="h-2 bg-slate-100 rounded w-1/2"></div>
          </div>
          <div className="h-6 bg-slate-100 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
}
