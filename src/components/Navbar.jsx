import React from 'react';
import { 
  BookOpen, RotateCcw, DollarSign, FileText, Users, 
  Plus, Settings, Library, AlertTriangle, ArrowRight, Menu, X
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  activeLoansCount, 
  overdueCount, 
  onOpenIssueModal, 
  onOpenReturnModal, 
  onOpenSettings,
  libraryName 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'catalog', label: 'Catalog & Themes', icon: BookOpen },
    { 
      id: 'circulation', 
      label: 'Circulation', 
      icon: RotateCcw,
      badge: activeLoansCount > 0 ? activeLoansCount : null,
      badgeColor: 'bg-indigo-100 text-indigo-700'
    },
    { 
      id: 'fines', 
      label: 'Fines Ledger', 
      icon: DollarSign,
      badge: overdueCount > 0 ? overdueCount : null,
      badgeColor: 'bg-rose-100 text-rose-700 font-bold'
    },
    { id: 'report', label: 'Daily Report', icon: FileText },
    { id: 'members', label: 'Patrons', icon: Users }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentTab('catalog')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif font-black text-xl text-slate-900 tracking-tight block leading-tight">
                {libraryName || 'Athena Library'}
              </span>
              <span className="text-[11px] font-medium text-slate-400 block tracking-wide uppercase">
                Catalog & Circulation
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenReturnModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Return Book</span>
            </button>

            <button
              onClick={onOpenIssueModal}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Book</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="System Settings & Rules"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenIssueModal}
              className="p-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              title="Issue Book"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 animate-fade-in">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onOpenReturnModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-center"
            >
              Return Book
            </button>
            <button
              onClick={() => {
                onOpenSettings();
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-xl text-slate-500 bg-slate-100"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

