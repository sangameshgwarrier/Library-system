import React, { useState, useEffect } from 'react';
import { X, BookOpen, User, Calendar, CheckCircle, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { getTodayStr, addDays, formatDate } from '../../utils/dateUtils';

export default function IssueBookModal({ 
  isOpen, 
  onClose, 
  preselectedBook, 
  books, 
  members, 
  activeLoans, 
  onConfirmIssue, 
  settings 
}) {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [issueDate, setIssueDate] = useState(getTodayStr());
  const [loanPeriodDays, setLoanPeriodDays] = useState(settings?.loanDurationDays || 14);
  const [customDueDate, setCustomDueDate] = useState('');
  const [isCustomDue, setIsCustomDue] = useState(false);
  const [librarianNote, setLibrarianNote] = useState('');

  // Sync preselected book
  useEffect(() => {
    if (preselectedBook) {
      setSelectedBookId(preselectedBook.id);
    } else if (books.length > 0 && !selectedBookId) {
      const firstAvailable = books.find(b => b.availableCopies > 0);
      if (firstAvailable) setSelectedBookId(firstAvailable.id);
    }
  }, [preselectedBook, books]);

  // Set default member if not chosen
  useEffect(() => {
    if (members.length > 0 && !selectedMemberId) {
      setSelectedMemberId(members[0].id);
    }
  }, [members]);

  // Compute calculated due date
  const calculatedDueDate = isCustomDue && customDueDate 
    ? customDueDate 
    : addDays(issueDate, Number(loanPeriodDays));

  if (!isOpen) return null;

  const currentBook = books.find(b => b.id === selectedBookId);
  const currentMember = members.find(m => m.id === selectedMemberId);

  // Check member current active loans
  const memberActiveLoans = activeLoans.filter(
    l => l.memberId === selectedMemberId && l.status !== 'Returned'
  );
  const memberOverdueLoans = memberActiveLoans.filter(l => l.status === 'Overdue');
  const isMemberAtQuota = memberActiveLoans.length >= (settings?.maxBooksPerMember || 5);
  const isBookUnavailable = !currentBook || currentBook.availableCopies <= 0;

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!currentBook || !currentMember) return;
    if (isBookUnavailable) return;

    const newLoan = {
      id: `LN-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      bookId: currentBook.id,
      bookTitle: currentBook.title,
      bookIsbn: currentBook.isbn,
      memberId: currentMember.id,
      memberName: currentMember.name,
      memberEmail: currentMember.email,
      issueDate: issueDate,
      dueDate: calculatedDueDate,
      returnDate: null,
      status: 'Active',
      fineAmount: 0,
      finePaid: false,
      fineWaived: false,
      waiverReason: '',
      librarianNote: librarianNote.trim() || 'Issued at circulation desk'
    };

    onConfirmIssue(newLoan, currentBook.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Issue Book to Patron</h2>
              <p className="text-xs text-slate-500">Record loan checkout and loan period</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleIssueSubmit} className="p-6 space-y-5">
          {/* Book Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Select Book from Catalog *</span>
              {currentBook && (
                <span className={`text-xs font-semibold ${isBookUnavailable ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {currentBook.availableCopies} of {currentBook.totalCopies} available
                </span>
              )}
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              {books.map(b => (
                <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                  {b.title} ({b.author}) - {b.availableCopies > 0 ? `${b.availableCopies} available` : 'OUT OF STOCK'}
                </option>
              ))}
            </select>
            {isBookUnavailable && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> No copies currently in stock for this title.
              </p>
            )}
          </div>

          {/* Member Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Select Member / Patron *</span>
              {currentMember && (
                <span className="text-xs text-slate-500">
                  {memberActiveLoans.length} books borrowed (Max {settings?.maxBooksPerMember || 5})
                </span>
              )}
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              {members.map(m => {
                const count = activeLoans.filter(l => l.memberId === m.id && l.status !== 'Returned').length;
                return (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.id} - {m.category}) - {count} active loans
                  </option>
                );
              })}
            </select>

            {/* Member Warnings */}
            {memberOverdueLoans.length > 0 && (
              <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Notice: This patron has {memberOverdueLoans.length} overdue item(s) pending return!</span>
              </div>
            )}
            {isMemberAtQuota && (
              <div className="mt-2 p-3 bg-rose-50 rounded-xl border border-rose-200 flex items-center gap-2 text-xs text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Patron has reached the maximum borrowing limit ({settings?.maxBooksPerMember || 5} books).</span>
              </div>
            )}
          </div>

          {/* Dates & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Issue Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Loan Duration
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[7, 14, 21, 30].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => { setLoanPeriodDays(days); setIsCustomDue(false); }}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      !isCustomDue && loanPeriodDays === days
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Due Date Display Card */}
          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">Scheduled Return Due Date</span>
                <p className="text-base font-bold text-indigo-950 font-serif">
                  {formatDate(calculatedDueDate)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Fine policy applies</span>
              <p className="text-xs font-semibold text-slate-700">
                {settings?.currency || '₹'}{settings?.finePerDay || '10.00'}/day overdue
              </p>
            </div>
          </div>

          {/* Librarian Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Librarian Checkout Notes (Optional)
            </label>
            <input
              type="text"
              value={librarianNote}
              onChange={(e) => setLibrarianNote(e.target.value)}
              placeholder="e.g. Standard 14-day checkout, clean condition"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
              disabled={isBookUnavailable || isMemberAtQuota}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition-all ${
                isBookUnavailable || isMemberAtQuota
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
              }`}
            >
              <span>Confirm & Issue Book</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

