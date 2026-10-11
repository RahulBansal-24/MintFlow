import { describe, it, expect } from 'vitest';
import { calculateMetrics } from './financialEngine';
import { simulateDecision } from './scenarioEngine';
import { INITIAL_FINANCIAL_STATE } from './seedData';
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
});
