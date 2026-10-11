import { FinancialState, Transaction, Commitment, SavingsGoal } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    description: 'College Canteen Breakfast & Cutting Chai',
    amount: 80,
    category: 'food',
    type: 'expense',
    date: 'Day 1',
    day: 1,
    isEssential: true,
    notes: 'Campus cafeteria'
  },
  {
    id: 'tx-2',
    description: 'Delhi Metro Smart Card Auto-Recharge',
    amount: 300,
    category: 'transport',
    type: 'expense',
    date: 'Day 2',
    day: 2,
    isEssential: true,
    notes: 'Yellow Line commute'
  },
  {
    id: 'tx-3',
    description: 'Semester Lecture Notes Photocopy & Binder',
    amount: 160,
    category: 'education',
    type: 'expense',
    date: 'Day 3',
    day: 3,
    isEssential: true,
    notes: 'Library stall'
  },
  {
    id: 'tx-4',
    description: 'Swiggy Weekend Biryani Feast with Roommates',
    amount: 320,
    category: 'food',
    type: 'expense',
    date: 'Day 4',
    day: 4,
    isEssential: false,
    notes: 'Weekend dinner split'
  },
  {
    id: 'tx-5',
    description: 'Blinkit Instant Groceries, Oats & Milk',
    amount: 240,
    category: 'food',
    type: 'expense',
    date: 'Day 5',
    day: 5,
    isEssential: true,
    notes: 'Hostel pantry supplies'
  },
  {
    id: 'tx-6',
    description: 'Spotify Premium Student Plan',
    amount: 59,
    category: 'entertainment',
    type: 'expense',
    date: 'Day 6',
    day: 6,
    isEssential: false,
    notes: 'Student verification applied'
  },
  {
    id: 'tx-7',
    description: 'BookMyShow Movie Ticket & Popcorn Combo',
    amount: 280,
    category: 'entertainment',
    type: 'expense',
    date: 'Day 7',
    day: 7,
    isEssential: false,
    notes: 'Student matinee ticket'
  }
];

export const INITIAL_COMMITMENTS: Commitment[] = [
  {
    id: 'comm-1',
    name: 'Hostel High-Speed Fiber & Maintenance',
    amount: 800,
    category: 'bills',
    dueDay: 12,
    isEssential: true,
    status: 'upcoming',
    isSubscription: false,
    frequency: 'monthly',
    notes: 'Hostel management portal'
  },
  {
    id: 'comm-2',
    name: 'YouTube Premium Family Plan Share',
    amount: 189,
    category: 'entertainment',
    dueDay: 18,
    isEssential: false,
    status: 'upcoming',
    isSubscription: true,
    frequency: 'monthly',
    notes: 'Auto-debit on GPay'
  },
  {
    id: 'comm-3',
    name: 'Jio 5G True Unlimited 84-Day Base Split',
    amount: 349,
    category: 'bills',
    dueDay: 24,
    isEssential: true,
    status: 'upcoming',
    isSubscription: false,
    frequency: 'monthly',
    notes: 'Mobile data backup'
  }
];

export const INITIAL_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    name: 'Emergency Cushion Reserve',
    targetAmount: 1500,
    savedAmount: 600,
    targetDay: 30,
    icon: 'shield',
    status: 'active',
    color: '#65F5B4'
  },
  {
    id: 'goal-2',
    name: 'Sony WH-CH520 ANC Headphones',
    targetAmount: 3500,
    savedAmount: 1200,
    targetDay: 28,
    icon: 'headphones',
    status: 'active',
    color: '#55DDF5'
  },
  {
    id: 'goal-3',
    name: 'Kasol Weekend Mountain Trek',
    targetAmount: 2000,
    savedAmount: 400,
    targetDay: 25,
    icon: 'mountain',
    status: 'active',
    color: '#A89BFA'
  }
];

export const INITIAL_FINANCIAL_STATE: FinancialState = {
  cycle: {
    totalDays: 30,
    currentDay: 8,
    cycleName: 'October Financial Cycle',
    startDate: '2026-10-01'
  },
  startingBudget: 10000,
  transactions: INITIAL_TRANSACTIONS,
  commitments: INITIAL_COMMITMENTS,
  goals: INITIAL_GOALS,
  emergencyReserveTarget: 1500,
  previousHealthScore: 78
};
