import React, { useState, useMemo } from 'react';
import { 
  Clock, AlertTriangle, CheckCircle2, RotateCcw, Bell, 
  Search, Filter, ArrowUpRight, Calendar, User, BookOpen 
} from 'lucide-react';
import { formatDate, getDaysDifference, getTodayStr } from '../../utils/dateUtils';
import { calculateFine } from '../../utils/fineCalculator';

export default function ActiveLoansList({ 
  loans, 
  onTriggerReturn, 
  onSendReminder, 
  settings 
}) {
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'overdue', 'returned', 'all'
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = getTodayStr();

  // Process loans with real-time fine calculation
  const processedLoans = useMemo(() => {
    return loans.map(loan => {
      if (loan.status === 'Returned') {
        return {
          ...loan,
          isOverdue: false,
          currentFine: loan.fineAmount || 0,
          overdueDays: 0
        };
      }

      const fineCalc = calculateFine(
        loan.dueDate, 
        todayStr, 
        settings?.finePerDay || 1.0, 
        settings?.gracePeriodDays || 0
      );

      return {
        ...loan,
        isOverdue: fineCalc.isOverdue,
        overdueDays: fineCalc.overdueDays,
        currentFine: fineCalc.fineAmount,
        dynamicStatus: fineCalc.isOverdue ? 'Overdue' : 'Active'
      };
    });
  }, [loans, todayStr, settings]);

  // Filtered loans
  const filteredLoans = useMemo(() => {
    return processedLoans.filter(loan => {
      // Tab filter
      if (activeTab === 'active' && loan.status === 'Returned') return false;
      if (activeTab === 'overdue' && (loan.status === 'Returned' || !loan.isOverdue)) return false;
      if (activeTab === 'returned' && loan.status !== 'Returned') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = loan.bookTitle.toLowerCase().includes(q);
        const matchMember = loan.memberName.toLowerCase().includes(q);
        const matchId = loan.id.toLowerCase().includes(q);
        const matchIsbn = loan.bookIsbn?.toLowerCase().includes(q);
        if (!matchTitle && !matchMember && !matchId && !matchIsbn) return false;
      }

      return true;
    });
  }, [processedLoans, activeTab, searchQuery]);

  const activeCount = processedLoans.filter(l => l.status !== 'Returned').length;
  const overdueCount = processedLoans.filter(l => l.status !== 'Returned' && l.isOverdue).length;
  const returnedCount = processedLoans.filter(l => l.status === 'Returned').length;

  return (
    <div className="space-y-6">
      {/* Header controls & tabs */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Circulation Desk & Loan Ledger</h2>
            <p className="text-xs text-slate-500">Track active borrowings, monitor due dates, and process book returns</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'active' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overdue' 
                  ? 'bg-rose-500 text-white shadow-sm' 
                  : 'text-rose-600 hover:text-rose-700'
              }`}
            >
              Overdue ({overdueCount})
            </button>
            <button
              onClick={() => setActiveTab('returned')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'returned' 
                  ? 'bg-white text-emerald-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Returned ({returnedCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({loans.length})
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patron name, book title, loan ID, or ISBN..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredLoans.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No circulation records found</h4>
            <p className="text-xs text-slate-500 mt-1">Try switching tabs or issuing a new book to a patron.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Book Details</th>
                  <th className="py-3.5 px-5">Borrower</th>
                  <th className="py-3.5 px-5">Loan Dates</th>
                  <th className="py-3.5 px-5">Status & Fines</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLoans.map(loan => {
                  const isReturned = loan.status === 'Returned';
                  const isOverdue = loan.isOverdue && !isReturned;

                  return (
                    <tr key={loan.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Book Details */}
                      <td className="py-4 px-5">
                        <div className="font-serif font-bold text-slate-900 leading-snug">{loan.bookTitle}</div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span className="font-mono">{loan.id}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px]">{loan.bookIsbn}</span>
                        </div>
                      </td>

                      {/* Borrower */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-800">{loan.memberName}</div>
                        <div className="text-xs text-slate-500">{loan.memberEmail}</div>
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-5 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <span className="text-slate-400">Issued:</span>
                          <span className="font-medium">{formatDate(loan.issueDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-slate-400">Due:</span>
                          <span className={`font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-800'}`}>
                            {formatDate(loan.dueDate)}
                          </span>
                        </div>
                        {isReturned && (
                          <div className="flex items-center gap-1.5 mt-1 text-emerald-600 font-medium">
                            <span>Returned:</span>
                            <span>{formatDate(loan.returnDate)}</span>
                          </div>
                        )}
                      </td>

                      {/* Status & Fines */}
                      <td className="py-4 px-5">
                        {isReturned ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Returned
                            </span>
                            {loan.fineAmount > 0 && (
                              <div className="text-xs mt-1">
                                {loan.fineWaived ? (
                                  <span className="text-amber-600 font-medium">Fine Waived</span>
                                ) : loan.finePaid ? (
                                  <span className="text-emerald-600 font-medium">
                                    {settings?.currency || '₹'}{Number(loan.fineAmount).toFixed(2)} Paid
                                  </span>
                                ) : (
                                  <span className="text-rose-600 font-medium">
                                    {settings?.currency || '₹'}{Number(loan.fineAmount).toFixed(2)} Unpaid
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ) : isOverdue ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse-subtle">
                              <AlertTriangle className="w-3.5 h-3.5" /> Overdue ({loan.overdueDays}d)
                            </span>
                            <div className="text-xs font-mono font-bold text-rose-600 mt-1">
                              Accrued Fine: {settings?.currency || '₹'}{loan.currentFine.toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <Clock className="w-3.5 h-3.5" /> On Time Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right space-x-2">
                        {!isReturned && (
                          <>
                            {isOverdue && (
                              <button
                                onClick={() => onSendReminder(loan)}
                                className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200"
                                title="Send reminder notice"
                              >
                                Remind
                              </button>
                            )}
                            <button
                              onClick={() => onTriggerReturn(loan)}
                              className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                            >
                              Return Book
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

