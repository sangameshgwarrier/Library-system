import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Download, BookOpen } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export default function ReturnReceiptModal({ receiptData, onClose, settings }) {
  if (!receiptData) return null;

  const { loan, returnDate, fineAmount, finePaid, fineWaived, paymentMethod, waiverReason } = receiptData;
  const currency = settings?.currency || '₹';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        {/* Modal Top Control Bar (hidden in print) */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between no-print bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Return Receipt Generated</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div className="p-8 print:p-4 text-slate-800 space-y-6 bg-white font-sans" id="printable-receipt">
          {/* Header */}
          <div className="text-center border-b border-slate-200 pb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 mb-2">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-serif font-extrabold text-slate-900 tracking-tight">
              {settings?.libraryName || 'Athena Central Library'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Circulation Desk • Official Book Return Slip</p>
            <p className="text-[11px] font-mono text-slate-400 mt-1">Receipt ID: RCP-{Date.now().toString().slice(-8)}</p>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Patron Name:</span>
              <span className="font-bold text-slate-900">{loan.memberName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Patron ID / Email:</span>
              <span className="font-mono text-slate-700">{loan.memberId} ({loan.memberEmail})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Book Title:</span>
              <span className="font-serif font-bold text-slate-900 text-right max-w-[240px] truncate">
                {loan.bookTitle}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">ISBN:</span>
              <span className="font-mono text-slate-700">{loan.bookIsbn}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Issue Date:</span>
              <span className="text-slate-800">{formatDate(loan.issueDate)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Scheduled Due Date:</span>
              <span className="text-slate-800">{formatDate(loan.dueDate)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 bg-emerald-50/50 px-2 rounded">
              <span className="text-slate-700 font-bold">Actual Return Date:</span>
              <span className="font-bold text-emerald-700">{formatDate(returnDate)}</span>
            </div>
          </div>

          {/* Fine Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-600 font-medium">Calculated Late Fine:</span>
              <span className="font-mono font-bold text-slate-900">
                {currency}{Number(fineAmount || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-800">Status:</span>
              {fineAmount > 0 ? (
                fineWaived ? (
                  <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Waived ({waiverReason || 'Discretion'})
                  </span>
                ) : finePaid ? (
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    PAID ({paymentMethod || 'Cash'})
                  </span>
                ) : (
                  <span className="font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    UNPAID / OUTSTANDING
                  </span>
                )
              ) : (
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  RETURNED ON TIME • NO FINE
                </span>
              )}
            </div>
          </div>

          {/* Signatures & Footer */}
          <div className="pt-6 border-t border-dashed border-slate-200 flex items-end justify-between text-xs">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Processed By</p>
              <p className="font-semibold text-slate-800">{settings?.librarianName || 'Circulation Desk Staff'}</p>
            </div>

            <div className="text-right">
              <div className="h-8 border-b border-slate-300 w-32 mb-1" />
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Patron Signature</p>
            </div>
          </div>

          <p className="text-[10px] text-center text-slate-400 italic">
            Thank you for using {settings?.libraryName}. Please keep this slip for your records.
          </p>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end no-print">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

