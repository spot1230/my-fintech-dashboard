
import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, User as UserIcon } from 'lucide-react';
import { BackendService } from '../services/api';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isSignUp) {
        const user = await BackendService.signup(name, email, password);
        onLogin(user);
      } else {
        const user = await BackendService.login(email, password);
        onLogin(user);
      }
    } catch (err: any) {
      if (err.message === 'ACCOUNT_NOT_FOUND') {
        setError('Email not found. Redirecting to create account...');
        setTimeout(() => {
          setIsSignUp(true);
          setError('');
        }, 1500);
      } else if (err.message === 'INVALID_PASSWORD') {
        setError('Incorrect password. Please try again.');
      } else if (err.message === 'ALREADY_EXISTS') {
        setError('An account with this email already exists.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-inter animate-fadeIn">
      <div className="w-full lg:w-[480px] flex flex-col justify-center p-8 md:p-16 relative z-10 bg-white">
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-8 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">NexusInvest</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isSignUp ? 'Create Account' : 'Secure Login'}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {isSignUp ? 'Join the world\'s most advanced investment platform.' : 'Enter your credentials to manage your wealth.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-bounce">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div className="space-y-2 animate-slideDown">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
              {!isSignUp && <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Forgot password?</button>}
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : (
              <>{isSignUp ? 'Create My Account' : 'Sign In'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 font-medium">
            {isSignUp ? 'Already have an account?' : 'New to NexusInvest?'} 
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 font-bold hover:underline ml-2"
            >
              {isSignUp ? 'Sign In' : 'Create an account'}
            </button>
          </p>
        </div>

        <div className="mt-auto pt-12 flex items-center justify-center space-x-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest">SSL Securely Encrypted</span>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1950&q=80" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/90 to-blue-900/50"></div>
        </div>
        <div className="relative z-10 p-16 max-w-2xl text-white">
          <h2 className="text-5xl font-extrabold leading-tight mb-6">Build your future, one investment at a time.</h2>
          <p className="text-xl text-slate-300">Demo Account Available:<br/>Email: spot1uc001@gmail.com<br/>Password: uchenna</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
