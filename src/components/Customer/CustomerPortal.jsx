import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Sparkles, LogOut, ArrowRightLeft, Clock, 
  RotateCcw, CreditCard, Heart, Search, CheckCircle2, 
  AlertTriangle, Bookmark, Star, MapPin, Layers, Calendar, ArrowRight, Phone
} from 'lucide-react';
import DigitalLibraryCard from './DigitalLibraryCard';
import PayFineModal from './PayFineModal';
import AboutContactFooter from '../Common/AboutContactFooter';
import { THEMES } from '../../data/initialBooks';
import { formatDate, getTodayStr, addDays, getDaysDifference } from '../../utils/dateUtils';
import { calculateFine } from '../../utils/fineCalculator';
import confetti from 'canvas-confetti';

export default function CustomerPortal({ 
  patron, 
  books, 
  loans, 
  settings, 
  onLogout, 
  onSwitchToStaff, 
  onBorrowBook, 
  onRenewLoan, 
  onReturnBook, 
  onPayFine 
}) {
  const [activeTab, setActiveTab] = useState('my-loans'); // 'my-loans', 'catalog', 'wishlist'
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [payingLoan, setPayingLoan] = useState(null);
  const [wishlist, setWishlist] = useState(['b-101', 'b-301']); // sample bookIds

  const todayStr = getTodayStr();
  const currency = settings?.currency || '₹';

  // Compute this patron's loans with live fines
  const myLoans = useMemo(() => {
    return loans
      .filter(l => l.memberId === patron.id)
      .map(l => {
        if (l.status === 'Returned') {
          return {
            ...l,
            isOverdue: false,
            overdueDays: 0,
            currentFine: l.fineAmount || 0
          };
        }
        const calc = calculateFine(l.dueDate, todayStr, settings?.finePerDay || 1.0, settings?.gracePeriodDays || 0);
        return {
          ...l,
          isOverdue: calc.isOverdue,
          overdueDays: calc.overdueDays,
          currentFine: calc.fineAmount
        };
      });
  }, [loans, patron.id, todayStr, settings]);

  const activeMyLoans = myLoans.filter(l => l.status !== 'Returned');
  const returnedMyLoans = myLoans.filter(l => l.status === 'Returned');
  const overdueMyLoans = activeMyLoans.filter(l => l.isOverdue);
  const totalMyFinesDue = overdueMyLoans.reduce((sum, l) => sum + l.currentFine, 0);

  // Toggle wishlist
  const toggleWishlist = (bookId) => {
    setWishlist(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  // Filtered Catalog
  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      if (selectedTheme !== 'all' && b.theme !== selectedTheme) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return b.title.toLowerCase().includes(q) || 
               b.author.toLowerCase().includes(q) || 
               b.isbn.toLowerCase().includes(q);
      }
      return true;
    });
  }, [books, selectedTheme, searchQuery]);

  const wishlistBooks = books.filter(b => wishlist.includes(b.id));

  // Handle Self Borrowing by Customer
  const handleBorrow = (book) => {
    if (activeMyLoans.length >= (settings?.maxBooksPerMember || 5)) {
      alert(`Borrowing limit reached (${settings?.maxBooksPerMember || 5} books maximum). Please return a book first.`);
      return;
    }
    if (book.availableCopies <= 0) {
      alert('This title is currently out of stock.');
      return;
    }

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}

    const newLoan = {
      id: `LN-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      bookId: book.id,
      bookTitle: book.title,
      bookIsbn: book.isbn,
      memberId: patron.id,
      memberName: patron.name,
      memberEmail: patron.email,
      issueDate: todayStr,
      dueDate: addDays(todayStr, settings?.loanDurationDays || 14),
      returnDate: null,
      status: 'Active',
      fineAmount: 0,
      finePaid: false,
      fineWaived: false,
      waiverReason: '',
      librarianNote: 'Self-checkout via Patron Digital Sanctuary'
    };

    onBorrowBook(newLoan, book.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar for Customer Portal */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-black text-lg text-white tracking-tight block leading-tight">
                  {settings?.libraryName || 'Athena Library'}
                </span>
                <span className="text-[11px] font-semibold text-amber-400 block tracking-wider uppercase">
                  Patron Sanctuary
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('my-loans')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'my-loans' 
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>My Active Loans</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-black/20 text-current">
                  {activeMyLoans.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'catalog' 
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Browse Thematic Catalog</span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'wishlist' 
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>My Saved ({wishlist.length})</span>
              </button>

              <a
                href="#contact-section"
                className="px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-white/5 transition-all flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact us</span>
              </a>
            </nav>

            {/* Profile & Switchers */}
            <div className="flex items-center gap-3">
              {/* Quick switch to staff */}
              <button
                onClick={onSwitchToStaff}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 transition-all"
                title="Switch to Librarian Staff Command Center"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Staff Portal</span>
              </button>

              {/* Patron Profile Pill */}
              <div className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-white/5 border border-white/10">
                <img
                  src={patron.avatar}
                  alt={patron.name}
                  className="w-8 h-8 rounded-xl object-cover border border-amber-400/40"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-white leading-tight">{patron.name}</p>
                  <p className="text-[10px] text-amber-300/80 font-mono">{patron.id}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                title="Log out of Patron Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around p-2 border-t border-white/10 bg-slate-900/90 text-xs">
          <button
            onClick={() => setActiveTab('my-loans')}
            className={`py-1.5 px-3 rounded-lg font-bold ${activeTab === 'my-loans' ? 'text-amber-400 bg-white/10' : 'text-slate-400'}`}
          >
            My Loans ({activeMyLoans.length})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-1.5 px-3 rounded-lg font-bold ${activeTab === 'catalog' ? 'text-amber-400 bg-white/10' : 'text-slate-400'}`}
          >
            Catalog
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-1.5 px-3 rounded-lg font-bold ${activeTab === 'wishlist' ? 'text-amber-400 bg-white/10' : 'text-slate-400'}`}
          >
            Wishlist ({wishlist.length})
          </button>
          <button
            onClick={onSwitchToStaff}
            className="py-1.5 px-2 rounded-lg text-indigo-300 font-bold"
          >
            Staff
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Hero & Digital Card Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Active Reader Session
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight">
              Hello, {patron.name.split(' ')[0]}! 📖
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              You currently have <span className="font-bold text-amber-300">{activeMyLoans.length} active volume(s)</span> checked out. Use your digital passport below for touchless desk scanning.
            </p>

            {/* Fines Warning Box if Any */}
            {totalMyFinesDue > 0 && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-200">Overdue Fine Outstanding</h4>
                    <p className="text-[11px] text-slate-300">
                      You have accrued {currency}{totalMyFinesDue.toFixed(2)} in late return fees.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPayingLoan(overdueMyLoans[0])}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 whitespace-nowrap transition-all"
                >
                  Pay Now Online
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <DigitalLibraryCard patron={patron} activeLoans={loans} settings={settings} />
          </div>
        </div>

        {/* TAB 1: My Active Loans */}
        {activeTab === 'my-loans' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span>My Active Borrowings ({activeMyLoans.length})</span>
                </h2>
                <p className="text-xs text-slate-400">Track scheduled due dates and renew loans before deadlines</p>
              </div>

              <button
                onClick={() => setActiveTab('catalog')}
                className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <span>+ Borrow Another Book</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeMyLoans.length === 0 ? (
              <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 text-amber-400 flex items-center justify-center mx-auto">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">No books currently borrowed</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Your shelf is empty! Explore our curated thematic catalog to find your next great read.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeMyLoans.map(loan => {
                  const daysLeft = getDaysDifference(todayStr, loan.dueDate);
                  const isLate = loan.isOverdue;

                  return (
                    <div 
                      key={loan.id}
                      className="glass-panel p-5 rounded-3xl border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between glow-card relative overflow-hidden"
                    >
                      {/* Top banner */}
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                            {loan.id}
                          </span>
                          {isLate ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                              OVERDUE ({loan.overdueDays}d)
                            </span>
                          ) : daysLeft <= 2 ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Due in {daysLeft} day(s)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              On Time ({daysLeft}d left)
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif font-bold text-white text-base leading-snug">
                          {loan.bookTitle}
                        </h3>
                        <p className="text-xs font-mono text-slate-400 mt-1">ISBN: {loan.bookIsbn}</p>

                        <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 text-xs">
                          <div className="flex justify-between text-slate-400">
                            <span>Issue Date:</span>
                            <span className="text-slate-200">{formatDate(loan.issueDate)}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Scheduled Due:</span>
                            <span className={`font-semibold ${isLate ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                              {formatDate(loan.dueDate)}
                            </span>
                          </div>
                          {isLate && (
                            <div className="flex justify-between pt-1 border-t border-white/10 text-rose-400 font-mono font-bold">
                              <span>Accrued Fine:</span>
                              <span>{currency}{loan.currentFine.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-5 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                        {isLate ? (
                          <button
                            onClick={() => setPayingLoan(loan)}
                            className="col-span-2 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Fine ({currency}{loan.currentFine.toFixed(2)})</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onRenewLoan(loan.id)}
                            className="py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 font-semibold border border-amber-400/20 text-center transition-all"
                            title="Extend due date by 7 days"
                          >
                            Renew (+7d)
                          </button>
                        )}

                        <button
                          onClick={() => onReturnBook(loan)}
                          className={`py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1 shadow-sm transition-all ${
                            isLate ? 'col-span-2' : ''
                          }`}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Return Book</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Reading History Collapsible Section */}
            {returnedMyLoans.length > 0 && (
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Previously Returned Books ({returnedMyLoans.length})
                </h3>
                <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
                  <div className="divide-y divide-white/5">
                    {returnedMyLoans.map(loan => (
                      <div key={loan.id} className="p-3.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-serif font-bold text-white">{loan.bookTitle}</p>
                          <p className="text-[11px] text-slate-400">Returned on: {formatDate(loan.returnDate)}</p>
                        </div>
                        <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Returned Clean
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Browse Thematic Catalog */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <span>Curated Thematic Stacks</span>
                </h2>
                <p className="text-xs text-slate-400">Browse and borrow volumes directly to your account</p>
              </div>

              {/* Search input */}
              <div className="relative sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search titles, authors, ISBN..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Theme filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {THEMES.map(theme => {
                const isSelected = selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span>{theme.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map(book => {
                const isAvailable = book.availableCopies > 0;
                const isWishlisted = wishlist.includes(book.id);

                return (
                  <div
                    key={book.id}
                    className="glass-panel rounded-3xl border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between overflow-hidden glow-card"
                  >
                    {/* Cover Banner */}
                    <div className={`h-24 bg-gradient-to-r ${book.coverGradient || 'from-indigo-700 to-slate-900'} p-3.5 flex justify-between relative`}>
                      <span className="font-mono text-[10px] uppercase text-white/90 bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm self-start">
                        {book.isbn}
                      </span>
                      <button
                        onClick={() => toggleWishlist(book.id)}
                        className={`p-1.5 rounded-full backdrop-blur-sm transition-transform hover:scale-110 ${
                          isWishlisted ? 'bg-rose-500 text-white' : 'bg-black/30 text-white/80 hover:text-white'
                        }`}
                        title={isWishlisted ? 'Remove from saved' : 'Save to wishlist'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="flex items-center gap-1 font-mono">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            {book.shelfLocation}
                          </span>
                          <span className="flex items-center gap-1 text-amber-300 font-bold">
                            <Star className="w-3 h-3 fill-amber-300" />
                            {book.rating}
                          </span>
                        </div>

                        <h4 className="font-serif font-bold text-white text-sm line-clamp-2 leading-snug">
                          {book.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">{book.author}</p>
                        <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{book.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className={`text-[11px] font-semibold ${isAvailable ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isAvailable ? `${book.availableCopies} in stock` : 'Out of stock'}
                        </span>

                        <button
                          onClick={() => handleBorrow(book)}
                          disabled={!isAvailable}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isAvailable
                              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                              : 'bg-white/5 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Borrow
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Saved Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              <span>My Saved Books ({wishlistBooks.length})</span>
            </h2>

            {wishlistBooks.length === 0 ? (
              <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center">
                <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No saved books yet</h3>
                <p className="text-xs text-slate-400 mt-1">Tap the heart on any book in the catalog to save it for later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistBooks.map(book => (
                  <div key={book.id} className="glass-panel p-4 rounded-3xl border border-white/10 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-white text-sm truncate">{book.title}</h4>
                      <p className="text-xs text-slate-400">{book.author}</p>
                      <span className="text-[11px] text-amber-300 font-mono mt-1 block">{book.shelfLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleBorrow(book)}
                        disabled={book.availableCopies <= 0}
                        className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl disabled:opacity-40"
                      >
                        Borrow
                      </button>
                      <button
                        onClick={() => toggleWishlist(book.id)}
                        className="p-1.5 text-rose-400 hover:text-white"
                        title="Remove"
                      >
                        <Heart className="w-4 h-4 fill-rose-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Online Fine Payment Modal */}
      {payingLoan && (
        <PayFineModal
          isOpen={Boolean(payingLoan)}
          onClose={() => setPayingLoan(null)}
          loan={payingLoan}
          settings={settings}
          onPaymentSuccess={onPayFine}
        />
      )}

      {/* About & Contact Section at Bottom of Website */}
      <AboutContactFooter 
        libraryName={settings?.libraryName} 
        onSwitchRole={onSwitchToStaff} 
        currentRole="customer" 
      />

    </div>
  );
}
