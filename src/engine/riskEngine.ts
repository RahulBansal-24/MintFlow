import { RiskAssessment, RiskLevel, RiskFactor, TransactionCategory } from './types';

interface RiskCalculationInput {
  startingFunds: number;
  availableCash: number;
  uncommittedCash: number;
  unpaidReservedCommitments: number;
  actualExpenses: number;
  discretionaryExpenses: number;
  totalSavedInGoals: number;
  totalGoalTargets: number;
  emergencySaved: number;
  emergencyTarget: number;
  currentDay: number;
  remainingDays: number;
  dailyAllowance: number;
  averageDailySpent: number;
  projectedMonthEndBalance: number;
}

export function calculateRiskAssessment(input: RiskCalculationInput): RiskAssessment {
  const {
    startingFunds,
    availableCash,
    uncommittedCash,
    unpaidReservedCommitments,
    actualExpenses,
    discretionaryExpenses,
    totalSavedInGoals,
    totalGoalTargets,
    emergencySaved,
    emergencyTarget,
    currentDay,
    remainingDays,
    dailyAllowance,
    averageDailySpent,
    projectedMonthEndBalance
  } = input;

  const factors: RiskFactor[] = [];

  // 1. Budget Discipline (30% weight)
  // Expected average spend rate per day: startingFunds / 30
  const idealDailyBudget = startingFunds / 30; // ₹333.33/day
  let budgetDisciplineScore = 100;
  if (averageDailySpent > idealDailyBudget * 1.5) {
    budgetDisciplineScore = Math.max(20, 100 - ((averageDailySpent - idealDailyBudget) / idealDailyBudget) * 80);
    factors.push({
      factor: 'Daily Spending Burn Pace',
      impact: 'negative',
      weight: 30,
      detail: `Spending ₹${Math.round(averageDailySpent)}/day vs sustainable ₹${Math.round(idealDailyBudget)}/day pace`
    });
  } else if (averageDailySpent > idealDailyBudget) {
    budgetDisciplineScore = 80;
    factors.push({
      factor: 'Daily Spending Burn Pace',
      impact: 'neutral',
      weight: 30,
      detail: `Spending is slightly above the baseline daily budget pace`
    });
  } else {
    budgetDisciplineScore = 95;
    factors.push({
      factor: 'Budget Discipline',
      impact: 'positive',
      weight: 30,
      detail: `Controlled daily burn rate within sustainable limits`
    });
  }

  // 2. Commitment Coverage (25% weight)
  let commitmentCoverageScore = 100;
  if (unpaidReservedCommitments > 0) {
    const coverageRatio = availableCash / unpaidReservedCommitments;
    if (coverageRatio < 1.0) {
      commitmentCoverageScore = Math.max(0, coverageRatio * 60);
      factors.push({
        factor: 'Upcoming Bills Coverage',
        impact: 'negative',
        weight: 25,
        detail: `Available cash cannot fully cover ₹${unpaidReservedCommitments} in upcoming commitments`
      });
    } else if (coverageRatio < 1.5) {
      commitmentCoverageScore = 75;
      factors.push({
        factor: 'Upcoming Bills Coverage',
        impact: 'neutral',
        weight: 25,
        detail: `Bills are covered, but leave little buffer for surprises`
      });
    } else {
      commitmentCoverageScore = 100;
      factors.push({
        factor: 'Commitment Coverage',
        impact: 'positive',
        weight: 25,
        detail: `100% of upcoming obligations are fully backed by available cash`
      });
    }
  } else {
    commitmentCoverageScore = 100;
    factors.push({
      factor: 'Commitment Coverage',
      impact: 'positive',
      weight: 25,
      detail: `No pending unpaid commitments for the rest of the cycle`
    });
  }

  // 3. Savings Progress (20% weight)
  let savingsScore = 50;
  if (totalGoalTargets > 0) {
    const savingsRatio = totalSavedInGoals / totalGoalTargets;
    savingsScore = Math.min(100, Math.round(savingsRatio * 100));
    factors.push({
      factor: 'Savings Goals Funding',
      impact: savingsRatio >= 0.5 ? 'positive' : 'neutral',
      weight: 20,
      detail: `${Math.round(savingsRatio * 100)}% of targeted savings goals funded`
    });
  }

  // 4. Financial Runway (15% weight)
  let runwayScore = 100;
  const burn = averageDailySpent > 0 ? averageDailySpent : idealDailyBudget;
  const runwayDays = Math.max(0, Math.floor(availableCash / burn));
  if (runwayDays < remainingDays) {
    const deficitDays = remainingDays - runwayDays;
    runwayScore = Math.max(10, 100 - (deficitDays / remainingDays) * 90);
    factors.push({
      factor: 'Cash Runway',
      impact: 'negative',
      weight: 15,
      detail: `Runway covers ~${runwayDays} days at current burn; ${remainingDays} days remain`
    });
  } else {
    runwayScore = 95;
    factors.push({
      factor: 'Cash Runway',
      impact: 'positive',
      weight: 15,
      detail: `Runway comfortably exceeds the remaining ${remainingDays} days of the cycle`
    });
  }

  // 5. Emergency Resilience (10% weight)
  let emergencyScore = 40;
  if (emergencyTarget > 0) {
    const emergencyRatio = emergencySaved / emergencyTarget;
    emergencyScore = Math.min(100, Math.round(emergencyRatio * 100));
    factors.push({
      factor: 'Emergency Reserve',
      impact: emergencyRatio >= 0.75 ? 'positive' : 'neutral',
      weight: 10,
      detail: `Emergency cushion holds ₹${emergencySaved} of ₹${emergencyTarget} target`
    });
  }

  // Weighted Health Score calculation (0 to 100)
  let rawScore = (
    budgetDisciplineScore * 0.30 +
    commitmentCoverageScore * 0.25 +
    savingsScore * 0.20 +
    runwayScore * 0.15 +
    emergencyScore * 0.10
  );

  // If projected balance is negative, strongly penalize health score
  if (projectedMonthEndBalance < 0) {
    rawScore = Math.min(rawScore, 42);
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Determine Risk Level
  let level: RiskLevel = 'Stable';
  if (projectedMonthEndBalance < 0 || availableCash < unpaidReservedCommitments || finalScore < 45) {
    level = 'Critical';
  } else if (finalScore < 65 || uncommittedCash < 1000) {
    level = 'Elevated';
  } else if (finalScore < 78 || dailyAllowance < 150) {
    level = 'Watchful';
  } else {
    level = 'Stable';
  }

  // Extract Top 3 Contributors
  const topContributors = factors
    .slice(0, 3)
    .map(f => `${f.impact === 'negative' ? '⚠️ ' : f.impact === 'positive' ? '✅ ' : 'ℹ️ '}${f.detail}`);

  // Formulate Single Actionable Recommendation
  let primaryRecommendation = 'Keep daily variable spending under your ₹' + Math.round(dailyAllowance) + ' allowance to finish in surplus.';
  if (level === 'Critical') {
    primaryRecommendation = 'Pause discretionary subscriptions or defer non-essential purchases to prevent a cycle deficit.';
  } else if (level === 'Elevated') {
    primaryRecommendation = 'Trim dining & entertainment by ₹100/day to restore a healthy uncommitted buffer.';
  } else if (level === 'Watchful') {
    primaryRecommendation = 'Lock in your upcoming bill reservations before making spontaneous weekend buys.';
  } else if (totalSavedInGoals < totalGoalTargets * 0.5) {
    primaryRecommendation = 'You are in great shape! Consider routing ₹50/day into your headphones or trek savings goal.';
  }

  return {
    level,
    score: finalScore,
    factors,
    topContributors,
    primaryRecommendation,
    runwayDays
  };
}
