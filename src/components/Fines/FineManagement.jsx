import React, { useState, useMemo } from 'react';
import { 
  DollarSign, AlertTriangle, CheckCircle2, ShieldCheck, 
  Search, ArrowRight, User, BookOpen, Clock, X, CreditCard 
} from 'lucide-react';
import { formatDate, getTodayStr } from '../../utils/dateUtils';
import { calculateFine } from '../../utils/fineCalculator';

export default function FineManagement({ 
  loans, 
  onSettleFine, 
  settings 
}) {
  const [filterType, setFilterType] = useState('all'); // all, active-overdue, unpaid, collected, waived
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLoanForSettlement, setSelectedLoanForSettlement] = useState(null);
  const [settleAction, setSettleAction] = useState('pay'); // pay, waive
  const [settleMethod, setSettleMethod] = useState('Cash');
  const [waiverReason, setWaiverReason] = useState('Medical emergency');

  const todayStr = getTodayStr();
  const currency = settings?.currency || '₹';

  // Process loans with live fines
  const enrichedLoans = useMemo(() => {
    return loans.map(loan => {
      if (loan.status === 'Returned') {
        return {
          ...loan,
          isLiveOverdue: false,
          effectiveFine: Number(loan.fineAmount || 0),
          category: loan.fineWaived ? 'waived' : (loan.finePaid ? 'collected' : 'unpaid')
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
        isLiveOverdue: fineCalc.isOverdue,
        overdueDays: fineCalc.overdueDays,
        effectiveFine: fineCalc.fineAmount,
        category: fineCalc.isOverdue ? 'active-overdue' : 'none'
      };
    });
  }, [loans, todayStr, settings]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    let collected = 0;
    let unpaid = 0;
    let waived = 0;
    let activeAccruing = 0;
    let activeOverdueCount = 0;

    enrichedLoans.forEach(l => {
      if (l.status === 'Returned') {
        if (l.fineWaived) waived += l.effectiveFine;
        else if (l.finePaid) collected += l.effectiveFine;
        else unpaid += l.effectiveFine;
      } else if (l.isLiveOverdue) {
        activeAccruing += l.effectiveFine;
        activeOverdueCount += 1;
      }
    });

    return {
      collected,
      unpaid,
      waived,
      activeAccruing,
      activeOverdueCount
    };
  }, [enrichedLoans]);

  // Filtered rows
  const displayLoans = useMemo(() => {
    return enrichedLoans.filter(l => {
      // Must have had some fine or be currently overdue
      if (l.effectiveFine <= 0 && !l.isLiveOverdue) return false;

      if (filterType === 'active-overdue' && !l.isLiveOverdue) return false;
      if (filterType === 'unpaid' && (l.category !== 'unpaid' && !l.isLiveOverdue)) return false;
      if (filterType === 'collected' && l.category !== 'collected') return false;
      if (filterType === 'waived' && l.category !== 'waived') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mTitle = l.bookTitle.toLowerCase().includes(q);
        const mBorrower = l.memberName.toLowerCase().includes(q);
        const mId = l.id.toLowerCase().includes(q);
        if (!mTitle && !mBorrower && !mId) return false;
      }

      return true;
    });
  }, [enrichedLoans, filterType, searchQuery]);

  const handleSettleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLoanForSettlement) return;

    onSettleFine({
      loanId: selectedLoanForSettlement.id,
      action: settleAction, // 'pay' or 'waive'
      method: settleMethod,
      reason: waiverReason,
      amount: selectedLoanForSettlement.effectiveFine
    });

    setSelectedLoanForSettlement(null);
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fines Collected</span>
            <h3 className="text-2xl font-mono font-extrabold text-emerald-600 mt-1">
              {currency}{metrics.collected.toFixed(2)}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Settled & deposited</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Currently Accruing on Overdue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accruing On Overdue</span>
            <h3 className="text-2xl font-mono font-extrabold text-rose-600 mt-1">
              {currency}{metrics.activeAccruing.toFixed(2)}
            </h3>
            <p className="text-[11px] text-rose-500 font-medium mt-1">{metrics.activeOverdueCount} active overdue loans</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Unpaid / Outstanding */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unpaid / In Arrears</span>
            <h3 className="text-2xl font-mono font-extrabold text-amber-600 mt-1">
              {currency}{metrics.unpaid.toFixed(2)}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Returned but uncollected</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Waived Fines */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Waived</span>
            <h3 className="text-2xl font-mono font-extrabold text-slate-700 mt-1">
              {currency}{metrics.waived.toFixed(2)}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Librarian authorized waivers</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            All Fines ({enrichedLoans.filter(l => l.effectiveFine > 0).length})
          </button>
          <button
            onClick={() => setFilterType('active-overdue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'active-overdue' ? 'bg-rose-500 text-white shadow-sm' : 'text-rose-600'
            }`}
          >
            Active Overdue ({metrics.activeOverdueCount})
          </button>
          <button
            onClick={() => setFilterType('collected')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'collected' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Collected
          </button>
          <button
            onClick={() => setFilterType('waived')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'waived' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Waived
          </button>
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patron or title..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Fines Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {displayLoans.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No overdue fines match your filter</h4>
            <p className="text-xs text-slate-500 mt-1">All patron accounts in this view are clear of fines.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Patron</th>
                  <th className="py-3.5 px-5">Book / Loan</th>
                  <th className="py-3.5 px-5">Due Date & Overdue</th>
                  <th className="py-3.5 px-5">Fine Amount</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayLoans.map(loan => (
                  <tr key={loan.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Patron */}
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-900">{loan.memberName}</div>
                      <div className="text-xs text-slate-500">{loan.memberEmail}</div>
                    </td>

                    {/* Book */}
                    <td className="py-4 px-5">
                      <div className="font-serif font-bold text-slate-900 leading-snug">{loan.bookTitle}</div>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">{loan.id}</div>
                    </td>

                    {/* Due Date & Overdue */}
                    <td className="py-4 px-5 text-xs">
                      <div className="text-slate-600">Due: <span className="font-semibold">{formatDate(loan.dueDate)}</span></div>
                      {loan.isLiveOverdue && (
                        <div className="text-rose-600 font-bold mt-0.5">
                          {loan.overdueDays} day(s) overdue
                        </div>
                      )}
                      {loan.returnDate && (
                        <div className="text-slate-400 mt-0.5">
                          Returned: {formatDate(loan.returnDate)}
                        </div>
                      )}
                    </td>

                    {/* Fine Amount */}
                    <td className="py-4 px-5">
                      <div className="font-mono font-extrabold text-base text-slate-900">
                        {currency}{loan.effectiveFine.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        @{currency}{settings?.finePerDay || 1.0}/day
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      {loan.isLiveOverdue ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Accruing (Active)
                        </span>
                      ) : loan.fineWaived ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Waived
                          </span>
                          <p className="text-[10px] text-slate-500 mt-0.5 max-w-[120px] truncate" title={loan.waiverReason}>
                            {loan.waiverReason || 'Discretion'}
                          </p>
                        </div>
                      ) : loan.finePaid ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Collected
                          </span>
                          <p className="text-[10px] text-slate-500 mt-0.5">{loan.paymentMethod || 'Cash'}</p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          Unpaid Arrears
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      {(!loan.finePaid && !loan.fineWaived) ? (
                        <button
                          onClick={() => setSelectedLoanForSettlement(loan)}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
                        >
                          Settle Fine
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Settle Fine Modal */}
      {selectedLoanForSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Settle Patron Fine</h3>
              <button onClick={() => setSelectedLoanForSettlement(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800">{selectedLoanForSettlement.memberName}</p>
              <p className="text-slate-500">{selectedLoanForSettlement.bookTitle}</p>
              <p className="font-mono font-bold text-rose-600 text-sm pt-1">
                Amount Due: {currency}{selectedLoanForSettlement.effectiveFine.toFixed(2)}
              </p>
            </div>

            <form onSubmit={handleSettleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSettleAction('pay')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    settleAction === 'pay' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Collect Payment
                </button>
                <button
                  type="button"
                  onClick={() => setSettleAction('waive')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    settleAction === 'waive' ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Authorize Waiver
                </button>
              </div>

              {settleAction === 'pay' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={settleMethod}
                    onChange={(e) => setSettleMethod(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="UPI / Online">UPI / Online Transfer</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Waiver</label>
                  <input
                    type="text"
                    required
                    value={waiverReason}
                    onChange={(e) => setWaiverReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    placeholder="e.g. Medical emergency certificate, system glitch"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLoanForSettlement(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                >
                  Confirm Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

