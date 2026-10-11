import { FinancialState, CalculatedMetrics } from './types';
import { formatINR } from './currency';

export interface MoneyInsight {
  id: string;
  type: 'alert' | 'tip' | 'celebration' | 'optimization';
  title: string;
  description: string;
  actionText: string;
  actionTarget: 'simulator' | 'commitments' | 'goals' | 'budget';
  tag: string;
}

export function generateMoneyInsights(state: FinancialState, metrics: CalculatedMetrics): MoneyInsight[] {
  const insights: MoneyInsight[] = [];

  // 1. Highest Spending Category
  const categories = Object.entries(metrics.categoryBreakdown) as [keyof typeof metrics.categoryBreakdown, { amount: number; percentage: number }][];
  const sortedCategories = [...categories].sort((a, b) => b[1].amount - a[1].amount);
  const highest = sortedCategories[0];

  if (highest && highest[1].amount > 0) {
    const catName = highest[0].charAt(0).toUpperCase() + highest[0].slice(1);
    insights.push({
      id: 'ins-highest-cat',
      type: highest[1].percentage > 45 ? 'alert' : 'tip',
      title: `${catName} is your top expense category (${highest[1].percentage}%)`,
      description: `You've spent ${formatINR(highest[1].amount)} on ${catName} across Days 1–7. A small daily cap will free up substantial room for goals.`,
      actionText: 'Review Category Spend',
      actionTarget: 'budget',
      tag: 'Category Analysis'
    });
  }

  // 2. Subscription Leakage Insight
  const discSubs = state.commitments.filter(c => c.isSubscription && !c.isEssential && c.status === 'upcoming');
  const discSubTotal = discSubs.reduce((sum, c) => sum + c.amount, 0);

  if (discSubTotal > 0) {
    const dailyBoost = Math.round(discSubTotal / metrics.remainingDays);
    insights.push({
      id: 'ins-sub-leakage',
      type: 'optimization',
      title: `₹${discSubTotal} locked in discretionary subscriptions`,
      description: `Pausing or cancelling upcoming non-essential recurring plans frees ${formatINR(discSubTotal)}, boosting your daily spending allowance by +₹${dailyBoost}/day.`,
      actionText: 'Inspect Subscriptions',
      actionTarget: 'commitments',
      tag: 'Subscription Leakage'
    });
  }

  // 3. Daily Pacing vs Allowance
  if (metrics.todaysSpent > metrics.dailyAllowance && metrics.todaysSpent > 0) {
    const excess = Math.round(metrics.todaysSpent - metrics.dailyAllowance);
    insights.push({
      id: 'ins-burn-pace',
      type: 'alert',
      title: `Today's spend is ₹${excess} over your daily allowance`,
      description: `You've spent ${formatINR(metrics.todaysSpent)} today versus your ₹${Math.round(metrics.dailyAllowance)} guideline. Ease off tomorrow to keep your month-end surplus intact.`,
      actionText: 'Simulate Daily Adjustments',
      actionTarget: 'simulator',
      tag: 'Pacing Pace'
    });
  } else {
    insights.push({
      id: 'ins-burn-good',
      type: 'celebration',
      title: `You have ₹${Math.round(metrics.dailyAllowance)}/day safe flexible allowance`,
      description: `All upcoming commitments (₹${formatINR(metrics.unpaidReservedCommitments)}) and savings goals (₹${formatINR(metrics.unspentGoalAllocations)}) are completely ring-fenced.`,
      actionText: 'Test a Future Buy',
      actionTarget: 'simulator',
      tag: 'Financial Peace'
    });
  }

  // 4. Goals Milestone Insight
  const nearestGoal = state.goals.find(g => g.status === 'active' && g.savedAmount < g.targetAmount);
  if (nearestGoal) {
    const remaining = nearestGoal.targetAmount - nearestGoal.savedAmount;
    const pct = Math.round((nearestGoal.savedAmount / nearestGoal.targetAmount) * 100);
    insights.push({
      id: 'ins-goal-milestone',
      type: 'tip',
      title: `${nearestGoal.name} is ${pct}% funded`,
      description: `Just ${formatINR(remaining)} away from complete funding. Putting aside ₹${Math.round(remaining / metrics.remainingDays)}/day completes it before Day 30!`,
      actionText: 'Boost Goal',
      actionTarget: 'goals',
      tag: 'Milestone Tracker'
    });
  }

  return insights;
}
