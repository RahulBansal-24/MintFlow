import { FinancialState } from './types';
import { INITIAL_FINANCIAL_STATE, FRESH_START_FINANCIAL_STATE } from './seedData';

const STORAGE_KEY = 'MINTFLOW_V1_FINANCIAL_STATE';
const PROFILE_MODE_KEY = 'MINTFLOW_PROFILE_MODE';
const EXPERIENCE_CHOSEN_KEY = 'MINTFLOW_EXPERIENCE_CHOSEN';

export type ProfileMode = 'demo' | 'fresh';

export function loadProfileMode(): ProfileMode {
  try {
    const mode = localStorage.getItem(PROFILE_MODE_KEY);
    return mode === 'fresh' ? 'fresh' : 'demo';
  } catch {
    return 'demo';
  }
}

export function saveProfileMode(mode: ProfileMode): void {
  try {
    localStorage.setItem(PROFILE_MODE_KEY, mode);
  } catch (e) {
    console.error('Failed to save profile mode:', e);
  }
}

export function hasChosenExperience(): boolean {
  try {
    return localStorage.getItem(EXPERIENCE_CHOSEN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setExperienceChosen(chosen: boolean = true): void {
  try {
    localStorage.setItem(EXPERIENCE_CHOSEN_KEY, chosen ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to save experience chosen state:', e);
  }
}

export function loadFinancialState(): FinancialState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const mode = loadProfileMode();
      return mode === 'fresh' ? FRESH_START_FINANCIAL_STATE : INITIAL_FINANCIAL_STATE;
    }
    const parsed = JSON.parse(raw);
    if (parsed && parsed.cycle && Array.isArray(parsed.transactions) && Array.isArray(parsed.commitments)) {
      return parsed;
    }
    const mode = loadProfileMode();
    return mode === 'fresh' ? FRESH_START_FINANCIAL_STATE : INITIAL_FINANCIAL_STATE;
  } catch (err) {
    console.error('Failed to parse stored financial state, falling back:', err);
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

export function resetFinancialState(mode: ProfileMode = 'demo'): FinancialState {
  try {
    localStorage.removeItem(STORAGE_KEY);
    saveProfileMode(mode);
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
  const base = mode === 'fresh' ? FRESH_START_FINANCIAL_STATE : INITIAL_FINANCIAL_STATE;
  return JSON.parse(JSON.stringify(base));
}
