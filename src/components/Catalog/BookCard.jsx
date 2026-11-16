import React from 'react';
import { BookOpen, MapPin, Star, BookmarkCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { THEMES } from '../../data/initialBooks';

export default function BookCard({ book, onSelectBook, onQuickIssue }) {
  const themeObj = THEMES.find(t => t.id === book.theme) || { name: book.theme, color: 'slate' };
  const isAvailable = book.availableCopies > 0;

  const themeBadges = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    slate: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  const badgeClass = themeBadges[themeObj.color] || themeBadges.slate;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Book Spine / Cover Header */}
      <div className={`h-28 bg-gradient-to-r ${book.coverGradient || 'from-indigo-600 to-slate-800'} p-4 flex flex-col justify-between relative overflow-hidden`}>
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
        
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-black/30 backdrop-blur-sm text-white/90 border border-white/20">
            {book.isbn}
          </span>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-amber-300 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{book.rating}</span>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-white/80 text-xs">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-200" />
            <span className="font-mono text-[11px]">{book.shelfLocation}</span>
          </span>
          <span className="text-[11px] font-medium">{book.publishedYear}</span>
        </div>
      </div>

      {/* Book Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Theme tag */}
          <div className="mb-2.5">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}>
              {themeObj.name}
            </span>
          </div>

          <h3 
            onClick={() => onSelectBook(book)}
            className="font-serif font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors"
            title={book.title}
          >
            {book.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1 font-medium">{book.author}</p>

          <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Stock & Action Footers */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-500 font-medium">Availability</span>
            {isAvailable ? (
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {book.availableCopies} of {book.totalCopies} copies in
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold text-rose-600">
                <AlertCircle className="w-3.5 h-3.5" />
                All {book.totalCopies} checked out
              </span>
            )}
          </div>

          {/* Availability progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isAvailable ? 'bg-emerald-500' : 'bg-rose-400'}`}
              style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectBook(book)}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
            >
              Details
            </button>
            <button
              onClick={() => onQuickIssue(book)}
              disabled={!isAvailable}
              className={`px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all ${
                isAvailable 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Issue</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

