
import { User, Transaction, InvestmentPlan } from '../types';

/**
 * BackendService - Production API Client
 * This service communicates directly with your cPanel PHP backend.
 */

const API_BASE = 'api'; // Path relative to your index.html / app root
const SESSION_USER_KEY = 'nexus_session_user';

export const BackendService = {
  // Initialization - No longer populates mock data
  init: () => {
    console.info("NexusInvest API Service Initialized");
  },

  // Auth: Persists session locally but validates via API
  login: async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_BASE}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login Failed');
    }

    const user = await response.json();
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    return user;
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_BASE}/signup.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration Failed');
    }

    const user = await response.json();
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(SESSION_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const raw = localStorage.getItem(SESSION_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  // DATA FETCHING
  getTransactions: async (): Promise<Transaction[]> => {
    const user = BackendService.getCurrentUser();
    if (!user) return [];

    const response = await fetch(`${API_BASE}/transactions.php?user_id=${user.id}`);
    if (!response.ok) return [];
    
    return await response.json();
  },

  // FINANCIAL ACTIONS - Using FormData for binary uploads
  deposit: async (amount: number, method: string, proofFile: File) => {
    const user = BackendService.getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const formData = new FormData();
    formData.append('user_id', user.id);
    formData.append('amount', amount.toString());
    formData.append('method', method);
    formData.append('proof_image', proofFile); // Binary File Object

    const response = await fetch(`${API_BASE}/deposit.php`, {
      method: 'POST',
      body: formData // Fetch sets content-type to multipart/form-data automatically
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Server rejected deposit");
    }

    return await response.json();
  },

  withdraw: async (amount: number, walletAddress: string) => {
    const user = BackendService.getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const response = await fetch(`${API_BASE}/withdraw.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, amount, wallet_address: walletAddress })
    });

    if (!response.ok) throw new Error("Withdrawal failed");
    return await response.json();
  },

  subscribeToPlan: async (plan: InvestmentPlan, amount: number) => {
    const user = BackendService.getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const response = await fetch(`${API_BASE}/subscribe.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, plan_id: plan.id, amount })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Subscription failed");
    }

    const result = await response.json();
    // Update local user session with new balance
    if (result.user) localStorage.setItem(SESSION_USER_KEY, JSON.stringify(result.user));
    return result;
  }
};
