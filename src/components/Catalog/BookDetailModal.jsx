import React from 'react';
import { X, BookOpen, MapPin, Calendar, Star, Barcode, CheckCircle2, AlertCircle, User, ArrowRight } from 'lucide-react';
import { THEMES } from '../../data/initialBooks';
import { formatDate } from '../../utils/dateUtils';

export default function BookDetailModal({ book, activeLoans = [], onClose, onIssueBook }) {
  if (!book) return null;

  const themeObj = THEMES.find(t => t.id === book.theme) || { name: book.theme, color: 'slate' };
  const isAvailable = book.availableCopies > 0;
  
  // Find who currently has this book checked out
  const currentHolders = activeLoans.filter(l => l.bookId === book.id && l.status !== 'Returned');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className={`p-6 bg-gradient-to-r ${book.coverGradient || 'from-indigo-700 to-slate-900'} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-sm mb-3">
            {themeObj.name}
          </span>

          <h2 className="text-2xl font-serif font-bold text-white leading-tight">
            {book.title}
          </h2>
          <p className="text-indigo-100 mt-1 text-base font-medium">By {book.author}</p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-white/90">
            <span className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-lg">
              <Calendar className="w-3.5 h-3.5" /> Published {book.publishedYear}
            </span>
            <span className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-lg font-mono">
              <Barcode className="w-4 h-4" /> ISBN: {book.isbn}
            </span>
            <span className="flex items-center gap-1 bg-amber-400/90 text-slate-900 font-bold px-2.5 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-current" /> {book.rating} / 5.0
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Availability & Location Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Physical Location</span>
              <div className="flex items-center gap-2 mt-1.5">
                <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
                <span className="font-mono text-sm font-semibold text-slate-800">{book.shelfLocation}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock Status</span>
              <div className="flex items-center justify-between mt-1.5">
                <div className="flex items-center gap-2">
                  {isAvailable ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <span className="text-sm font-semibold text-slate-800">
                    {book.availableCopies} available <span className="text-slate-400 font-normal">({book.totalCopies} total)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Book Synopsis</h4>
            <p className="text-slate-700 text-sm leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 font-normal">
              {book.description}
            </p>
          </div>

          {/* Current Borrowers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Current Borrowers ({currentHolders.length})</span>
              <span className="text-[11px] font-normal text-slate-500">Tracked in Circulation</span>
            </h4>

            {currentHolders.length === 0 ? (
              <div className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                All copies are currently in the library stacks.
              </div>
            ) : (
              <div className="space-y-2">
                {currentHolders.map(loan => (
                  <div key={loan.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        {loan.memberName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{loan.memberName}</p>
                        <p className="text-slate-500 text-[11px]">Due: {formatDate(loan.dueDate)}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      loan.status === 'Overdue' 
                        ? 'bg-rose-100 text-rose-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onIssueBook(book);
            }}
            disabled={!isAvailable}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
              isAvailable 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Issue This Copy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

