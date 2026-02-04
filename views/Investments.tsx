
import React, { useState } from 'react';
import { INVESTMENT_PLANS } from '../constants';
import { Shield, Clock, TrendingUp, ChevronRight, Zap, X, AlertCircle, Loader2, Wallet, ArrowRight } from 'lucide-react';
import { User, InvestmentPlan } from '../types';
import { BackendService } from '../services/api';

interface InvestmentsProps {
  user: User;
  onComplete: () => void;
}

const Investments: React.FC<InvestmentsProps> = ({ user, onComplete }) => {
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    if (!selectedPlan || !amount || Number(amount) <= 0) return;
    
    setError('');
    setIsSubmitting(true);
    try {
      await BackendService.subscribeToPlan(selectedPlan, Number(amount));
      setSelectedPlan(null);
      setAmount('');
      onComplete();
    } catch (err: any) {
      setError(err.message || "Failed to subscribe to plan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">Investment Plans</h1>
        <p className="text-slate-500 mt-2">Choose a strategy that fits your financial goals. All plans are protected by Nexus Insurance™.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {INVESTMENT_PLANS.map((plan) => (
          <div key={plan.id} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full transform transition-all group-hover:-translate-y-2">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl ${
                  plan.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  plan.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  'bg-indigo-50 text-indigo-600'
                }`}>
                  <Zap className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  plan.risk === 'Low' ? 'bg-emerald-50 text-emerald-700' :
                  plan.risk === 'Medium' ? 'bg-blue-50 text-blue-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {plan.risk} Risk
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-blue-600">{plan.roi.split(' - ')[1]}</span>
                <span className="text-slate-500 font-medium">ROI p.a.</span>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Duration</p>
                    <p className="text-sm font-semibold text-slate-700">{plan.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Entry Range</p>
                    <p className="text-sm font-semibold text-slate-700">${plan.minAmount.toLocaleString()} - ${plan.maxAmount >= 1000000 ? 'Unlimited' : plan.maxAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Insurance</p>
                    <p className="text-sm font-semibold text-slate-700">Covered up to 85%</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedPlan(plan);
                  setAmount(String(plan.minAmount));
                  setError('');
                }}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
                  plan.color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' :
                  plan.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' :
                  'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                Subscribe Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="z-10">
          <h4 className="text-xl font-bold">Need a custom strategy?</h4>
          <p className="text-slate-400 mt-2">Our financial advisors can build a portfolio tailored to your unique lifestyle and goals.</p>
        </div>
        <button className="z-10 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center gap-2 whitespace-nowrap">
          Contact Advisor <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Subscription Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPlan(null)}></div>
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full animate-zoomIn">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-blue-50 text-blue-600`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Subscribe to {selectedPlan.name}</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{selectedPlan.risk} Risk Plan</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Available Verified Balance</p>
                  <p className="text-lg font-bold text-slate-900">${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <Wallet className="w-6 h-6 text-slate-300" />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Investment Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-blue-500 outline-none transition-all text-xl font-bold text-slate-900"
                  />
                </div>
                <div className="flex justify-between px-1">
                  <p className="text-[10px] text-slate-400 font-bold">MIN: ${selectedPlan.minAmount.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 font-bold">MAX: ${selectedPlan.maxAmount >= 1000000 ? 'Unlimited' : selectedPlan.maxAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-blue-800">Projected Returns</span>
                  <span className="text-xs font-bold text-blue-800">{selectedPlan.roi}</span>
                </div>
                <p className="text-[10px] text-blue-600 leading-relaxed">
                  Your funds will be moved to active investments and locked for {selectedPlan.duration}. Profit is calculated and credited monthly.
                </p>
              </div>

              <button 
                disabled={isSubmitting || !amount || Number(amount) <= 0 || Number(amount) > user.balance}
                onClick={handleSubscribe}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Confirm Subscription
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;
