import React, { useState, useEffect } from 'react';
import AuthGateway from './components/Auth/AuthGateway';
import CustomerPortal from './components/Customer/CustomerPortal';
import StaffPortal from './components/Staff/StaffPortal';
import IssueBookModal from './components/Circulation/IssueBookModal';
import ReturnBookModal from './components/Circulation/ReturnBookModal';
import ReturnReceiptModal from './components/Circulation/ReturnReceiptModal';
import SettingsModal from './components/Settings/SettingsModal';
import Toast from './components/Common/Toast';
import { 
  initializeAppData, 
  saveToStorage, 
  loadFromStorage,
  resetToDemoData, 
  STORAGE_KEYS 
} from './utils/storage';
import { calculateFine } from './utils/fineCalculator';
import { getTodayStr, addDays } from './utils/dateUtils';
import { STAFF_ACCOUNTS } from './data/staffAccounts';
import confetti from 'canvas-confetti';

const AUTH_STORAGE_KEY = 'athena_auth_session';

export default function App() {
  const [data, setData] = useState(() => initializeAppData());
  
  // Authentication session: { role: 'staff' | 'customer', user: object } | null
  const [auth, setAuth] = useState(() => {
    return loadFromStorage(AUTH_STORAGE_KEY, null);
  });

  // Modals state
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueBookPreselect, setIssueBookPreselect] = useState(null);

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnLoanPreselect, setReturnLoanPreselect] = useState(null);

  const [receiptData, setReceiptData] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const { books, members, loans, settings } = data;

  // Persist auth session
  useEffect(() => {
    saveToStorage(AUTH_STORAGE_KEY, auth);
  }, [auth]);

  // Auth actions
  const handleLogin = (authSession) => {
    setAuth(authSession);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
    showToast(
      'success', 
      authSession.role === 'staff' ? 'Staff Clearance Granted' : 'Welcome to Patron Sanctuary',
      `Logged in as ${authSession.user.name}.`
    );
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    showToast('info', 'Session Ended', 'You have securely signed out.');
  };

  const handleSwitchToStaff = () => {
    setAuth({
      role: 'staff',
      user: STAFF_ACCOUNTS[0]
    });
    showToast('info', 'Staff View Active', 'Switched to Librarian & Staff Command Center.');
  };

  const handleSwitchToPatron = () => {
    setAuth({
      role: 'customer',
      user: members[0]
    });
    showToast('info', 'Customer View Active', 'Switched to Patron Sanctuary Portal.');
  };

  // Circulation Handlers
  const handleIssueBook = (newLoan, bookId) => {
    const updatedBooks = books.map(b => {
      if (b.id === bookId) {
        return { ...b, availableCopies: Math.max(0, b.availableCopies - 1) };
      }
      return b;
    });

    const updatedLoans = [newLoan, ...loans];

    saveToStorage(STORAGE_KEYS.BOOKS, updatedBooks);
    saveToStorage(STORAGE_KEYS.LOANS, updatedLoans);

    setData(prev => ({ ...prev, books: updatedBooks, loans: updatedLoans }));
    showToast('success', 'Book Issued Successfully', `"${newLoan.bookTitle}" checked out to ${newLoan.memberName}. Due: ${newLoan.dueDate}.`);
  };

  const handleReturnBook = (returnPayload, originalLoan) => {
    const updatedBooks = books.map(b => {
      if (b.id === returnPayload.bookId) {
        return { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) };
      }
      return b;
    });

    const updatedLoans = loans.map(l => {
      if (l.id === returnPayload.loanId) {
        return {
          ...l,
          status: 'Returned',
          returnDate: returnPayload.returnDate,
          fineAmount: returnPayload.fineAmount,
          finePaid: returnPayload.finePaid,
          fineWaived: returnPayload.fineWaived,
          paymentMethod: returnPayload.paymentMethod,
          waiverReason: returnPayload.waiverReason,
          librarianNote: returnPayload.librarianNote
        };
      }
      return l;
    });

    saveToStorage(STORAGE_KEYS.BOOKS, updatedBooks);
    saveToStorage(STORAGE_KEYS.LOANS, updatedLoans);

    setData(prev => ({ ...prev, books: updatedBooks, loans: updatedLoans }));

    // Show receipt
    setReceiptData({
      loan: originalLoan,
      ...returnPayload
    });

    showToast('success', 'Book Returned', `"${originalLoan.bookTitle}" has been returned into the library stacks.`);
  };

  const handleRenewLoan = (loanId) => {
    const updatedLoans = loans.map(l => {
      if (l.id === loanId) {
        const newDue = addDays(l.dueDate, 7);
        return {
          ...l,
          dueDate: newDue,
          librarianNote: `${l.librarianNote || ''} [Renewed +7d on ${getTodayStr()}]`
        };
      }
      return l;
    });

    saveToStorage(STORAGE_KEYS.LOANS, updatedLoans);
    setData(prev => ({ ...prev, loans: updatedLoans }));
    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch {}
    showToast('success', 'Loan Renewed', 'Due date extended by 7 days.');
  };

  const handlePayFineOnline = ({ loanId, amount, method }) => {
    const updatedLoans = loans.map(l => {
      if (l.id === loanId) {
        return {
          ...l,
          finePaid: true,
          paymentMethod: method,
          librarianNote: `${l.librarianNote || ''} [Paid online via ${method} on ${getTodayStr()}]`
        };
      }
      return l;
    });

    saveToStorage(STORAGE_KEYS.LOANS, updatedLoans);
    setData(prev => ({ ...prev, loans: updatedLoans }));
    showToast('success', 'Fine Paid Online', `${settings.currency}${amount.toFixed(2)} settled via ${method}. Account cleared!`);
  };

  const handleSettleFine = ({ loanId, action, method, reason, amount }) => {
    const updatedLoans = loans.map(l => {
      if (l.id === loanId) {
        return {
          ...l,
          finePaid: action === 'pay',
          fineWaived: action === 'waive',
          paymentMethod: action === 'pay' ? method : null,
          waiverReason: action === 'waive' ? reason : null
        };
      }
      return l;
    });

    saveToStorage(STORAGE_KEYS.LOANS, updatedLoans);
    setData(prev => ({ ...prev, loans: updatedLoans }));
    showToast('info', 'Fine Settled', `Fine of ${settings.currency}${amount.toFixed(2)} recorded as ${action === 'pay' ? `Paid via ${method}` : `Waived (${reason})`}.`);
  };

  const handleAddBook = (newBook) => {
    const updatedBooks = [newBook, ...books];
    saveToStorage(STORAGE_KEYS.BOOKS, updatedBooks);
    setData(prev => ({ ...prev, books: updatedBooks }));
    showToast('success', 'Book Added to Catalog', `"${newBook.title}" registered in shelf ${newBook.shelfLocation}.`);
  };

  const handleAddMember = (newMember) => {
    const updatedMembers = [newMember, ...members];
    saveToStorage(STORAGE_KEYS.MEMBERS, updatedMembers);
    setData(prev => ({ ...prev, members: updatedMembers }));
    showToast('success', 'Patron Registered', `${newMember.name} (${newMember.id}) registered.`);
  };

  const handleSaveSettings = (newSettings) => {
    saveToStorage(STORAGE_KEYS.SETTINGS, newSettings);
    setData(prev => ({ ...prev, settings: newSettings }));
    showToast('success', 'Settings Updated', 'Library circulation rules and policies updated successfully.');
  };

  const handleResetDemoData = () => {
    const fresh = resetToDemoData();
    setData(fresh);
    showToast('info', 'Factory Reset Complete', 'All books, loans, and patron records restored to initial demo state.');
  };

  const handleSendReminder = (loan) => {
    showToast('info', 'Overdue Reminder Sent', `Official return reminder notification dispatched to ${loan.memberName} (${loan.memberEmail}).`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. If not logged in -> Display Auth Gateway & Login Templates */}
      {!auth && (
        <AuthGateway
          members={members}
          settings={settings}
          onLogin={handleLogin}
          onRegisterPatron={handleAddMember}
        />
      )}

      {/* 2. If logged in as Customer / Patron -> Dedicated Customer Portal */}
      {auth && auth.role === 'customer' && (
        <CustomerPortal
          patron={auth.user}
          books={books}
          loans={loans}
          settings={settings}
          onLogout={handleLogout}
          onSwitchToStaff={handleSwitchToStaff}
          onBorrowBook={handleIssueBook}
          onRenewLoan={handleRenewLoan}
          onReturnBook={(loan) => {
            setReturnLoanPreselect(loan);
            setIsReturnModalOpen(true);
          }}
          onPayFine={handlePayFineOnline}
        />
      )}

      {/* 3. If logged in as Worker / Librarian -> Dedicated Staff Command Center */}
      {auth && auth.role === 'staff' && (
        <StaffPortal
          staffUser={auth.user}
          books={books}
          loans={loans}
          members={members}
          settings={settings}
          onLogout={handleLogout}
          onSwitchToPatron={handleSwitchToPatron}
          onOpenIssueModal={() => {
            setIssueBookPreselect(null);
            setIsIssueModalOpen(true);
          }}
          onOpenReturnModal={() => {
            setReturnLoanPreselect(null);
            setIsReturnModalOpen(true);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onTriggerReturn={(loan) => {
            setReturnLoanPreselect(loan);
            setIsReturnModalOpen(true);
          }}
          onSendReminder={handleSendReminder}
          onSettleFine={handleSettleFine}
          onAddBook={handleAddBook}
          onAddMember={handleAddMember}
        />
      )}

      {/* Shared Issue Book Modal */}
      <IssueBookModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        preselectedBook={issueBookPreselect}
        books={books}
        members={members}
        activeLoans={loans}
        onConfirmIssue={handleIssueBook}
        settings={settings}
      />

      {/* Shared Return Book Modal with live fine calculation */}
      <ReturnBookModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        preselectedLoan={returnLoanPreselect}
        activeLoans={loans}
        onConfirmReturn={handleReturnBook}
        settings={settings}
      />

      {/* Return Receipt Slip Voucher */}
      {receiptData && (
        <ReturnReceiptModal
          receiptData={receiptData}
          onClose={() => setReceiptData(null)}
          settings={settings}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onResetDemoData={handleResetDemoData}
      />

      {/* Global Animated Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
