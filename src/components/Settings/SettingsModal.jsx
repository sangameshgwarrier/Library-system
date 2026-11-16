import React, { useState } from 'react';
import { X, Settings, RotateCcw, Save, ShieldAlert, Sparkles } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings, onResetDemoData }) {
  const [formData, setFormData] = useState({
    finePerDay: settings?.finePerDay || 10.0,
    gracePeriodDays: settings?.gracePeriodDays || 1,
    loanDurationDays: settings?.loanDurationDays || 14,
    currency: settings?.currency || '₹',
    libraryName: settings?.libraryName || 'Athena Central Library',
    librarianName: settings?.librarianName || 'Dr. Sunita Sharma, MLS',
    maxBooksPerMember: settings?.maxBooksPerMember || 5
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({
      ...formData,
      finePerDay: Number(formData.finePerDay),
      gracePeriodDays: Number(formData.gracePeriodDays),
      loanDurationDays: Number(formData.loanDurationDays),
      maxBooksPerMember: Number(formData.maxBooksPerMember)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Library Circulation Rules</h2>
              <p className="text-xs text-slate-500">Configure fine rates, loan periods, and library identity</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Library Identity */}
          <div className="space-y-3 pb-4 border-b border-slate-100">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Library Branding</h4>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Library Name</label>
              <input
                type="text"
                value={formData.libraryName}
                onChange={(e) => setFormData({ ...formData, libraryName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chief Librarian / Registrar Name</label>
              <input
                type="text"
                value={formData.librarianName}
                onChange={(e) => setFormData({ ...formData, librarianName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Fine & Currency Policy */}
          <div className="space-y-3 pb-4 border-b border-slate-100">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Fine & Overdue Policies</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Currency Symbol</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="$">$ (USD / CAD / AUD)</option>
                  <option value="₹">₹ (INR / Rupee)</option>
                  <option value="€">€ (EUR / Euro)</option>
                  <option value="£">£ (GBP / Pound)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fine Per Overdue Day</label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={formData.finePerDay}
                  onChange={(e) => setFormData({ ...formData, finePerDay: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Grace Period (Days)</label>
                <input
                  type="number"
                  min="0"
                  max="14"
                  value={formData.gracePeriodDays}
                  onChange={(e) => setFormData({ ...formData, gracePeriodDays: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <span className="text-[10px] text-slate-400">Buffer days before fines accrue</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Standard Loan Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formData.loanDurationDays}
                  onChange={(e) => setFormData({ ...formData, loanDurationDays: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <span className="text-[10px] text-slate-400">Default checkout period</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Books Allowed Per Patron</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.maxBooksPerMember}
                onChange={(e) => setFormData({ ...formData, maxBooksPerMember: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Demo Reset Danger Area */}
          <div className="pt-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">Demo Database Control</h4>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div>
                <p className="font-semibold text-amber-900 text-xs">Reset All Data to Factory Demo</p>
                <p className="text-[11px] text-amber-700">Restores original books, overdue loans, and patrons.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all catalog books, loans, and reports to default demo state?')) {
                    onResetDemoData();
                    onClose();
                  }
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
              >
                Reset Demo
              </button>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

