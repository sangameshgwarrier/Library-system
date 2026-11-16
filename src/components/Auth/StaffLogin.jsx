import React, { useState } from 'react';
import { 
  ShieldCheck, Terminal, Lock, Key, ArrowRight, UserCheck, 
  Cpu, Database, Sparkles, AlertCircle, Fingerprint, Activity 
} from 'lucide-react';
import { STAFF_ACCOUNTS } from '../../data/staffAccounts';

export default function StaffLogin({ onLogin, onSwitchToPatron }) {
  const [selectedStaff, setSelectedStaff] = useState(STAFF_ACCOUNTS[0]);
  const [pin, setPin] = useState('1234');
  const [errorMsg, setErrorMsg] = useState('');

  const handleStaffSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() !== '1234' && pin.trim().length < 4) {
      setErrorMsg('Invalid Security Keycard PIN. (Default demo PIN is 1234)');
      return;
    }

    onLogin({ role: 'staff', user: selectedStaff });
  };

  const handleQuickStaffLogin = (staffMember) => {
    onLogin({ role: 'staff', user: staffMember });
  };

  return (
    <div className="min-h-screen bg-mesh-dark flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden text-slate-100 font-sans">
      {/* Background cyber grid & glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b08_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl animate-float pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Staff Console Story & Telemetry */}
        <div className="md:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>STAFF CONSOLE • TERMINAL #04</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight leading-tight">
              Librarian & Staff <br />
              <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-purple-300 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Authorized access only. Full circulation desk controls, real-time fine assessments, daily operations auditing, and catalog inventory governance.
            </p>
          </div>

          {/* Security Telemetry Widget */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                <Activity className="w-3.5 h-3.5" /> SYSTEM STATUS
              </span>
              <span className="text-emerald-400 font-bold">ONLINE & SYNCED</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>CIRCULATION MODULE:</span>
              <span className="text-slate-200">ACTIVE (v2.4)</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>FINE LEDGER:</span>
              <span className="text-slate-200">RECONCILED</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>SECURITY CLEARANCE:</span>
              <span className="text-indigo-300 font-bold">LEVEL 2 - 4 REQUIRED</span>
            </div>
          </div>

          {/* Switch to Patron Portal */}
          <div className="pt-2">
            <button
              onClick={onSwitchToPatron}
              className="group flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <span>Are you a patron or reader?</span>
              <span className="text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                Customer Sanctuary <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: High-tech Staff Login Form */}
        <div className="md:col-span-7">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl relative border border-indigo-500/30 overflow-hidden glow-card">
            
            {/* Animated scanning line across card */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30 animate-scanline pointer-events-none" />

            <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-mono font-bold shadow-lg shadow-indigo-500/20">
                  <Fingerprint className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-wide">Staff Keycard Access</h2>
                  <p className="text-xs text-slate-400 font-mono">Authenticate circulation officer session</p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                TLS 256-BIT
              </span>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick 1-Click Staff Profiles */}
            <div className="mb-6">
              <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-2.5">
                Select Staff Officer (1-Click Authentication)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STAFF_ACCOUNTS.map(staff => {
                  const isSelected = selectedStaff.id === staff.id;
                  return (
                    <button
                      key={staff.id}
                      type="button"
                      onClick={() => { setSelectedStaff(staff); handleQuickStaffLogin(staff); }}
                      className={`p-3.5 rounded-2xl border transition-all text-left flex items-center gap-3 group ${
                        isSelected 
                          ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-600/20' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-indigo-400/40'
                      }`}
                    >
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-10 h-10 rounded-xl object-cover border border-indigo-400/40"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300">
                          {staff.name}
                        </p>
                        <p className="text-[11px] text-indigo-300 font-mono">{staff.role}</p>
                        <span className="text-[9px] text-slate-400 block truncate">{staff.clearance}</span>
                      </div>
                      <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition-transform font-bold font-mono">
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Standard Keycard PIN Form */}
            <form onSubmit={handleStaffSubmit} className="space-y-4 pt-2 border-t border-white/10">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Officer PIN / Keycard Code</span>
                  <span className="text-[11px] text-indigo-400 font-mono font-bold">Demo PIN: 1234</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-xs font-mono tracking-widest text-white placeholder-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Initialize Staff Command Center</span>
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
