import React, { useState } from 'react';
import { 
  ShieldCheck, Terminal, BookOpen, RotateCcw, DollarSign, 
  FileText, Users, Plus, Settings, LogOut, ArrowRightLeft, 
  Sparkles, Layers, Activity 
} from 'lucide-react';
import BookCatalog from '../Catalog/BookCatalog';
import ActiveLoansList from '../Circulation/ActiveLoansList';
import FineManagement from '../Fines/FineManagement';
import DailyReport from '../Reports/DailyReport';
import MemberDirectory from '../Members/MemberDirectory';
import AboutContactFooter from '../Common/AboutContactFooter';

export default function StaffPortal({ 
  staffUser, 
  books, 
  loans, 
  members, 
  settings, 
  onLogout, 
  onSwitchToPatron, 
  onOpenIssueModal, 
  onOpenReturnModal, 
  onOpenSettings, 
  onTriggerReturn, 
  onSendReminder, 
  onSettleFine, 
  onAddBook, 
  onAddMember 
}) {
  const [activeTab, setActiveTab] = useState('circulation'); // 'circulation', 'catalog', 'fines', 'report', 'members'

  const activeLoansCount = loans.filter(l => l.status !== 'Returned').length;
  const overdueCount = loans.filter(l => l.status === 'Overdue').length;

  const navItems = [
    { 
      id: 'circulation', 
      label: 'Circulation Desk', 
      icon: RotateCcw, 
      badge: activeLoansCount > 0 ? activeLoansCount : null,
      badgeColor: 'bg-indigo-500/20 text-indigo-300'
    },
    { 
      id: 'fines', 
      label: 'Fine Ledger', 
      icon: DollarSign, 
      badge: overdueCount > 0 ? overdueCount : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 font-bold'
    },
    { id: 'report', label: 'Daily Operations Report', icon: FileText },
    { id: 'catalog', label: 'Catalog & Shelf Inventory', icon: BookOpen },
    { id: 'members', label: 'Patron Accounts', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Staff Command Center Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-indigo-500/20 shadow-xl no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Branding with Security Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-400 flex items-center justify-center font-bold shadow-lg shadow-indigo-600/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-black text-lg text-white tracking-tight block leading-tight">
                  {settings?.libraryName || 'Athena Central Library'}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-semibold">
                    Staff Command Terminal
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions & Staff Identity */}
            <div className="flex items-center gap-2.5">
              {/* Quick Issue / Return Shortcuts */}
              <button
                onClick={onOpenIssueModal}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Issue</span>
              </button>

              <button
                onClick={onOpenReturnModal}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return</span>
              </button>

              {/* Switch to Customer Portal */}
              <button
                onClick={onSwitchToPatron}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition-all"
                title="View Patron Sanctuary Portal"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Customer View</span>
              </button>

              {/* Settings */}
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Circulation Rules & Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Staff Profile Pill */}
              <div className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-white/5 border border-white/10">
                <img
                  src={staffUser.avatar}
                  alt={staffUser.name}
                  className="w-8 h-8 rounded-xl object-cover border border-indigo-400/40"
                />
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                    {staffUser.name}
                  </p>
                  <p className="text-[10px] text-indigo-300 font-mono">{staffUser.role}</p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                title="End Staff Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation bar for staff */}
        <div className="lg:hidden flex items-center justify-around p-2 border-t border-white/10 bg-slate-900/90 text-xs overflow-x-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`py-1.5 px-2.5 rounded-lg font-bold whitespace-nowrap ${
                activeTab === item.id ? 'text-indigo-400 bg-white/10' : 'text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={onSwitchToPatron}
            className="py-1.5 px-2 rounded-lg text-amber-400 font-bold whitespace-nowrap"
          >
            Customer View
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Active Staff Clearance Banner */}
        <div className="p-4 rounded-2xl glass-panel border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono font-bold text-xs">
              SEC
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Officer In Charge: <span className="text-indigo-300">{staffUser.name}</span> ({staffUser.role})
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {staffUser.clearance} • Active Session ID: SES-{Date.now().toString().slice(-6)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono text-[11px] font-bold">
              Desk Till: Open
            </span>
            <button
              onClick={onSwitchToPatron}
              className="text-xs text-amber-300 hover:underline font-semibold"
            >
              Preview Patron Experience →
            </button>
          </div>
        </div>

        {/* Tab 1: Circulation Desk */}
        {activeTab === 'circulation' && (
          <ActiveLoansList
            loans={loans}
            settings={settings}
            onTriggerReturn={onTriggerReturn}
            onSendReminder={onSendReminder}
          />
        )}

        {/* Tab 2: Fines Ledger */}
        {activeTab === 'fines' && (
          <FineManagement
            loans={loans}
            settings={settings}
            onSettleFine={onSettleFine}
          />
        )}

        {/* Tab 3: Daily Operations Report */}
        {activeTab === 'report' && (
          <DailyReport
            loans={loans}
            books={books}
            members={members}
            settings={settings}
            onSendReminder={onSendReminder}
          />
        )}

        {/* Tab 4: Catalog & Stacks */}
        {activeTab === 'catalog' && (
          <BookCatalog
            books={books}
            activeLoans={loans}
            onIssueBook={onOpenIssueModal}
            onAddBook={onAddBook}
          />
        )}

        {/* Tab 5: Patron Directory */}
        {activeTab === 'members' && (
          <MemberDirectory
            members={members}
            loans={loans}
            onAddMember={onAddMember}
          />
        )}

      </main>

      {/* About & Contact Section at Bottom of Website */}
      <AboutContactFooter 
        libraryName={settings?.libraryName} 
        onSwitchRole={onSwitchToPatron} 
        currentRole="staff" 
      />

    </div>
  );
}
