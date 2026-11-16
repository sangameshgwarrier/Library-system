import React, { useState, useMemo } from 'react';
import { 
  Calendar, Printer, Download, BookOpen, RotateCcw, 
  DollarSign, AlertTriangle, CheckCircle2, User, FileText, 
  ArrowUpRight, Clock, ShieldCheck, Mail
} from 'lucide-react';
import { formatDate, getTodayStr, addDays, isSameDay } from '../../utils/dateUtils';
import { calculateFine } from '../../utils/fineCalculator';
import { exportDailyReportCSV } from '../../utils/exportUtils';

export default function DailyReport({ loans, books, members, settings, onSendReminder }) {
  const [selectedDate, setSelectedDate] = useState(getTodayStr());

  const todayStr = getTodayStr();
  const currency = settings?.currency || '₹';

  // Issues on selected date
  const issuesOnDate = useMemo(() => {
    return loans.filter(l => isSameDay(l.issueDate, selectedDate));
  }, [loans, selectedDate]);

  // Returns on selected date
  const returnsOnDate = useMemo(() => {
    return loans.filter(l => l.returnDate && isSameDay(l.returnDate, selectedDate));
  }, [loans, selectedDate]);

  // Fines collected on selected date
  const finesCollectedOnDate = useMemo(() => {
    return returnsOnDate.reduce((sum, l) => {
      if (l.finePaid && !l.fineWaived && l.fineAmount > 0) {
        return sum + Number(l.fineAmount);
      }
      return sum;
    }, 0);
  }, [returnsOnDate]);

  // Fines waived on selected date
  const finesWaivedOnDate = useMemo(() => {
    return returnsOnDate.reduce((sum, l) => {
      if (l.fineWaived && l.fineAmount > 0) {
        return sum + Number(l.fineAmount);
      }
      return sum;
    }, 0);
  }, [returnsOnDate]);

  // Current system-wide overdue loans needing follow-up
  const activeOverdueList = useMemo(() => {
    return loans
      .filter(l => l.status !== 'Returned')
      .map(l => {
        const calc = calculateFine(l.dueDate, todayStr, settings?.finePerDay || 1.0, settings?.gracePeriodDays || 0);
        return {
          ...l,
          isOverdue: calc.isOverdue,
          overdueDays: calc.overdueDays,
          currentFine: calc.fineAmount
        };
      })
      .filter(l => l.isOverdue);
  }, [loans, todayStr, settings]);

  const totalOutstandingFines = useMemo(() => {
    return activeOverdueList.reduce((sum, l) => sum + (l.currentFine || 0), 0);
  }, [activeOverdueList]);

  // Summary Metrics Object
  const metrics = {
    issuedTodayCount: issuesOnDate.length,
    returnedTodayCount: returnsOnDate.length,
    finesCollectedToday: finesCollectedOnDate,
    finesWaivedToday: finesWaivedOnDate,
    activeOverdueCount: activeOverdueList.length,
    totalOutstandingFines: totalOutstandingFines
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportDailyReportCSV(
      selectedDate,
      metrics,
      issuesOnDate,
      returnsOnDate,
      activeOverdueList,
      currency
    );
  };

  return (
    <div className="space-y-6">
      {/* Control & Date Selection Bar (Hidden in print) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Circulation Analytics & Audit</span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">Librarian Daily Operations Report</h2>
          <p className="text-xs text-slate-500">Official log of daily checkouts, returns, collected fines, and overdue warnings</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick date presets */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedDate(todayStr)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedDate === todayStr ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDate(addDays(todayStr, -1))}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedDate === addDays(todayStr, -1) ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yesterday
            </button>
          </div>

          {/* Date Picker Input */}
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-semibold text-slate-800 bg-white"
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Print Report */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-100"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Official Header for Print & Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <h1 className="text-2xl font-serif font-extrabold text-slate-900">
                {settings?.libraryName || 'Athena Central Library'}
              </h1>
            </div>
            <p className="text-xs text-slate-500">Official Daily Circulation & Fine Assessment Ledger</p>
          </div>

          <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Report For Date</span>
            <span className="text-lg font-serif font-bold text-indigo-950 block">{formatDate(selectedDate)}</span>
            <span className="text-[11px] text-slate-400">Generated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Books Issued */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Books Issued</span>
              <BookOpen className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-3xl font-mono font-extrabold text-indigo-950 mt-2">
              {issuesOnDate.length}
            </div>
            <p className="text-[11px] text-indigo-600 font-medium mt-1">Checkouts on this date</p>
          </div>

          {/* Books Returned */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Books Returned</span>
              <RotateCcw className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-mono font-extrabold text-emerald-950 mt-2">
              {returnsOnDate.length}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Restored to catalog</p>
          </div>

          {/* Fines Collected */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Fines Collected</span>
              <DollarSign className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-mono font-extrabold text-amber-950 mt-2">
              {currency}{finesCollectedOnDate.toFixed(2)}
            </div>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              {finesWaivedOnDate > 0 ? `+ ${currency}${finesWaivedOnDate.toFixed(2)} waived` : 'Received in desk till'}
            </p>
          </div>

          {/* Overdue Items Alert */}
          <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Pending Overdue</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-3xl font-mono font-extrabold text-rose-950 mt-2">
              {activeOverdueList.length}
            </div>
            <p className="text-[11px] text-rose-600 font-medium mt-1">
              {currency}{totalOutstandingFines.toFixed(2)} accrued
            </p>
          </div>
        </div>

        {/* SECTION 1: Books Issued on Date */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>1. Books Issued on {formatDate(selectedDate)} ({issuesOnDate.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Total copies issued: {issuesOnDate.length}</span>
          </div>

          {issuesOnDate.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
              No books were issued on {formatDate(selectedDate)}.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Loan ID</th>
                    <th className="py-2.5 px-4">Book Title & ISBN</th>
                    <th className="py-2.5 px-4">Borrower Name & ID</th>
                    <th className="py-2.5 px-4">Scheduled Due Date</th>
                    <th className="py-2.5 px-4">Librarian Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {issuesOnDate.map(loan => (
                    <tr key={loan.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-mono text-slate-600">{loan.id}</td>
                      <td className="py-2.5 px-4">
                        <span className="font-serif font-bold text-slate-900 block">{loan.bookTitle}</span>
                        <span className="font-mono text-[11px] text-slate-400">{loan.bookIsbn}</span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-semibold text-slate-800 block">{loan.memberName}</span>
                        <span className="text-slate-500 text-[11px]">{loan.memberId}</span>
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-indigo-600">
                        {formatDate(loan.dueDate)}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 italic">
                        {loan.librarianNote || 'Standard checkout'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SECTION 2: Books Returned on Date */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
              <span>2. Books Returned on {formatDate(selectedDate)} ({returnsOnDate.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Total copies checked in: {returnsOnDate.length}</span>
          </div>

          {returnsOnDate.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
              No books were returned on {formatDate(selectedDate)}.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Loan ID</th>
                    <th className="py-2.5 px-4">Book Title</th>
                    <th className="py-2.5 px-4">Borrower</th>
                    <th className="py-2.5 px-4">Issue & Due Dates</th>
                    <th className="py-2.5 px-4">Fine Amount</th>
                    <th className="py-2.5 px-4">Settlement Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {returnsOnDate.map(loan => {
                    let fineStatusBadge = (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                        On Time (No Fine)
                      </span>
                    );
                    if (loan.fineAmount > 0) {
                      if (loan.fineWaived) {
                        fineStatusBadge = (
                          <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-medium">
                            Waived: {loan.waiverReason || 'Discretion'}
                          </span>
                        );
                      } else if (loan.finePaid) {
                        fineStatusBadge = (
                          <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                            Paid ({loan.paymentMethod || 'Cash'})
                          </span>
                        );
                      } else {
                        fineStatusBadge = (
                          <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold">
                            Unpaid
                          </span>
                        );
                      }
                    }

                    return (
                      <tr key={loan.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 font-mono text-slate-600">{loan.id}</td>
                        <td className="py-2.5 px-4 font-serif font-bold text-slate-900">{loan.bookTitle}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-800">{loan.memberName}</td>
                        <td className="py-2.5 px-4 text-slate-500">
                          <div>Issued: {formatDate(loan.issueDate)}</div>
                          <div>Due: {formatDate(loan.dueDate)}</div>
                        </td>
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-800">
                          {currency}{Number(loan.fineAmount || 0).toFixed(2)}
                        </td>
                        <td className="py-2.5 px-4">{fineStatusBadge}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SECTION 3: Current System-wide Overdue Items Needing Follow-up */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>3. Overdue Follow-up List ({activeOverdueList.length} items needing action)</span>
            </h3>
            <span className="text-xs text-rose-600 font-semibold">
              Total pending recovery: {currency}{totalOutstandingFines.toFixed(2)}
            </span>
          </div>

          {activeOverdueList.length === 0 ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs text-emerald-800 font-medium">
              Excellent! No loans are currently overdue across the entire library system.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-rose-50/70 border-b border-rose-100 text-rose-900 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Loan ID</th>
                    <th className="py-2.5 px-4">Book Title</th>
                    <th className="py-2.5 px-4">Borrower & Contact</th>
                    <th className="py-2.5 px-4">Due Date</th>
                    <th className="py-2.5 px-4">Days Overdue</th>
                    <th className="py-2.5 px-4">Accrued Fine</th>
                    <th className="py-2.5 px-4 text-right no-print">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeOverdueList.map(loan => (
                    <tr key={loan.id} className="hover:bg-rose-50/30">
                      <td className="py-2.5 px-4 font-mono text-slate-600">{loan.id}</td>
                      <td className="py-2.5 px-4 font-serif font-bold text-slate-900">{loan.bookTitle}</td>
                      <td className="py-2.5 px-4">
                        <span className="font-semibold text-slate-800 block">{loan.memberName}</span>
                        <span className="text-slate-500 text-[11px] font-mono">{loan.memberEmail}</span>
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-700">{formatDate(loan.dueDate)}</td>
                      <td className="py-2.5 px-4 font-bold text-rose-600">{loan.overdueDays} days</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-rose-700">
                        {currency}{loan.currentFine.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-4 text-right no-print">
                        <button
                          onClick={() => onSendReminder(loan)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold border border-rose-200 text-[11px] transition-colors"
                        >
                          Send Notice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Librarian Official Sign-off Block */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Certified By</span>
            <p className="font-bold text-slate-800 text-sm">{settings?.librarianName || 'Head Librarian'}</p>
            <p className="text-[11px] text-slate-400">Department of Circulation & Library Services</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Official Verification Stamp</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Audited & Reconciled</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

