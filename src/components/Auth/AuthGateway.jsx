import React, { useState } from 'react';
import { 
  BookOpen, ShieldCheck, Sparkles, ArrowRight, Lock, Mail, 
  Key, User, CheckCircle2, AlertCircle, Eye, EyeOff, 
  Clock, MapPin, Phone, MessageCircle, Instagram, Star, Award, Compass
} from 'lucide-react';
import { STAFF_ACCOUNTS, LITERARY_QUOTES } from '../../data/staffAccounts';
import AboutContactFooter from '../Common/AboutContactFooter';
import confetti from 'canvas-confetti';

export default function AuthGateway({ 
  members, 
  settings, 
  onLogin, 
  onRegisterPatron 
}) {
  const [portalMode, setPortalMode] = useState('patron'); // 'patron' | 'staff'
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Patron form state
  const [patronInput, setPatronInput] = useState('');
  const [patronPin, setPatronPin] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCategory, setRegCategory] = useState('Student');

  // Staff form state
  const [selectedStaff, setSelectedStaff] = useState(STAFF_ACCOUNTS[0]);
  const [staffPin, setStaffPin] = useState('1234');

  const [errorMsg, setErrorMsg] = useState('');

  // Random quote
  const [quoteIndex] = useState(() => Math.floor(Math.random() * LITERARY_QUOTES.length));
  const activeQuote = LITERARY_QUOTES[quoteIndex];

  // Visual imagery config based on active mode
  const isPatron = portalMode === 'patron';
  const heroImage = isPatron
    ? 'https://images.unsplash.com/photo-1507842229440-69279c6d3283?w=1600&auto=format&fit=crop&q=80' // Warm illuminated modern library stacks
    : 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&auto=format&fit=crop&q=80'; // Grand Trinity College Long Room cathedral stacks

  const handlePatronSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const query = patronInput.trim().toLowerCase();
    const found = members.find(
      m => m.id.toLowerCase() === query || m.email.toLowerCase() === query || m.name.toLowerCase().includes(query)
    );

    if (!found) {
      setErrorMsg('No patron record matched that Member ID, Name, or Email. Use a demo profile or sign up below.');
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

    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch {}

    onRegisterPatron(newPatron);
    onLogin({ role: 'customer', user: newPatron });
  };

  const handleStaffSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (staffPin.trim() !== '1234' && staffPin.trim().length < 4) {
      setErrorMsg('Invalid Officer Security Keycard PIN. (Default demo PIN is 1234)');
      return;
    }

    onLogin({ role: 'staff', user: selectedStaff });
  };

  const handle1ClickLogin = (role, userObj) => {
    onLogin({ role, user: userObj });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Banner & Quick Anchors */}
      <nav className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div>
            <span className="font-serif font-black text-lg text-white tracking-tight block leading-tight">
              {settings?.libraryName || 'Athena Central Library'}
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              Digital Circulation & Knowledge Stacks
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <a href="#about-section" className="text-slate-400 hover:text-amber-300 transition-colors hidden sm:inline-block">
            About Institution
          </a>
          <a href="#contact-section" className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-400/30 transition-all flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            <span>Contact us</span>
          </a>
        </div>
      </nav>

      {/* Main Hero & Split-Screen Login Experience */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* ========================================================= */}
          {/* LEFT WING: ATMOSPHERIC IMAGE CANVAS (REFRESHING VISUALS)  */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden min-h-[420px] lg:min-h-[640px] shadow-2xl border border-white/10 group flex flex-col justify-between p-6 sm:p-8">
            
            {/* Background Photographic Canvas with Smooth Parallax Hover */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform group-hover:scale-105"
              style={{ backgroundImage: `url(${heroImage})` }}
            />

            {/* Gradient Overlays for High-Contrast Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
            <div className={`absolute inset-0 transition-opacity duration-700 ${isPatron ? 'bg-amber-900/20' : 'bg-indigo-950/30'}`} />

            {/* Top Floating Glass Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md bg-black/40 border border-white/20 text-white shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Open Today • 08:00 AM – 10:00 PM</span>
              </span>

              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md bg-black/40 border border-white/15 text-amber-300">
                {isPatron ? 'READER SANCTUARY' : 'STAFF OPS TERMINAL'}
              </span>
            </div>

            {/* Middle Feature Highlights */}
            <div className="relative z-10 my-auto py-8 space-y-3">
              <span className="inline-block text-xs font-mono font-bold tracking-wider uppercase text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-400/30">
                {isPatron ? 'Curated Stacks • 8 Thematic Archives' : 'Clearance Level 2 - 4 Verified'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-white leading-tight drop-shadow-md">
                {isPatron 
                  ? 'Step into a world where knowledge knows no limits.' 
                  : 'Commanding circulation desks, audits & archival custody.'}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md drop-shadow">
                {isPatron
                  ? 'Access 50,000+ volumes, reserve books, track due dates, renew loans, and pay late fees online.'
                  : 'Complete book checkouts, assess overdue fees, authorize waivers, and export daily operations logs.'}
              </p>
            </div>

            {/* Bottom Glass Quote Card */}
            <div className="relative z-10 p-4 rounded-2xl backdrop-blur-md bg-black/45 border border-white/15 space-y-2 text-xs shadow-xl">
              <div className="flex items-center justify-between text-amber-300">
                <span className="flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Daily Literary Inspiration
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                  <Star className="w-3 h-3 fill-amber-300" /> 4.9 / 5.0
                </span>
              </div>
              <p className="italic text-slate-200 font-serif leading-relaxed text-[11px]">
                "{activeQuote.quote}"
              </p>
              <p className="text-right text-[10px] text-amber-400 font-sans font-bold">
                — {activeQuote.author}
              </p>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT WING: NEW REFRESHING GLASSMORPHIC LOGIN CARD        */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden glow-card">
              
              {/* Animated subtle top gradient sheen */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 opacity-80" />

              {/* Segmented Portal Switcher: Reader vs Staff */}
              <div className="mb-6">
                <div className="p-1 rounded-2xl bg-slate-900 border border-white/10 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => { setPortalMode('patron'); setIsRegistering(false); setErrorMsg(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isPatron
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Patron Sanctuary</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setPortalMode('staff'); setIsRegistering(false); setErrorMsg(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      !isPatron
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Librarian Staff</span>
                  </button>
                </div>
              </div>

              {/* Header Title */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                    {isPatron ? (
                      isRegistering ? 'Register New Reader' : 'Patron Check-In'
                    ) : (
                      'Librarian Keycard Terminal'
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isPatron 
                      ? (isRegistering ? 'Create your digital passport in seconds' : 'Sign in to access your digital library passport')
                      : 'Circulation desk & administration session'}
                  </p>
                </div>

                {isPatron && (
                  <button
                    type="button"
                    onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(''); }}
                    className="text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    {isRegistering ? 'Existing Reader?' : 'New Reader?'}
                  </button>
                )}
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* ===================================================== */}
              {/* 1-CLICK FAST EVALUATION PROFILES                      */}
              {/* ===================================================== */}
              <div className="mb-6">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider block mb-2 text-slate-400">
                  {isPatron ? 'Instant 1-Click Patron Evaluation' : 'Instant 1-Click Staff Officers'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {isPatron ? (
                    // Patron demo profiles
                    members.slice(0, 2).map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handle1ClickLogin('customer', m)}
                        className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all text-left flex items-center gap-3 group"
                      >
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-9 h-9 rounded-xl object-cover border border-amber-400/40"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                            {m.name}
                          </p>
                          <p className="text-[10px] text-amber-400/90 font-mono">{m.category} • {m.id}</p>
                        </div>
                        <span className="text-xs text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </button>
                    ))
                  ) : (
                    // Staff demo profiles
                    STAFF_ACCOUNTS.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handle1ClickLogin('staff', s)}
                        className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/40 transition-all text-left flex items-center gap-3 group"
                      >
                        <img
                          src={s.avatar}
                          alt={s.name}
                          className="w-9 h-9 rounded-xl object-cover border border-indigo-400/40"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300">
                            {s.name}
                          </p>
                          <p className="text-[10px] text-indigo-300 font-mono">{s.role}</p>
                        </div>
                        <span className="text-xs text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                  Or Sign In Below
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* ===================================================== */}
              {/* FORM FIELDS                                           */}
              {/* ===================================================== */}
              {isPatron ? (
                isRegistering ? (
                  // Sign-up Form for New Readers
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Liam Gallagher"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. ananya@iitb.ac.in"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Patron Category</label>
                      <select
                        value={regCategory}
                        onChange={(e) => setRegCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
                      >
                        <option value="Student">Student (Standard 5 Books Quota)</option>
                        <option value="Faculty">Faculty (Extended 8 Books Quota)</option>
                        <option value="Researcher">Researcher / Scholar</option>
                        <option value="Community Patron">Community Reader</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01]"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Issue Digital Card & Enter Sanctuary</span>
                    </button>
                  </form>
                ) : (
                  // Regular Patron Login Form
                  <form onSubmit={handlePatronSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Patron ID, Name, or Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={patronInput}
                          onChange={(e) => setPatronInput(e.target.value)}
                          placeholder="e.g. MEM-001 or Ananya Deshmukh"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs placeholder-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1 flex items-center justify-between">
                        <span>Card PIN / Password</span>
                        <span className="text-[10px] text-slate-400">(Optional for demo)</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={patronPin}
                          onChange={(e) => setPatronPin(e.target.value)}
                          placeholder="••••"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs placeholder-slate-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
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
                )
              ) : (
                // Staff Login Form
                <form onSubmit={handleStaffSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Select Officer Account</label>
                    <select
                      value={selectedStaff.id}
                      onChange={(e) => {
                        const found = STAFF_ACCOUNTS.find(s => s.id === e.target.value);
                        if (found) setSelectedStaff(found);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none font-semibold"
                    >
                      {STAFF_ACCOUNTS.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.role}) - {s.clearance}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>Officer Keycard PIN</span>
                      <span className="text-[11px] font-mono text-indigo-400">Demo PIN: 1234</span>
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={staffPin}
                        onChange={(e) => setStaffPin(e.target.value)}
                        placeholder="1234"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01]"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize Officer Session</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* About & Contact Us Section at the Bottom */}
      <AboutContactFooter libraryName={settings?.libraryName} />

    </div>
  );
}
