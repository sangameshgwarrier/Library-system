import React from 'react';
import { Sparkles, ShieldCheck, AlertTriangle, Wifi, Barcode, BookOpen } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export default function DigitalLibraryCard({ patron, activeLoans = [], settings }) {
  if (!patron) return null;

  const currentLoans = activeLoans.filter(l => l.memberId === patron.id && l.status !== 'Returned');
  const overdueLoans = currentLoans.filter(l => l.status === 'Overdue');
  const hasOverdue = overdueLoans.length > 0;

  return (
    <div className="relative group perspective-1000">
      {/* Background ambient glow */}
      <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500 ${
        hasOverdue 
          ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700' 
          : 'bg-gradient-to-r from-amber-500 via-emerald-500 to-indigo-600 animate-gradient-x'
      }`} />

      {/* Card Face */}
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-white/20 p-6 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col justify-between min-h-[220px]">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
        
        {/* Shimmer light sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

        {/* Top Header of Card */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold shadow-inner">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase block">
                {settings?.libraryName || 'ATHENA CENTRAL LIBRARY'}
              </span>
              <span className="text-sm font-serif font-black text-white tracking-wide">
                Digital Patron Passport
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-amber-300/80 rotate-90" />
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 border border-white/15 text-amber-200">
              NFC READY
            </span>
          </div>
        </div>

        {/* Middle: Patron Name & Role */}
        <div className="relative z-10 my-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={patron.avatar}
              alt={patron.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400/60 shadow-lg"
            />
            <div>
              <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                {patron.name}
              </h3>
              <p className="text-xs text-amber-300 font-medium">
                {patron.category} • <span className="font-mono">{patron.id}</span>
              </p>
            </div>
          </div>

          {/* Standing Badge */}
          <div className="text-right">
            {hasOverdue ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" /> Overdue Alert
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-3.5 h-3.5" /> Good Standing
              </span>
            )}
            <span className="block text-[10px] text-slate-400 mt-1 font-mono">
              {currentLoans.length} of {settings?.maxBooksPerMember || 5} checked out
            </span>
          </div>
        </div>

        {/* Bottom Barcode Strip */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
            <span>ISSUED: {formatDate(patron.membershipDate)}</span>
            <span>•</span>
            <span>EXP: INDEFINITE</span>
          </div>

          {/* Barcode graphic */}
          <div className="flex items-center gap-0.5 bg-white/90 px-2 py-1 rounded shadow-sm">
            {[2, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 2].map((w, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900 h-4" 
                style={{ width: `${w}px` }} 
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
