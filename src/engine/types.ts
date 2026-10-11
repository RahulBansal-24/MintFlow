export type TransactionCategory = 
  | 'food' 
  | 'transport' 
  | 'shopping' 
  | 'entertainment' 
  | 'education' 
  | 'bills' 
  | 'health' 
  | 'other';

export type TransactionType = 'expense' | 'income' | 'savings_transfer';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  date: string; // e.g., "Day 4" or ISO string
  day: number; // 1 to 30
  isEssential: boolean;
  notes?: string;
}

export type CommitmentStatus = 'upcoming' | 'paid' | 'paused' | 'cancelled';

export interface Commitment {
  id: string;
  name: string;
  amount: number;
  category: TransactionCategory;
  dueDay: number; // Day of cycle 1-30
  isEssential: boolean;
  status: CommitmentStatus;
  isSubscription: boolean;
  frequency: 'monthly' | 'one-time';
  paidTransactionId?: string;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDay: number; // Day 1-30
  icon: string;
  status: 'active' | 'completed' | 'paused';
  color?: string;
}

export interface FinancialCycle {
  totalDays: number;
  currentDay: number; // Default 8
  cycleName: string;
  startDate: string;
}

export type RiskLevel = 'Stable' | 'Watchful' | 'Elevated' | 'Critical';

export interface RiskFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  detail: string;
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number; // 0 - 100
  factors: RiskFactor[];
  topContributors: string[];
  primaryRecommendation: string;
  runwayDays: number;
}

export interface CalculatedMetrics {
  startingFunds: number;
  additionalIncome: number;
  totalFunds: number;
  actualExpenses: number;
  essentialExpenses: number;
  discretionaryExpenses: number;
  availableCash: number;
  unpaidReservedCommitments: number;
  unspentGoalAllocations: number;
  uncommittedCash: number;
  remainingDays: number;
  dailyAllowance: number;
  dailyAllowanceWithGoals: number;
  projectedMonthEndBalance: number;
  todaysSpent: number;
  averageDailySpent: number;
  effectiveFutureDailyBurn: number;
  burnRateStatus: 'under' | 'on_track' | 'over';
  healthScore: number;
  previousHealthScore?: number;
  riskAssessment: RiskAssessment;
  categoryBreakdown: Record<TransactionCategory, { amount: number; percentage: number }>;
  weeklySpending: { week: number; amount: number; label: string }[];
}

export interface FinancialState {
  cycle: FinancialCycle;
  startingBudget: number; // Default ₹10,000
  transactions: Transaction[];
  commitments: Commitment[];
  goals: SavingsGoal[];
  emergencyReserveTarget: number;
  previousHealthScore: number;
}

export type DecisionType = 
  | 'buy_now'
  | 'add_expense'
  | 'add_income'
  | 'subscribe'
  | 'cancel_subscription'
  | 'pay_bill'
  | 'save_goal'
  | 'emergency'
  | 'reduce_purchase';

export interface SimulationDecision {
  type: DecisionType;
  amount: number;
  title: string;
  category: TransactionCategory;
  isEssential: boolean;
  targetGoalId?: string;
  targetCommitmentId?: string;
  recurringMonthly?: boolean;
  day?: number;
  notes?: string;
}

export interface SmartAlternative {
  id: string;
  title: string;
  description: string;
  adjustedAmount: number;
  savedRupees: number;
  actionType: 'reduce' | 'delay' | 'cancel_sub' | 'split_goal';
  targetCommitmentId?: string;
}

export interface SimulationResult {
  before: CalculatedMetrics;
  after: CalculatedMetrics;
  deltaAvailableCash: number;
  deltaUncommittedCash: number;
  deltaDailyAllowance: number;
  deltaProjectedBalance: number;
  deltaHealthScore: number;
  verdict: {
    title: string;
    tone: 'safe' | 'caution' | 'danger' | 'positive';
    explanation: string;
  };
  consequenceTimeline: {
    timeframe: string;
    impact: string;
    severity: 'positive' | 'neutral' | 'caution' | 'danger';
  }[];
  smartAlternatives: SmartAlternative[];
}

export interface ForecastDayPoint {
  day: number;
  dayLabel: string;
  conservativeBalance: number;
  expectedBalance: number;
  optimisticBalance: number;
  dailySpendExpected: number;
  isHistorical: boolean;
  eventLabel?: string;
}
