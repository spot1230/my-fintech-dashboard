
import React, { useState } from 'react';
import { User } from '../types';
import { Wallet, ArrowUpRight, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { BackendService } from '../services/api';

interface WithdrawProps {
  user: User;
  onComplete: () => void;
}

const Withdraw: React.FC<WithdrawProps> = ({ user, onComplete }) => {
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) return;
    if (!walletAddress || walletAddress.length < 10) {
      setError('Please enter a valid crypto wallet address.');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    try {
      await BackendService.withdraw(Number(amount), walletAddress);
      // Feedback loop before closing
      onComplete();
    } catch (err: any) {
      setError(err.message || "Withdrawal failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Withdraw Funds</h1>
        <p className="text-slate-500 mt-2">Submit a request to withdraw your available balance to your wallet.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-2xl mb-8">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Available Balance</p>
            <p className="text-2xl font-bold">${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <Wallet className="w-10 h-10 text-blue-500 opacity-50" />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount to Withdraw (USD)</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
              <input 
                type="number" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-20 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none text-xl font-bold transition-all text-slate-900 placeholder:text-slate-300"
              />
              <button 
                onClick={() => setAmount(String(user.balance))}
                className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Destination Wallet Address</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Paste your BTC/LTC address here"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none text-sm font-mono transition-all text-slate-900 placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-blue-800 font-bold uppercase mb-1">Pending Verification</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Withdrawal requests are processed manually by our finance team. Your balance will remain unchanged until the transaction is approved.
              </p>
            </div>
          </div>

          <button 
            disabled={isSubmitting || !amount || !walletAddress || Number(amount) > user.balance || Number(amount) <= 0}
            onClick={handleWithdraw}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Request Withdrawal <ArrowUpRight className="w-5 h-5" /></>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
