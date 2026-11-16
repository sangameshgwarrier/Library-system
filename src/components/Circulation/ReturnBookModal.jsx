import React, { useState, useEffect } from 'react';
import { 
  X, RotateCcw, AlertTriangle, CheckCircle2, DollarSign, 
  Calendar, FileText, ArrowRight, ShieldCheck, CreditCard 
} from 'lucide-react';
import { getTodayStr, formatDate } from '../../utils/dateUtils';
import { calculateFine } from '../../utils/fineCalculator';
import confetti from 'canvas-confetti';

export default function ReturnBookModal({ 
  isOpen, 
  onClose, 
  preselectedLoan, 
  activeLoans, 
  onConfirmReturn, 
  settings 
}) {
  const [selectedLoanId, setSelectedLoanId] = useState('');
  const [returnDate, setReturnDate] = useState(getTodayStr());
  const [paymentAction, setPaymentAction] = useState('pay'); // 'pay', 'waive', 'unpaid'
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Cash, Card, UPI/Online
  const [waiverReason, setWaiverReason] = useState('Librarian discretion');
  const [librarianNote, setLibrarianNote] = useState('');

  // Active unreturned loans
  const unreturnedLoans = activeLoans.filter(l => l.status !== 'Returned');

  useEffect(() => {
    if (preselectedLoan) {
      setSelectedLoanId(preselectedLoan.id);
    } else if (unreturnedLoans.length > 0 && !selectedLoanId) {
      setSelectedLoanId(unreturnedLoans[0].id);
    }
  }, [preselectedLoan, unreturnedLoans]);

  if (!isOpen) return null;

  const currentLoan = unreturnedLoans.find(l => l.id === selectedLoanId);

  // Compute fine based on selected loan and return date
  const fineInfo = currentLoan 
    ? calculateFine(
        currentLoan.dueDate, 
        returnDate, 
        settings?.finePerDay || 1.0, 
        settings?.gracePeriodDays || 0
      )
    : { isOverdue: false, overdueDays: 0, billableDays: 0, fineAmount: 0 };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (!currentLoan) return;

    let finePaid = false;
    let fineWaived = false;

    if (fineInfo.fineAmount > 0) {
      if (paymentAction === 'pay') {
        finePaid = true;
      } else if (paymentAction === 'waive') {
        fineWaived = true;
      }
    } else {
      finePaid = true; // no fine needed
    }

    const returnPayload = {
      loanId: currentLoan.id,
      bookId: currentLoan.bookId,
      returnDate: returnDate,
      fineAmount: fineInfo.fineAmount,
      finePaid: finePaid,
      fineWaived: fineWaived,
      paymentMethod: finePaid && fineInfo.fineAmount > 0 ? paymentMethod : null,
      waiverReason: fineWaived ? waiverReason : null,
      librarianNote: librarianNote.trim() || `Returned on ${returnDate}. ${fineInfo.isOverdue ? `Overdue by ${fineInfo.overdueDays}d.` : 'On time.'}`
    };

    // Confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    onConfirmReturn(returnPayload, currentLoan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Process Book Return</h2>
              <p className="text-xs text-slate-500">Inspect condition and assess late return fines</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {unreturnedLoans.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">All books are checked in!</h3>
            <p className="text-xs text-slate-500 mt-1">There are no outstanding active loans to return.</p>
            <button
              onClick={onClose}
              className="mt-5 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleReturnSubmit} className="p-6 space-y-5">
            {/* Select Active Loan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Active Loan / Patron *
              </label>
              <select
                value={selectedLoanId}
                onChange={(e) => setSelectedLoanId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white font-medium"
              >
                {unreturnedLoans.map(loan => (
                  <option key={loan.id} value={loan.id}>
                    {loan.bookTitle} — Borrowed by {loan.memberName} (Due: {loan.dueDate})
                  </option>
                ))}
              </select>
            </div>

            {/* Loan Overview Card */}
            {currentLoan && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 text-sm">{currentLoan.bookTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Borrower: <span className="font-semibold text-slate-700">{currentLoan.memberName}</span> ({currentLoan.memberId})</p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {currentLoan.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-400 font-medium">Issue Date:</span>
                    <p className="font-semibold text-slate-800">{formatDate(currentLoan.issueDate)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Scheduled Due Date:</span>
                    <p className="font-semibold text-slate-800">{formatDate(currentLoan.dueDate)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Return Date Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Actual Return Date *</span>
                <span className="text-slate-400 text-[11px] font-normal">Change to test past or future dates</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Live Fine Calculation Box */}
            {fineInfo.isOverdue ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-rose-950">Book is Overdue!</h4>
                      <p className="text-xs text-rose-700">
                        {fineInfo.overdueDays} day(s) late (Grace buffer: {settings?.gracePeriodDays || 0}d)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-rose-600 font-semibold block">Total Fine</span>
                    <span className="text-xl font-extrabold text-rose-950 font-mono">
                      {settings?.currency || '₹'}{fineInfo.fineAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-rose-800 bg-rose-100/60 p-2.5 rounded-xl flex items-center justify-between">
                  <span>Calculation: {fineInfo.billableDays} billable day(s) × {settings?.currency || '₹'}{Number(settings?.finePerDay || 1).toFixed(2)}/day</span>
                  <span className="font-semibold">{settings?.currency || '₹'}{fineInfo.fineAmount.toFixed(2)}</span>
                </div>

                {/* Fine Settlement Options */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-rose-950 uppercase tracking-wider mb-2">
                    Fine Settlement Action:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentAction('pay')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        paymentAction === 'pay'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-white text-rose-900 border-rose-200 hover:bg-rose-100/50'
                      }`}
                    >
                      Collect Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentAction('waive')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        paymentAction === 'waive'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Waive Fine
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentAction('unpaid')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        paymentAction === 'unpaid'
                          ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Mark Unpaid
                    </button>
                  </div>
                </div>

                {/* Conditional Sub-options */}
                {paymentAction === 'pay' && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-medium text-slate-700">Payment Mode:</span>
                    {['Cash', 'Credit Card', 'UPI / Online'].map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPaymentMethod(mode)}
                        className={`px-3 py-1 text-xs font-medium rounded-lg border ${
                          paymentMethod === mode
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                )}

                {paymentAction === 'waive' && (
                  <div className="pt-1">
                    <label className="block text-xs font-medium text-amber-900 mb-1">Reason for Waiver *</label>
                    <input
                      type="text"
                      value={waiverReason}
                      onChange={(e) => setWaiverReason(e.target.value)}
                      placeholder="e.g. Medical emergency certificate, system maintenance"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 bg-white focus:outline-none"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">Returned On Time!</h4>
                  <p className="text-xs text-emerald-700">
                    No overdue fines applicable. Book will be restored to catalog inventory.
                  </p>
                </div>
              </div>
            )}

            {/* Return Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Librarian Return Notes
              </label>
              <input
                type="text"
                value={librarianNote}
                onChange={(e) => setLibrarianNote(e.target.value)}
                placeholder="e.g. Pages intact, barcode clear, no damages observed"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 flex items-center gap-2 transition-all"
              >
                <span>Complete Return & Issue Slip</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

