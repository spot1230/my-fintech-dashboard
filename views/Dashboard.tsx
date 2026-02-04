
import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  DollarSign, 
  Activity,
  ArrowRight,
  Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_DATA } from '../constants';
import { User, Transaction } from '../types';

interface DashboardProps {
  user: User;
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, transactions }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name}!</h1>
          <p className="text-slate-500 mt-1">Here's a quick look at your wealth performance.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl text-xs font-bold">
          <Clock className="w-4 h-4" />
          Pending updates: {transactions.filter(t => t.status === 'pending').length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +12.5%
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500">Total Balance</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-bold text-slate-900">${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold">Verified Balance</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="flex items-center text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-full">
              {user.activeInvestments > 0 ? 'Active' : 'No Active Plans'}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500">Active Investments</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">${user.activeInvestments.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
              Total ROI
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500">Total Profits</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">+${user.totalProfit.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Portfolio Performance</h3>
              <p className="text-xs text-slate-500">Net growth based on latest entries</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            <p className="text-xs text-slate-500 mt-1">Your latest financial movements</p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-2">
            {transactions.slice(0, 8).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{tx.description}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                  </p>
                  <p className={`text-[10px] uppercase font-bold ${tx.status === 'pending' ? 'text-amber-500' : 'text-slate-400'}`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
