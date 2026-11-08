import React from 'react';

export default function Badge({ children, variant = 'indigo', size = 'sm' }) {
  const variants = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/60',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/60',
    slate: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1'
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${variants[variant] || variants.indigo} ${sizes[size] || sizes.sm}`}>
      {children}
    </span>
  );
}
