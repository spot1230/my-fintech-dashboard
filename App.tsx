
import React, { useState, useCallback, useEffect } from 'react';
import Dashboard from './views/Dashboard';
import Investments from './views/Investments';
import Transactions from './views/Transactions';
import Profile from './views/Profile';
import Deposit from './views/Deposit';
import Withdraw from './views/Withdraw';
import LoginPage from './views/LoginPage';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import { View, User, Transaction } from './types';
import { BackendService } from './services/api';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // App State
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadInitialData = useCallback(async () => {
    BackendService.init();
    const sessionUser = BackendService.getCurrentUser();
    if (sessionUser) {
      setUser(sessionUser);
      const txs = await BackendService.getTransactions();
      setTransactions(txs);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const refreshData = useCallback(async () => {
    const updatedUser = BackendService.getCurrentUser();
    const updatedTxs = await BackendService.getTransactions();
    setUser(updatedUser);
    setTransactions(updatedTxs);
  }, []);

  const handleLogin = useCallback(async (loggedInUser: User) => {
    setUser(loggedInUser);
    const txs = await BackendService.getTransactions();
    setTransactions(txs);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    BackendService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setTransactions([]);
    setCurrentView('dashboard');
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Initializing Secure Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderView = () => {
    if (!user) return null;

    switch (currentView) {
      case 'dashboard': 
        return <Dashboard user={user} transactions={transactions} />;
      case 'investments': 
        return <Investments user={user} onComplete={() => { refreshData(); setCurrentView('dashboard'); }} />;
      case 'transactions': 
        return <Transactions transactions={transactions} />;
      case 'profile': 
        return <Profile user={user} />;
      case 'deposit': 
        return <Deposit onComplete={() => { refreshData(); setCurrentView('dashboard'); }} />;
      case 'withdraw': 
        return <Withdraw user={user} onComplete={() => { refreshData(); setCurrentView('dashboard'); }} />;
      default: 
        return <Dashboard user={user} transactions={transactions} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        currentView={currentView} 
        setCurrentView={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        isSidebarOpen={isSidebarOpen}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNav 
          user={user}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          onViewChange={setCurrentView}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fadeIn">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
