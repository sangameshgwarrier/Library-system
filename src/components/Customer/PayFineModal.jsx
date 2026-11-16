import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, QrCode, Smartphone, ArrowRight, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PayFineModal({ isOpen, onClose, loan, onPaymentSuccess, settings }) {
  const [method, setMethod] = useState('card'); // card, upi, campus
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !loan) return null;

  const fineAmount = Number(loan.currentFine || loan.fineAmount || 0);
  const currency = settings?.currency || '₹';

  const handlePaySubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      onPaymentSuccess({
        loanId: loan.id,
        amount: fineAmount,
        method: method === 'card' ? 'Credit Card (Online)' : (method === 'upi' ? 'UPI / QR Transfer' : 'Campus Student Account')
      });
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="glass-panel max-w-md w-full p-6 sm:p-7 rounded-3xl border border-amber-500/30 shadow-2xl space-y-5 glow-card">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">Online Fine Clearance</h3>
              <p className="text-[11px] text-slate-400">Secure 256-bit patron payment portal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loan & Fine Summary Box */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex justify-between items-start text-xs">
            <div>
              <p className="font-bold text-white font-serif">{loan.bookTitle}</p>
              <p className="text-[11px] text-slate-400 font-mono">Loan ID: {loan.id}</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {loan.overdueDays || 0}d Overdue
            </span>
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">Total Fine Balance:</span>
            <span className="font-mono font-black text-xl text-amber-400">
              {currency}{fineAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">Select Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setMethod('card')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                method === 'card' 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Card</span>
            </button>
            <button
              type="button"
              onClick={() => setMethod('upi')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                method === 'upi' 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>UPI / QR</span>
            </button>
            <button
              type="button"
              onClick={() => setMethod('campus')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                method === 'campus' 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Campus ID</span>
            </button>
          </div>

          {method === 'card' && (
            <div className="space-y-2 pt-2">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                placeholder="Card Number"
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  defaultValue="12/28"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  placeholder="MM/YY"
                />
                <input
                  type="password"
                  defaultValue="•••"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  placeholder="CVC"
                />
              </div>
            </div>
          )}

          {method === 'upi' && (
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center space-y-2">
              <div className="w-24 h-24 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                <QrCode className="w-20 h-20 text-slate-900" />
              </div>
              <p className="text-[11px] text-amber-300 font-mono">Scan via GPay, PhonePe or Apple Wallet</p>
            </div>
          )}

          {method === 'campus' && (
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-xs space-y-1">
              <p className="font-semibold text-slate-300">University Dining / Library Account</p>
              <p className="text-[11px] text-slate-400">Deduct directly from student meal / library credits balance.</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handlePaySubmit}
          disabled={isProcessing}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
        >
          {isProcessing ? (
            <span>Processing Transaction...</span>
          ) : (
            <>
              <span>Authorize & Pay {currency}{fineAmount.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
