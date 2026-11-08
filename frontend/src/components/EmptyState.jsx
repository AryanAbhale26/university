import React from 'react';
import { FolderSearch } from 'lucide-react';

export default function EmptyState({ title = 'No records found', description = 'Try adjusting your search criteria or add new entries.', icon: Icon = FolderSearch, actionButton = null }) {
  return (
    <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200">
      <Icon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
      <h3 className="text-sm font-bold text-slate-700">{title}</h3>
      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">{description}</p>
      {actionButton && <div className="mt-4">{actionButton}</div>}
    </div>
  );
}
