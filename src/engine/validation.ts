/**
 * MINTFLOW Financial Domain Sanitizer & Validator
 *
 * Ensures all user inputs, imported data, and persisted payloads
 * adhere to strict domain bounds, preventing silent NaN/Infinity/negative
 * corruptions of balances, runways, and risk scores.
 */

import { TransactionCategory, TransactionType } from './types';

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

export const VALID_TRANSACTION_TYPES: TransactionType[] = [
  'expense',
  'income',
  'savings_transfer'
];

/** Maximum realistic financial value for a 30-day budget simulator (₹10,00,000) */
export const MAX_SAFE_RUPEES = 1_000_000;

/** Maximum length for user-entered titles/descriptions */
export const MAX_TEXT_LENGTH = 120;

/**
 * Sanitizes and validates a financial rupee amount.
 * Returns a valid finite positive number, or null if invalid.
 */
export function validateFinancialAmount(
  input: unknown,
  options: { allowZero?: boolean; max?: number } = {}
): number | null {
  const { allowZero = false, max = MAX_SAFE_RUPEES } = options;

  if (input === null || input === undefined || input === '') {
    return null;
  }

  const num = typeof input === 'number' ? input : Number(input);

  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return null;
  }

  if (allowZero ? num < 0 : num <= 0) {
    return null;
  }

  if (num > max) {
    return null;
  }

  // Round to nearest integer (paisa rounding for simulator)
  return Math.round(num);
}

/**
 * Sanitizes user-entered text by trimming whitespace,
 * stripping control characters, and enforcing length limits.
 */
export function sanitizeText(
  input: unknown,
  maxLength: number = MAX_TEXT_LENGTH
): string {
  if (typeof input !== 'string') {
    return '';
  }
  // Trim and strip non-printable ASCII control characters (keep standard text)
  const cleaned = input.replace(/[\x00-\x1F\x7F]/g, '').trim();
  return cleaned.slice(0, maxLength);
}

/**
 * Validates cycle day is an integer between 1 and 30 inclusive.
 */
export function validateCycleDay(input: unknown): number {
  const num = typeof input === 'number' ? input : Number(input);
  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return 1;
  }
  return Math.min(30, Math.max(1, Math.round(num)));
}

/**
 * Validates transaction category, defaulting to 'other' if invalid.
 */
export function validateCategory(category: unknown): TransactionCategory {
  if (typeof category === 'string' && ALL_CATEGORIES.includes(category as TransactionCategory)) {
    return category as TransactionCategory;
  }
  return 'other';
}

/**
 * Validates transaction type, defaulting to 'expense' if invalid.
 */
export function validateTransactionType(type: unknown): TransactionType {
  if (typeof type === 'string' && VALID_TRANSACTION_TYPES.includes(type as TransactionType)) {
    return type as TransactionType;
  }
  return 'expense';
}
