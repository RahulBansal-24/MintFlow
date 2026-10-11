import { describe, it, expect } from 'vitest';
import { calculateMetrics } from './financialEngine';
import { simulateDecision } from './scenarioEngine';
import { INITIAL_FINANCIAL_STATE, FRESH_START_FINANCIAL_STATE } from './seedData';
import { FinancialState } from './types';

describe('MINTFLOW Financial Engine Accounting Integrity', () => {
  it('correctly calculates initial seed state metrics', () => {
    const metrics = calculateMetrics(INITIAL_FINANCIAL_STATE);

    // Initial budget is 10,000
    expect(metrics.startingFunds).toBe(10000);
    expect(metrics.totalFunds).toBe(10000);

    // Initial transactions sum: 80 + 300 + 160 + 320 + 240 + 59 + 280 = 1439
    expect(metrics.actualExpenses).toBe(1439);

    // Available cash = totalFunds - actualExpenses = 10000 - 1439 = 8561
    expect(metrics.availableCash).toBe(8561);

    // Reserved commitments: 800 (Hostel) + 189 (YouTube) + 349 (Jio) = 1338
    expect(metrics.unpaidReservedCommitments).toBe(1338);

    // Goals saved: 600 + 1200 + 400 = 2200
    expect(metrics.unspentGoalAllocations).toBe(2200);

    // Uncommitted cash: 8561 - 1338 - 2200 = 5023
    expect(metrics.uncommittedCash).toBe(5023);

    // Remaining days: 30 - 8 + 1 = 23 days
    expect(metrics.remainingDays).toBe(23);

    // Daily allowance: 5023 / 23 = ~218.39
    expect(Math.round(metrics.dailyAllowance)).toBe(218);

    // Projected Month End Balance should be in healthy surplus (> 0)
    expect(metrics.projectedMonthEndBalance).toBeGreaterThan(0);

    // Health score is in the healthy zone (>= 75)
    expect(metrics.healthScore).toBeGreaterThanOrEqual(75);
    expect(metrics.riskAssessment.level).toBe('Stable');
  });

  it('correctly calculates Day 1 Fresh Start clean slate scenario', () => {
    const metrics = calculateMetrics(FRESH_START_FINANCIAL_STATE);

    expect(metrics.startingFunds).toBe(10000);
    expect(metrics.totalFunds).toBe(10000);
    expect(metrics.actualExpenses).toBe(0);
    expect(metrics.availableCash).toBe(10000);
    expect(metrics.unpaidReservedCommitments).toBe(0);
    expect(metrics.unspentGoalAllocations).toBe(0);
    expect(metrics.uncommittedCash).toBe(10000);
    expect(metrics.remainingDays).toBe(30);
    // Daily allowance = 10000 / 30 = 333.33
    expect(Math.round(metrics.dailyAllowance)).toBe(333);
    expect(metrics.healthScore).toBe(68);
    expect(metrics.riskAssessment.level).toBe('Watchful');
  });

  it('correctly adds income and increases available and uncommitted cash', () => {
    const state: FinancialState = JSON.parse(JSON.stringify(INITIAL_FINANCIAL_STATE));
    state.transactions.push({
      id: 'tx-freelance',
      description: 'Freelance Design Gig',
      amount: 2500,
      category: 'other',
      type: 'income',
      date: 'Day 8',
      day: 8,
      isEssential: false
    });

    const metrics = calculateMetrics(state);
    expect(metrics.totalFunds).toBe(12500);
    expect(metrics.availableCash).toBe(8561 + 2500);
    expect(metrics.uncommittedCash).toBe(5023 + 2500);
    expect(Math.round(metrics.dailyAllowance)).toBe(Math.round((5023 + 2500) / 23));
  });

  it('marking a reserved commitment as paid does not double-deduct', () => {
    const state: FinancialState = JSON.parse(JSON.stringify(INITIAL_FINANCIAL_STATE));
    const initialMetrics = calculateMetrics(state);

    // Mark hostel bill (800) as paid by converting reservation into transaction
    const hostelBill = state.commitments.find(c => c.id === 'comm-1')!;
    hostelBill.status = 'paid';
    state.transactions.push({
      id: 'paid-hostel',
      description: hostelBill.name,
      amount: hostelBill.amount,
      category: hostelBill.category,
      type: 'expense',
      date: 'Day 8',
      day: 8,
      isEssential: true
    });

    const newMetrics = calculateMetrics(state);

    // Available cash decreases by 800 (from 8561 to 7761)
    expect(newMetrics.availableCash).toBe(initialMetrics.availableCash - 800);
    // Unpaid reserved commitments decreased by 800 (from 1338 to 538)
    expect(newMetrics.unpaidReservedCommitments).toBe(initialMetrics.unpaidReservedCommitments - 800);
    // Uncommitted cash remains exactly the same because the money was already earmarked!
    expect(newMetrics.uncommittedCash).toBe(initialMetrics.uncommittedCash);
    expect(Math.round(newMetrics.dailyAllowance)).toBe(Math.round(initialMetrics.dailyAllowance));
  });

  it('simulator runs isolated tests without mutating original state', () => {
    const originalState: FinancialState = JSON.parse(JSON.stringify(INITIAL_FINANCIAL_STATE));
    const result = simulateDecision(originalState, {
      type: 'buy_now',
      amount: 1500,
      title: 'Sneakers',
      category: 'shopping',
      isEssential: false
    });

    // Check simulation results
    expect(result.deltaAvailableCash).toBe(-1500);
    expect(result.deltaUncommittedCash).toBe(-1500);
    expect(result.after.availableCash).toBe(8561 - 1500);
    expect(result.smartAlternatives.length).toBeGreaterThan(0);

    // Original state must remain untouched
    const freshMetrics = calculateMetrics(originalState);
    expect(freshMetrics.availableCash).toBe(8561);
    expect(freshMetrics.uncommittedCash).toBe(5023);
  });

  it('simulates future purchase planning (₹2,500) and compares alternatives', () => {
    const originalState: FinancialState = JSON.parse(JSON.stringify(INITIAL_FINANCIAL_STATE));
    const result = simulateDecision(originalState, {
      type: 'buy_now',
      amount: 2500,
      title: 'Mechanical Keyboard / Course Kit',
      category: 'education',
      isEssential: false
    });

    // Delta cash is -2500
    expect(result.deltaAvailableCash).toBe(-2500);
    expect(result.deltaUncommittedCash).toBe(-2500);
    // After purchase: available cash = 8561 - 2500 = 6061
    expect(result.after.availableCash).toBe(6061);
    // Uncommitted cash drops from 5023 to 2523
    expect(result.after.uncommittedCash).toBe(2523);
    // Daily allowance drops from 218 to ~110
    expect(Math.round(result.after.dailyAllowance)).toBe(110);

    // Smart alternatives generated
    const hasDelay = result.smartAlternatives.some(a => a.actionType === 'delay');
    const hasReduce = result.smartAlternatives.some(a => a.actionType === 'reduce');
    expect(hasDelay).toBe(true);
    expect(hasReduce).toBe(true);
  });

  it('simulates savings allocation (₹2,000) and checks runway sustainability', () => {
    const originalState: FinancialState = JSON.parse(JSON.stringify(INITIAL_FINANCIAL_STATE));
    const result = simulateDecision(originalState, {
      type: 'save_goal',
      amount: 2000,
      title: 'Emergency Cushion Lock',
      category: 'other',
      isEssential: true,
      targetGoalId: 'goal-1'
    });

    // Money is transferred to savings, so available cash does NOT decrease
    expect(result.deltaAvailableCash).toBe(0);
    // But uncommitted spendable cash decreases by 2000
    expect(result.deltaUncommittedCash).toBe(-2000);
    expect(result.after.uncommittedCash).toBe(5023 - 2000); // 3023
    // Remaining daily allowance is 3023 / 23 = ~131/day
    expect(Math.round(result.after.dailyAllowance)).toBe(131);
    // Sustainability check: remaining uncommitted cash is positive (> 0)
    expect(result.after.uncommittedCash).toBeGreaterThan(0);
    expect(result.verdict.tone).toBe('positive');
  });

  describe('Day 30 Forecast & Variable Burn Insufficient History Invariants', () => {
    it('Day 1 Clean Slate has ₹10,000 month-end forecast with 0 expenses', () => {
      const metrics = calculateMetrics(FRESH_START_FINANCIAL_STATE);
      expect(metrics.projectedMonthEndBalance).toBe(10000);
      expect(metrics.effectiveFutureDailyBurn).toBe(0);
    });

    it('adding a one-time ₹100 expense on Day 1 drops forecast by exactly ₹100 (from ₹10,000 to ₹9,900)', () => {
      const state: FinancialState = JSON.parse(JSON.stringify(FRESH_START_FINANCIAL_STATE));
      state.transactions.push({
        id: 'tx-day1-coffee',
        description: 'Cold Coffee & Cookie',
        amount: 100,
        category: 'food',
        type: 'expense',
        date: 'Day 1',
        day: 1,
        isEssential: false
      });

      const metrics = calculateMetrics(state);
      expect(metrics.availableCash).toBe(9900);
      expect(metrics.actualExpenses).toBe(100);
      // Invariant: The ₹100 is deducted ONCE. It does NOT multiply across 30 days into a ₹3,100 drop!
      expect(metrics.projectedMonthEndBalance).toBe(9900);
      expect(metrics.effectiveFutureDailyBurn).toBe(0);
    });

    it('adding a second one-time ₹250 expense on Day 1 drops forecast by further ₹250 (to ₹9,650)', () => {
      const state: FinancialState = JSON.parse(JSON.stringify(FRESH_START_FINANCIAL_STATE));
      state.transactions.push(
        {
          id: 'tx-day1-1',
          description: 'Cold Coffee',
          amount: 100,
          category: 'food',
          type: 'expense',
          date: 'Day 1',
          day: 1,
          isEssential: false
        },
        {
          id: 'tx-day1-2',
          description: 'Course Workbook',
          amount: 250,
          category: 'education',
          type: 'expense',
          date: 'Day 1',
          day: 1,
          isEssential: true
        }
      );

      const metrics = calculateMetrics(state);
      expect(metrics.availableCash).toBe(9650);
      expect(metrics.actualExpenses).toBe(350);
      expect(metrics.projectedMonthEndBalance).toBe(9650);
    });

    it('Day 8 Seeded Demo preserves established healthy surplus of ₹2,700', () => {
      const metrics = calculateMetrics(INITIAL_FINANCIAL_STATE);
      // Available cash 8561 - commitments 1338 - future variable burn (205.57 * 22 = 4523) = 2700
      expect(metrics.projectedMonthEndBalance).toBe(2700);
      expect(Math.round(metrics.effectiveFutureDailyBurn)).toBe(206);
    });

    it('Spend Simulator on Day 1 shows deltaProjectedBalance of exactly -₹100 for a ₹100 purchase', () => {
      const result = simulateDecision(FRESH_START_FINANCIAL_STATE, {
        type: 'buy_now',
        amount: 100,
        title: 'Cafeteria Snack',
        category: 'food',
        isEssential: false
      });

      expect(result.before.projectedMonthEndBalance).toBe(10000);
      expect(result.after.projectedMonthEndBalance).toBe(9900);
      expect(result.deltaProjectedBalance).toBe(-100);
    });

    it('Spend Simulator on Day 8 treats a one-time purchase as an isolated deduction without distorting completed history', () => {
      const result = simulateDecision(INITIAL_FINANCIAL_STATE, {
        type: 'buy_now',
        amount: 1500,
        title: 'Converse Chuck 70s',
        category: 'shopping',
        isEssential: false
      });

      expect(result.before.projectedMonthEndBalance).toBe(2700);
      // Cash decreases by 1500, upcoming commitments and completed burn rate stay untouched
      expect(result.after.projectedMonthEndBalance).toBe(1200);
      expect(result.deltaProjectedBalance).toBe(-1500);
    });

    it('Day 30 boundary condition: futureRemainingDays is 0 and no future burn is extrapolated', () => {
      const state: FinancialState = JSON.parse(JSON.stringify(INITIAL_FINANCIAL_STATE));
      state.cycle.currentDay = 30;
      // Mark all past commitments as paid or cancelled for boundary test
      state.commitments = [];

      const metrics = calculateMetrics(state);
      expect(metrics.remainingDays).toBe(1); // Day 30 itself
      // futureRemainingDays is Math.max(0, 30 - 30) = 0
      // Forecast = availableCash - unpaidCommitments - (burn * 0) = availableCash
      expect(metrics.projectedMonthEndBalance).toBe(metrics.availableCash);
    });
  });
});
