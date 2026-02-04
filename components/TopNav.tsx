
import React, { useState } from 'react';
import { Bell, Search, Menu, ChevronDown, Settings, User as UserIcon, LogOut } from 'lucide-react';
import { MOCK_USER, MOCK_NOTIFICATIONS } from '../constants';
import { View, User } from '../types';

interface TopNavProps {
  user: User | null;
  onMenuToggle: () => void;
  onViewChange: (view: View) => void;
}

const TopNav: React.FC<TopNavProps> = ({ user, onMenuToggle, onViewChange }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden text-slate-600" 
          onClick={onMenuToggle}
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search assets, transactions..." 
            className="pl-10 pr-4 py-2 w-64 rounded-full bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm text-slate-900"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-slate-600 hover:bg-slate-100 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-20 overflow-hidden animate-slideDown">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  <button className="text-xs text-blue-600 hover:underline">Mark all read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {MOCK_NOTIFICATIONS.map((n) => (
                    <div key={n.id} className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}>
                      <p className="text-sm font-medium text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2 uppercase font-semibold">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                  <button className="text-sm text-slate-600 font-medium hover:text-blue-600">View all activity</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
          >
            <img 
              src={user?.avatar || MOCK_USER.avatar} 
              alt="User" 
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold leading-none">{user?.name.split(' ')[0] || 'User'}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Verified</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 z-20 overflow-hidden p-2 animate-slideDown">
                <button 
                  onClick={() => {onViewChange('profile'); setShowProfileMenu(false);}}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-all text-sm font-medium"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  My Profile
                </button>
                <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-all text-sm font-medium">
                  <Settings className="w-4 h-4 text-slate-400" />
                  Security Settings
                </button>
                <hr className="my-2 border-slate-100" />
                <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-600 transition-all text-sm font-medium">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
