import React, { useState } from 'react';
import { 
  BookOpen, Phone, MessageCircle, Instagram, Mail, MapPin, 
  Clock, Sparkles, Send, CheckCircle2, ShieldCheck, Heart, 
  ArrowRight, Globe, Layers, MessageSquare, ExternalLink 
} from 'lucide-react';

export default function AboutContactFooter({ libraryName = 'Athena Central Library', onSwitchRole, currentRole }) {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryContact, setInquiryContact] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryMsg.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      setInquiryName('');
      setInquiryContact('');
      setInquiryMsg('');
      setIsSent(false);
    }, 4000);
  };

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-slate-950 text-slate-100 overflow-hidden font-sans no-print">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 space-y-16">
        
        {/* ============================================================== */}
        {/* SECTION 1: ABOUT US SECTION                                   */}
        {/* ============================================================== */}
        <div id="about-section" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>About Our Institution</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
                About {libraryName}
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              EST. 1984 • 50,000+ CATALOGED VOLUMES • 8 THEMATIC ARCHIVES
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Story & Philosophy */}
            <div className="lg:col-span-7 space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                Founded on the belief that human knowledge should be universally accessible, free, and inspiring, <strong className="text-white font-semibold">{libraryName}</strong> serves as a modern civic sanctuary for students, scholars, faculty, and passionate readers from all walks of life.
              </p>
              <p>
                Our stacks span <strong className="text-amber-300 font-semibold">eight meticulously curated thematic collections</strong>—from classical literature and world philosophy to bleeding-edge artificial intelligence, distributed computing systems, contemporary fiction, and economic theory.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Whether you are borrowing physical hardcovers with touchless RFID scanning, renewing loans digitally through your Patron Passport, or conducting deep academic research in our silent study chambers, Athena Library merges timeless literary warmth with 21st-century circulation technology.
              </p>

              {/* Badges / Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 hover:border-amber-400/40 transition-colors">
                  <span className="text-xl">🏛️</span>
                  <p className="text-xs font-bold text-white">50k+ Books</p>
                  <p className="text-[10px] text-slate-400">Physical & E-Books</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 hover:border-amber-400/40 transition-colors">
                  <span className="text-xl">⚡</span>
                  <p className="text-xs font-bold text-white">24/7 Portal</p>
                  <p className="text-[10px] text-slate-400">Online Circulation</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 hover:border-amber-400/40 transition-colors">
                  <span className="text-xl">☕</span>
                  <p className="text-xs font-bold text-white">Silent Pods</p>
                  <p className="text-[10px] text-slate-400">Quiet Study Stacks</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 hover:border-amber-400/40 transition-colors">
                  <span className="text-xl">📜</span>
                  <p className="text-xs font-bold text-white">Rare Wing</p>
                  <p className="text-[10px] text-slate-400">Archival Manuscripts</p>
                </div>
              </div>
            </div>

            {/* Quick Stats & Visiting Hours Card */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-6 rounded-3xl border border-white/15 shadow-xl space-y-4 glow-card">
                <div className="flex items-center gap-2.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Library Visiting & Desk Hours</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="font-semibold text-white">Monday – Friday</span>
                    <span className="font-mono text-amber-300 font-bold">08:00 AM – 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="font-semibold text-white">Saturday – Sunday</span>
                    <span className="font-mono text-amber-300 font-bold">09:00 AM – 08:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="font-semibold text-white">Digital Web Portal</span>
                    <span className="font-mono text-emerald-400 font-bold">24 Hours / 7 Days Live</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold text-white">Drop-Box Returns</span>
                    <span className="font-mono text-emerald-400 font-bold">24/7 Stacks Slot</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>45, Saraswati Vidya Marg, Knowledge Corridor, Bengaluru, Karnataka 560001, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: CONTACT US SECTION ("Contact us:- ")                */}
        {/* ============================================================== */}
        <div id="contact-section" className="space-y-8 pt-8 border-t border-white/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Get In Touch</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
              Contact us:- Reach Our Librarians & Helpdesk
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Have questions regarding book availability, membership renewals, fine waivers, research archives, or room reservations? Reach out via direct call, WhatsApp, or Instagram!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Phone Number */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between glow-card group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Phone Desk</h4>
                <p className="font-mono font-bold text-white text-sm mt-1">+91 98765 43210</p>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">Toll-free: 1800 266 4422</p>
              </div>
              <a
                href="tel:+919876543210"
                className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300"
              >
                <span>Call Desk Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* 2. WhatsApp Number */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between glow-card group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">WhatsApp Support</h4>
                <p className="font-mono font-bold text-emerald-300 text-sm mt-1">+91 98765 43210</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Instant WhatsApp chat for book inquiries</p>
              </div>
              <a
                href="https://wa.me/919876543210?text=Namaste%20Athena%20Library%2C%20I%20have%20an%20inquiry%20regarding%20book%20borrowing."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* 3. Instagram ID */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 hover:border-pink-500/40 transition-all flex flex-col justify-between glow-card group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md shadow-rose-500/20">
                  <Instagram className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Instagram Handle</h4>
                <p className="font-serif font-bold text-rose-300 text-sm mt-1">@athena.digitallibrary.in</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Events, new arrivals, & book clubs</p>
              </div>
              <a
                href="https://instagram.com/athena.digitallibrary.in"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-rose-400 group-hover:text-rose-300"
              >
                <span>Follow on Instagram</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* 4. Official Email */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between glow-card group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Email</h4>
                <p className="font-mono text-white text-xs mt-1 truncate">circulation@athenalibrary.in</p>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">helpdesk@athenalibrary.in</p>
              </div>
              <a
                href="mailto:circulation@athenalibrary.in"
                className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300"
              >
                <span>Send Email</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>

          {/* Quick Librarian Message Box */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Send an Instant Message to the Circulation Desk
              </h4>
            </div>

            {isSent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Thank you! Your message has been routed to the Chief Librarian. We will respond within 24 hours.</span>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="Your Full Name *"
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white placeholder-slate-500"
                />
                <input
                  type="text"
                  required
                  value={inquiryContact}
                  onChange={(e) => setInquiryContact(e.target.value)}
                  placeholder="Phone, WhatsApp or Email *"
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white placeholder-slate-500"
                />
                <div className="md:col-span-3 flex gap-2">
                  <input
                    type="text"
                    required
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    placeholder="Type your inquiry (e.g., book availability, fine waiver request, room booking)... *"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold flex items-center gap-1.5 transition-all shrink-0 shadow-md shadow-amber-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 3: COPYRIGHT & PORTAL SWITCH FOOTER                    */}
        {/* ============================================================== */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {libraryName}. All Rights Reserved. Built for Readers & Librarians.</p>
          
          <div className="flex items-center gap-4 text-xs">
            <a href="#about-section" className="hover:text-amber-300 transition-colors">About Us</a>
            <span>•</span>
            <a href="#contact-section" className="hover:text-emerald-300 transition-colors">Contact Us</a>
            <span>•</span>
            {onSwitchRole && (
              <button
                onClick={onSwitchRole}
                className="text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                {currentRole === 'customer' ? 'Switch to Staff Portal →' : 'Switch to Customer Sanctuary →'}
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
