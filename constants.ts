
import { InvestmentPlan, Transaction, Notification } from './types';

export const MOCK_USER = {
  id: 'usr_1',
  name: 'Alexander Pierce',
  email: 'alex.pierce@nexusinvest.com',
  balance: 128450.75,
  activeInvestments: 45000.00,
  totalProfit: 8240.20,
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};

export const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: 'plan_1',
    name: 'Starter Yield',
    roi: '8% - 12%',
    duration: '3 Months',
    minAmount: 500,
    maxAmount: 5000,
    risk: 'Low',
    color: 'emerald'
  },
  {
    id: 'plan_2',
    name: 'Growth Alpha',
    roi: '15% - 22%',
    duration: '6 Months',
    minAmount: 5000,
    maxAmount: 25000,
    risk: 'Medium',
    color: 'blue'
  },
  {
    id: 'plan_3',
    name: 'Whale Strategy',
    roi: '25% - 35%',
    duration: '12 Months',
    minAmount: 25000,
    maxAmount: 1000000,
    risk: 'High',
    color: 'indigo'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'deposit', amount: 5000, date: '2023-10-24', status: 'completed', description: 'Bank Transfer' },
  { id: 't2', type: 'profit', amount: 450.25, date: '2023-10-22', status: 'completed', description: 'Growth Alpha Dividend' },
  { id: 't3', type: 'investment', amount: -2000, date: '2023-10-20', status: 'completed', description: 'Starter Yield Subscription' },
  { id: 't4', type: 'withdrawal', amount: -1200, date: '2023-10-15', status: 'pending', description: 'Personal Withdrawal' },
  { id: 't5', type: 'deposit', amount: 10000, date: '2023-10-10', status: 'completed', description: 'Crypto Deposit' }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Profit Credited', message: 'You have received $450.25 from your active investment.', time: '2h ago', read: false },
  { id: 'n2', title: 'Security Alert', message: 'New login detected from San Francisco, CA.', time: '5h ago', read: true },
  { id: 'n3', title: 'Plan Expiring', message: 'Your Starter Yield plan expires in 3 days.', time: '1d ago', read: false }
];

export const CHART_DATA = [
  { name: 'Jan', balance: 100000 },
  { name: 'Feb', balance: 105000 },
  { name: 'Mar', balance: 102000 },
  { name: 'Apr', balance: 115000 },
  { name: 'May', balance: 118000 },
  { name: 'Jun', balance: 125000 },
  { name: 'Jul', balance: 122000 },
  { name: 'Aug', balance: 130000 },
  { name: 'Sep', balance: 128450 },
];
