
import React from 'react';
import { User } from '../types';
import { Camera, Shield, Mail, Phone, Lock, Eye, CheckCircle } from 'lucide-react';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Summary */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-blue-50"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg border-2 border-white hover:bg-blue-700 transition-all">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-4">{user.name}</h2>
            <p className="text-slate-500 text-sm">Wealth Manager Tier • Since 2021</p>
            
            <div className="mt-6 w-full pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-sm font-bold text-slate-900">124</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Investments</p>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="text-center flex-1">
                <p className="text-sm font-bold text-slate-900">99.8%</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Uptime</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" /> Account Verification
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Email Address</span>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Phone Number</span>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Identity (KYC)</span>
                <button className="text-xs font-bold text-blue-600">Complete Now</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user.name}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user.email}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                <input 
                  type="tel" 
                  defaultValue="+1 (555) 0123-4567"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-900"
                />
              </div>
            </div>
            <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              Save Changes
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Security & Password</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300 transition-all">Enable</button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Current Password</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-900"
                      />
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-900"
                    />
                  </div>
                </div>
                <button className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
