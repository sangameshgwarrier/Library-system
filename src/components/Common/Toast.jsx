import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  const bgStyles = {
    success: 'bg-white border-emerald-200 text-slate-800 shadow-emerald-100',
    warning: 'bg-white border-amber-200 text-slate-800 shadow-amber-100',
    error: 'bg-white border-rose-200 text-slate-800 shadow-rose-100',
    info: 'bg-white border-blue-200 text-slate-800 shadow-blue-100'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md w-full px-4">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bgStyles[toast.type || 'info']}`}>
        {icons[toast.type || 'info']}
        <div className="flex-1 pr-2">
          {toast.title && <h4 className="font-semibold text-sm mb-0.5">{toast.title}</h4>}
          <p className="text-sm text-slate-600">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-1 -mt-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

