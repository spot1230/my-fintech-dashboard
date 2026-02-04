
import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  History, 
  User, 
  PlusCircle, 
  ArrowUpCircle, 
  LogOut,
  X,
  CreditCard
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isSidebarOpen: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isSidebarOpen, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'profile', label: 'My Account', icon: User },
  ];

  const actionItems = [
    { id: 'deposit', label: 'Add Funds', icon: PlusCircle, color: 'text-emerald-600' },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowUpCircle, color: 'text-amber-600' },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">NexusInvest</span>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => {}}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                ${currentView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          <div className="pt-8 mb-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Transactions</p>
            {actionItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                  ${currentView === item.id 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Card / Logout */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-red-950/30 hover:text-red-400 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
