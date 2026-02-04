
export type View = 'dashboard' | 'investments' | 'transactions' | 'profile' | 'deposit' | 'withdraw';

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  activeInvestments: number;
  totalProfit: number;
  avatar: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'profit' | 'investment';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  walletAddress?: string; // Optional field for withdrawal destinations
  proofImage?: string; // Base64 encoded screenshot of payment
}

export interface InvestmentPlan {
  id: string;
  name: string;
  roi: string;
  duration: string;
  minAmount: number;
  maxAmount: number;
  risk: 'Low' | 'Medium' | 'High';
  color: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}
