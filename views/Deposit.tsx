
import React, { useState, useRef } from 'react';
import { 
  ArrowRight, 
  Copy, 
  Check, 
  Bitcoin, 
  Coins, 
  Loader2, 
  X,
  QrCode,
  Upload,
  ShieldCheck
} from 'lucide-react';
import { BackendService } from '../services/api';

const WALLETS = {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    address: 'bc1q9q5ukgqgz84dfmu4ascyfx22k7czlxlqf2dnqp',
    color: 'bg-orange-500',
    icon: Bitcoin,
    defaultAmount: '1000'
  },
  LTC: {
    name: 'Litecoin',
    symbol: 'LTC',
    address: 'ltc1ql0qe3zfsck6uwdzwlega674xgt2ffykw8exlnh',
    color: 'bg-blue-500',
    icon: Coins,
    defaultAmount: '1000'
  }
};

interface DepositProps {
  onComplete: () => void;
}

const Deposit: React.FC<DepositProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [selectedWallet, setSelectedWallet] = useState<keyof typeof WALLETS | null>(null);
  const [amount, setAmount] = useState('1000');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Storage for the actual File object and a Preview URL
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wallet = selectedWallet ? WALLETS[selectedWallet] : null;

  const handleCopy = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Max 5MB.");
        return;
      }
      setProofFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleConfirm = async () => {
    if (!wallet || !proofFile) return;
    setIsSubmitting(true);
    try {
      await BackendService.deposit(Number(amount), wallet.symbol, proofFile);
      onComplete();
    } catch (err: any) {
      alert(err.message || "Failed to submit deposit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'select') {
    return (
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Add Funds</h1>
          <p className="text-slate-500 mt-2">Fund your secure investment portfolio.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(WALLETS) as Array<keyof typeof WALLETS>).map((key) => {
            const w = WALLETS[key];
            return (
              <button
                key={key}
                onClick={() => { setSelectedWallet(key); setStep('details'); }}
                className="group bg-white p-8 rounded-3xl border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all text-left"
              >
                <div className={`${w.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 transform group-hover:scale-110 transition-transform`}>
                  <w.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{w.name}</h3>
                <div className="mt-8 flex items-center text-blue-600 font-bold">
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setStep('select')} className="text-slate-500 font-bold flex items-center hover:text-slate-900">
          <X className="mr-2 w-5 h-5" /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-6">Deposit Details</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Amount (USD)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 outline-none text-xl font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Copy {wallet?.symbol} Address</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 font-mono text-sm break-all">
                    {wallet?.address}
                  </div>
                  <button onClick={handleCopy} className="px-4 bg-slate-900 text-white rounded-2xl">
                    {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-4">Step 2: Upload Proof</h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${previewUrl ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-blue-500'}`}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
              {previewUrl ? (
                <img src={previewUrl} className="w-40 h-40 object-cover rounded-2xl shadow-md" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-slate-400 mb-2" />
                  <p className="text-sm font-bold">Click to upload screenshot</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl sticky top-24">
            <div className="flex justify-center mb-8"><QrCode className="w-32 h-32" /></div>
            <button 
              disabled={isSubmitting || !proofFile}
              onClick={handleConfirm}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <><ShieldCheck /> Confirm Deposit</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
