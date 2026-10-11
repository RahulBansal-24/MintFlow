import { FinancialState } from './types';
import { INITIAL_FINANCIAL_STATE } from './seedData';

const STORAGE_KEY = 'MINTFLOW_V1_FINANCIAL_STATE';

export function loadFinancialState(): FinancialState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_FINANCIAL_STATE;
    }
    const parsed = JSON.parse(raw);
    // Basic schema integrity check
    if (parsed && parsed.cycle && Array.isArray(parsed.transactions) && Array.isArray(parsed.commitments)) {
      return parsed;
    }
    return INITIAL_FINANCIAL_STATE;
  } catch (err) {
    console.error('Failed to parse stored financial state, falling back to default seed data:', err);
    return INITIAL_FINANCIAL_STATE;
  }
}

export function saveFinancialState(state: FinancialState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to persist financial state to localStorage:', err);
  }
}

export function resetDemoFinancialState(): FinancialState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
  return JSON.parse(JSON.stringify(INITIAL_FINANCIAL_STATE));
}
