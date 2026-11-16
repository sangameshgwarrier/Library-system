import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, User, ArrowRight, ShieldCheck, 
  Lock, Mail, Bookmark, Compass, Heart, AlertCircle 
} from 'lucide-react';
import { LITERARY_QUOTES } from '../../data/staffAccounts';

export default function PatronLogin({ members, onLogin, onSwitchToStaff, onRegisterPatron }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [selectedPatronId, setSelectedPatronId] = useState(members[0]?.id || 'MEM-001');
  const [emailInput, setEmailInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCategory, setRegCategory] = useState('Student');
  const [errorMsg, setErrorMsg] = useState('');

  // Random quote
  const [quoteIndex] = useState(() => Math.floor(Math.random() * LITERARY_QUOTES.length));
  const activeQuote = LITERARY_QUOTES[quoteIndex];

  const handleQuickLogin = (patron) => {
    onLogin({ role: 'customer', user: patron });
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = emailInput.trim().toLowerCase();
    const found = members.find(
      m => m.id.toLowerCase() === trimmedEmail || m.email.toLowerCase() === trimmedEmail
    );

    if (!found) {
      setErrorMsg('No patron account found with that Member ID or Email. Try a demo profile below or register.');
      return;
    }

    onLogin({ role: 'customer', user: found });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    const newPatron = {
      id: `MEM-${String(members.length + 1).padStart(3, '0')}`,
      name: regName.trim(),
      email: regEmail.trim(),
      phone: '+1 (555) 000-0000',
      category: regCategory,
      membershipDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'
    };

    onRegisterPatron(newPatron);
    onLogin({ role: 'customer', user: newPatron });
  };

  return (
    <div className="min-h-screen bg-mesh-patron flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden text-slate-100">
      {/* Animated ambient background floating orbs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl animate-float pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl animate-pulse-glow pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Literary Sanctuary Story & Quote */}
        <div className="md:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Reader & Patron Portal</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight leading-tight">
              Welcome to the <br />
              <span className="bg-gradient-to-r from-amber-200 via-emerald-200 to-indigo-200 bg-clip-text text-transparent">
                Patron Sanctuary
              </span>
            </h1>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              Browse thousands of volumes across 8 themes, manage your active borrowings, renew loans, pay late fees online, and access your digital library card.
            </p>
          </div>

          {/* Literary Quote Card */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden">
            <div className="text-2xl text-amber-400/30 font-serif leading-none">“</div>
            <p className="text-xs text-amber-100/90 italic font-serif leading-relaxed -mt-2">
              {activeQuote.quote}
            </p>
            <p className="text-[11px] font-sans font-semibold text-amber-400 mt-2 text-right">
              — {activeQuote.author}
            </p>
          </div>

          {/* Portal Switcher Link */}
          <div className="pt-2">
            <button
              onClick={onSwitchToStaff}
              className="group flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <span>Are you a library staff member?</span>
              <span className="text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                Worker Portal <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Card Template for Patron Login */}
        <div className="md:col-span-7">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl relative border border-amber-500/20 glow-card">
            
            {/* Header Tabs: Quick Select / Custom / Register */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
              <div>
                <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <span>{isRegisterMode ? 'New Patron Sign Up' : 'Patron Check-In'}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRegisterMode ? 'Register in 10 seconds for instant borrowing' : 'Sign in to access your digital patron card'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => { setIsRegisterMode(!isRegisterMode); setErrorMsg(''); }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/20 transition-all"
              >
                {isRegisterMode ? 'Existing Patron?' : 'New Reader?'}
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {!isRegisterMode ? (
              <div className="space-y-6">
                {/* 1-Click Fast Profile Switcher */}
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2.5">
                    1-Click Patron Demo Profiles (Instant Access)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {members.slice(0, 3).map(patron => (
                      <button
                        key={patron.id}
                        type="button"
                        onClick={() => handleQuickLogin(patron)}
                        className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-amber-400/40 transition-all text-left flex flex-col justify-between group hover:scale-[1.02]"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={patron.avatar}
                            alt={patron.name}
                            className="w-8 h-8 rounded-full object-cover border border-amber-400/40"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                              {patron.name}
                            </p>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {patron.category}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between text-[10px] text-amber-400/80">
                          <span className="font-mono">{patron.id}</span>
                          <span className="group-hover:translate-x-0.5 transition-transform font-bold">Login →</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Or Manual ID Check-In</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Manual Login Form */}
                <form onSubmit={handleManualLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Patron ID or Registered Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="e.g. MEM-001 or eleanor.vance@uni.edu"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>Library Card PIN / Password</span>
                      <span className="text-[10px] text-slate-400">(Default: Any 4 digits or leave blank)</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        placeholder="••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01]"
                  >
                    <span>Enter Patron Sanctuary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Clara Oswald"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. clara@academy.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Patron Category</label>
                  <select
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white"
                  >
                    <option value="Student">Student (Standard Quota: 5 Books)</option>
                    <option value="Faculty">Faculty (Extended Quota: 8 Books)</option>
                    <option value="Researcher">Researcher / Scholar</option>
                    <option value="Community Patron">Community Reader</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Digital Patron Pass & Login</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
