import { 
  FinancialState, 
  CalculatedMetrics, 
  TransactionCategory, 
  Transaction,
  Commitment,
  SavingsGoal 
} from './types';
import { calculateRiskAssessment } from './riskEngine';

export const ALL_CATEGORIES: TransactionCategory[] = [
  'food',
  'transport',
  'shopping',
  'entertainment',
  'education',
  'bills',
  'health',
  'other'
];

/**
 * Calculates unified financial metrics from the current application state.
 *
 * Core Accounting Invariants:
 * 1. totalFunds = startingFunds + additionalIncome
 * 2. availableCash = totalFunds - actualExpenses
 *    (Money already physically spent leaves cash in hand).
 * 3. uncommittedCash = availableCash - unpaidReservedCommitments - unspentGoalAllocations
 *    (Reserved bills and saved goals are EARMARKED, not deducted twice from availableCash).
 * 4. dailyAllowance = max(uncommittedCash, 0) / remainingDays
 *    (Guarantees that spending this daily amount will not compromise reserved bills or savings).
 *
 * @param state - The central FinancialState (budget, cycle, transactions, commitments, goals).
 * @returns CalculatedMetrics - Derived metrics including balances, allowances, burn rate, and health assessment.
 */
export function calculateMetrics(state: FinancialState): CalculatedMetrics {
  const { cycle, startingBudget, transactions, commitments, goals, emergencyReserveTarget, previousHealthScore } = state;

  const startingFunds = startingBudget;

  // Additional income received (increases total cash pool)
  const additionalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFunds = startingFunds + additionalIncome;

  // Actual expenses paid so far
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const actualExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const essentialExpenses = expenseTransactions
    .filter(t => t.isEssential)
    .reduce((sum, t) => sum + t.amount, 0);

  const discretionaryExpenses = actualExpenses - essentialExpenses;

  // Available cash = total money in hand minus what has already left as expenses
  const availableCash = totalFunds - actualExpenses;

  // Unpaid reserved commitments (earmarked money, NOT subtracted from available cash until paid)
  const unpaidReservedCommitments = commitments
    .filter(c => c.status === 'upcoming')
    .reduce((sum, c) => sum + c.amount, 0);

  // Unspent goal allocations (earmarked money locked into savings goals)
  const unspentGoalAllocations = goals.reduce((sum, g) => sum + g.savedAmount, 0);

  // Uncommitted cash: flexible money free to spend without encroaching on bills or saved goals
  const uncommittedCash = availableCash - unpaidReservedCommitments - unspentGoalAllocations;

  // Remaining days in cycle (Convention: Day 8 of 30 means 30 - 8 + 1 = 23 days including today)
  const remainingDays = Math.max(cycle.totalDays - cycle.currentDay + 1, 0);
  const divisor = remainingDays > 0 ? remainingDays : 1;

  // Suggested daily spending allowances
  const dailyAllowance = Math.max(uncommittedCash, 0) / divisor;
  const dailyAllowanceWithGoals = Math.max(availableCash - unpaidReservedCommitments, 0) / divisor;

  // Today's spending
  const todaysSpent = expenseTransactions
    .filter(t => t.day === cycle.currentDay)
    .reduce((sum, t) => sum + t.amount, 0);

  // Average daily spent over elapsed days (Days 1 to currentDay - 1, or currentDay)
  const daysElapsed = Math.max(cycle.currentDay - 1, 1);
  const averageDailySpent = actualExpenses / daysElapsed;

  // Projected variable burn for remaining days
  // If user continues spending at their observed average daily rate:
  const expectedRemainingVariableExpenses = averageDailySpent * remainingDays;
  
  // Deterministic Projected End-of-Cycle Balance:
  // projectedBalance = availableCash - unpaidReservedCommitments - expectedRemainingVariableExpenses
  const projectedMonthEndBalance = Math.round(availableCash - unpaidReservedCommitments - expectedRemainingVariableExpenses);

  // Burn rate status compared to sustainable allowance
  let burnRateStatus: 'under' | 'on_track' | 'over' = 'on_track';
  if (todaysSpent > dailyAllowance * 1.25) {
    burnRateStatus = 'over';
  } else if (todaysSpent < dailyAllowance * 0.75) {
    burnRateStatus = 'under';
  }

  // Savings goals stats
  const totalSavedInGoals = unspentGoalAllocations;
  const totalGoalTargets = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  const emergencyGoal = goals.find(g => g.icon === 'shield' || g.name.toLowerCase().includes('emergency'));
  const emergencySaved = emergencyGoal ? emergencyGoal.savedAmount : 0;

  // Risk Assessment & Health Score
  const riskAssessment = calculateRiskAssessment({
    startingFunds,
    availableCash,
    uncommittedCash,
    unpaidReservedCommitments,
    actualExpenses,
    discretionaryExpenses,
    totalSavedInGoals,
    totalGoalTargets,
    emergencySaved,
    emergencyTarget: emergencyReserveTarget,
    currentDay: cycle.currentDay,
    remainingDays,
    dailyAllowance,
    averageDailySpent,
    projectedMonthEndBalance
  });

  // Category breakdown
  const categoryBreakdown: Record<TransactionCategory, { amount: number; percentage: number }> = {
    food: { amount: 0, percentage: 0 },
    transport: { amount: 0, percentage: 0 },
    shopping: { amount: 0, percentage: 0 },
    entertainment: { amount: 0, percentage: 0 },
    education: { amount: 0, percentage: 0 },
    bills: { amount: 0, percentage: 0 },
    health: { amount: 0, percentage: 0 },
    other: { amount: 0, percentage: 0 }
  };

  expenseTransactions.forEach(t => {
    if (categoryBreakdown[t.category]) {
      categoryBreakdown[t.category].amount += t.amount;
    }
  });

  ALL_CATEGORIES.forEach(cat => {
    categoryBreakdown[cat].percentage = actualExpenses > 0 
      ? Math.round((categoryBreakdown[cat].amount / actualExpenses) * 100) 
      : 0;
  });

  // Weekly spending breakdown (Weeks 1 to 4)
  const weeklySpending = [
    { week: 1, amount: 0, label: 'Days 1-7' },
    { week: 2, amount: 0, label: 'Days 8-14' },
    { week: 3, amount: 0, label: 'Days 15-21' },
    { week: 4, amount: 0, label: 'Days 22-30' }
  ];

  expenseTransactions.forEach(t => {
    if (t.day <= 7) weeklySpending[0].amount += t.amount;
    else if (t.day <= 14) weeklySpending[1].amount += t.amount;
    else if (t.day <= 21) weeklySpending[2].amount += t.amount;
    else weeklySpending[3].amount += t.amount;
  });

  return {
    startingFunds,
    additionalIncome,
    totalFunds,
    actualExpenses,
    essentialExpenses,
    discretionaryExpenses,
    availableCash,
    unpaidReservedCommitments,
    unspentGoalAllocations,
    uncommittedCash,
    remainingDays,
    dailyAllowance,
    dailyAllowanceWithGoals,
    projectedMonthEndBalance,
    todaysSpent,
    averageDailySpent,
    burnRateStatus,
    healthScore: riskAssessment.score,
    previousHealthScore,
    riskAssessment,
    categoryBreakdown,
    weeklySpending
  };
}
