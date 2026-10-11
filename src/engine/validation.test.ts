import { describe, it, expect, beforeEach } from 'vitest';
import { 
  validateFinancialAmount, 
  sanitizeText, 
  validateCycleDay, 
  validateCategory, 
  validateTransactionType 
} from './validation';
import { loadFinancialState, saveFinancialState, resetFinancialState } from './storage';
import { INITIAL_FINANCIAL_STATE, FRESH_START_FINANCIAL_STATE } from './seedData';

describe('MINTFLOW Input Sanitization & Storage Validation', () => {
  describe('validateFinancialAmount', () => {
    it('accepts valid positive numbers and strings', () => {
      expect(validateFinancialAmount(250)).toBe(250);
      expect(validateFinancialAmount('1500')).toBe(1500);
      expect(validateFinancialAmount('499.75')).toBe(500); // rounds paisa safely
    });

    it('rejects negative numbers, zero (by default), NaN, and Infinity', () => {
      expect(validateFinancialAmount(-100)).toBeNull();
      expect(validateFinancialAmount(0)).toBeNull();
      expect(validateFinancialAmount(NaN)).toBeNull();
      expect(validateFinancialAmount(Infinity)).toBeNull();
      expect(validateFinancialAmount(-Infinity)).toBeNull();
      expect(validateFinancialAmount('abc')).toBeNull();
      expect(validateFinancialAmount('')).toBeNull();
      expect(validateFinancialAmount(null)).toBeNull();
      expect(validateFinancialAmount(undefined)).toBeNull();
    });

    it('allows zero when allowZero flag is passed', () => {
      expect(validateFinancialAmount(0, { allowZero: true })).toBe(0);
      expect(validateFinancialAmount('0', { allowZero: true })).toBe(0);
      expect(validateFinancialAmount(-1, { allowZero: true })).toBeNull();
    });

    it('clamps or rejects excessive numbers above upper safety bound', () => {
      expect(validateFinancialAmount(2_000_000)).toBeNull();
      expect(validateFinancialAmount(100_000)).toBe(100_000);
    });
  });

  describe('sanitizeText', () => {
    it('trims whitespace and enforces character caps', () => {
      expect(sanitizeText('   Canteen Coffee   ')).toBe('Canteen Coffee');
      const longText = 'A'.repeat(200);
      expect(sanitizeText(longText, 50).length).toBe(50);
    });

    it('strips non-printable ASCII control characters', () => {
      const tainted = 'Hostel\x00\x08Bill';
      expect(sanitizeText(tainted)).toBe('HostelBill');
    });

    it('handles non-string types safely without throwing', () => {
      expect(sanitizeText(null)).toBe('');
      expect(sanitizeText(undefined)).toBe('');
      expect(sanitizeText(123)).toBe('');
    });
  });

  describe('validateCycleDay', () => {
    it('constrains cycle days between 1 and 30 inclusive', () => {
      expect(validateCycleDay(1)).toBe(1);
      expect(validateCycleDay(15)).toBe(15);
      expect(validateCycleDay(30)).toBe(30);
      expect(validateCycleDay(0)).toBe(1);
      expect(validateCycleDay(-5)).toBe(1);
      expect(validateCycleDay(35)).toBe(30);
      expect(validateCycleDay('8')).toBe(8);
      expect(validateCycleDay('invalid')).toBe(1);
    });
  });

  describe('validateCategory & validateTransactionType', () => {
    it('validates categories against recognized enum values', () => {
      expect(validateCategory('food')).toBe('food');
      expect(validateCategory('bills')).toBe('bills');
      expect(validateCategory('malicious_cat')).toBe('other');
      expect(validateCategory(null)).toBe('other');
    });

    it('validates transaction types against allowed set', () => {
      expect(validateTransactionType('expense')).toBe('expense');
      expect(validateTransactionType('income')).toBe('income');
      expect(validateTransactionType('invalid_type')).toBe('expense');
    });
  });

  describe('Persistent Storage Schema Validation & Recovery', () => {
    let mockStore: Record<string, string> = {};

    beforeEach(() => {
      mockStore = {};
      const mockStorage = {
        getItem: (key: string) => mockStore[key] || null,
        setItem: (key: string, value: string) => { mockStore[key] = value; },
        removeItem: (key: string) => { delete mockStore[key]; },
        clear: () => { mockStore = {}; },
        length: 0,
        key: () => null
      };
      // @ts-ignore
      globalThis.localStorage = mockStorage;
    });

    it('handles completely corrupted JSON gracefully without crashing', () => {
      localStorage.setItem('MINTFLOW_V1_FINANCIAL_STATE', '{"corrupted: {broken_json');
      const state = loadFinancialState();
      expect(state).toBeDefined();
      expect(state.startingBudget).toBe(10000);
      expect(state.cycle.currentDay).toBe(8);
    });

    it('handles schema mismatch (e.g. invalid cycle day or empty structure)', () => {
      localStorage.setItem('MINTFLOW_V1_FINANCIAL_STATE', JSON.stringify({ cycle: { currentDay: 999 } }));
      const state = loadFinancialState();
      expect(state).toBeDefined();
      expect(state.startingBudget).toBe(10000);
      expect(state.cycle.currentDay).toBe(8);
    });

    it('loads valid state intact without modifications', () => {
      saveFinancialState(INITIAL_FINANCIAL_STATE);
      const loaded = loadFinancialState();
      expect(loaded.startingBudget).toBe(INITIAL_FINANCIAL_STATE.startingBudget);
      expect(loaded.transactions.length).toBe(INITIAL_FINANCIAL_STATE.transactions.length);
    });

    it('resets correctly to Demo and Fresh modes', () => {
      const demo = resetFinancialState('demo');
      expect(demo.cycle.currentDay).toBe(8);
      expect(demo.transactions.length).toBeGreaterThan(0);

      const fresh = resetFinancialState('fresh');
      expect(fresh.cycle.currentDay).toBe(1);
      expect(fresh.transactions.length).toBe(0);
    });
  });
});
