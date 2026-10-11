import { FinancialState, ForecastDayPoint, CalculatedMetrics } from './types';
import { calculateMetrics } from './financialEngine';

export interface StrategyComparison {
  name: string;
  tagline: string;
  description: string;
  endBalance: number;
  dailyAllowance: number;
  savingsTotal: number;
  commitmentCoverage: number; // percentage
  healthScoreProjected: number;
  color: string;
}

export function generateForecastData(state: FinancialState): {
  chartPoints: ForecastDayPoint[];
  strategies: StrategyComparison[];
} {
  const metrics = calculateMetrics(state);
  const { cycle, startingBudget, transactions, commitments, goals } = state;
  const currentDay = cycle.currentDay;

  const chartPoints: ForecastDayPoint[] = [];

  // 1. Build historical days (Day 1 to currentDay)
  let runningActualCash = startingBudget;
  for (let d = 1; d <= currentDay; d++) {
    const dayTxs = transactions.filter(t => t.day === d);
    const dayExpenses = dayTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const dayIncome = dayTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

    runningActualCash = runningActualCash - dayExpenses + dayIncome;

    chartPoints.push({
      day: d,
      dayLabel: `Day ${d}`,
      conservativeBalance: runningActualCash,
      expectedBalance: runningActualCash,
      optimisticBalance: runningActualCash,
      dailySpendExpected: dayExpenses,
      isHistorical: true,
      eventLabel: d === currentDay ? 'Today (Day 8)' : undefined
    });
  }

  // 2. Build projected days (currentDay + 1 to 30)
  const remainingDays = 30 - currentDay;
  const currentCash = runningActualCash;

  // Daily variable spend rates for 3 scenarios:
  // Expected: averageDailySpent so far
  const expectedBurn = metrics.averageDailySpent;
  // Conservative: 25% higher burn rate (impulsive weekend spikes)
  const conservativeBurn = expectedBurn * 1.25;
  // Optimistic: 20% leaner burn rate (mindful student budgeting)
  const optimisticBurn = expectedBurn * 0.80;

  let simConservative = currentCash;
  let simExpected = currentCash;
  let simOptimistic = currentCash;

  for (let d = currentDay + 1; d <= 30; d++) {
    // Check if commitments fall on this day
    const dayCommitments = commitments.filter(c => c.dueDay === d && c.status === 'upcoming');
    const commitmentSum = dayCommitments.reduce((sum, c) => sum + c.amount, 0);

    simConservative = simConservative - conservativeBurn - commitmentSum;
    simExpected = simExpected - expectedBurn - commitmentSum;
    simOptimistic = simOptimistic - optimisticBurn - commitmentSum;

    const eventName = dayCommitments.length > 0 
      ? dayCommitments.map(c => c.name.split(' ')[0]).join(' & ') 
      : undefined;

    chartPoints.push({
      day: d,
      dayLabel: `Day ${d}`,
      conservativeBalance: Math.round(simConservative),
      expectedBalance: Math.round(simExpected),
      optimisticBalance: Math.round(simOptimistic),
      dailySpendExpected: Math.round(expectedBurn + commitmentSum),
      isHistorical: false,
      eventLabel: eventName
    });
  }

  // 3. Strategy comparisons
  const totalSavedGoals = goals.reduce((sum, g) => sum + g.savedAmount, 0);

  const strategies: StrategyComparison[] = [
    {
      name: 'Strategy A: Baseline Pace',
      tagline: 'Continue current daily pace',
      description: `Maintain your average ₹${Math.round(metrics.averageDailySpent)}/day spending and pay all scheduled bills on time.`,
      endBalance: Math.round(simExpected),
      dailyAllowance: Math.round(metrics.dailyAllowance),
      savingsTotal: totalSavedGoals,
      commitmentCoverage: 100,
      healthScoreProjected: metrics.healthScore,
      color: '#55DDF5'
    },
    {
      name: 'Strategy B: Lean Discipline',
      tagline: 'Cut dining & entertainment by 35%',
      description: `Cap non-essential daily buys at ₹120/day. Preserves an extra buffer for surprises.`,
      endBalance: Math.round(simOptimistic),
      dailyAllowance: Math.round(metrics.dailyAllowance * 0.85),
      savingsTotal: totalSavedGoals + 600,
      commitmentCoverage: 100,
      healthScoreProjected: Math.min(100, metrics.healthScore + 12),
      color: '#65F5B4'
    },
    {
      name: 'Strategy C: Goal Booster',
      tagline: 'Prioritize Sony Headphones & Trek',
      description: `Funnel ₹75/day into your savings goals. Maximizes milestone progress before Day 30.`,
      endBalance: Math.round(simExpected - 1200),
      dailyAllowance: Math.round(metrics.dailyAllowance - 52),
      savingsTotal: totalSavedGoals + 1200,
      commitmentCoverage: 100,
      healthScoreProjected: Math.min(100, metrics.healthScore + 8),
      color: '#A89BFA'
    }
  ];

  return { chartPoints, strategies };
}
