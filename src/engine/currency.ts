/**
 * Utility functions for Indian Rupee (INR) currency formatting.
 * Uses the Indian numbering system format (lakhs, crores: 1,00,000)
 */

export function formatINR(amount: number, options?: { hideSymbol?: boolean; compact?: boolean; showSign?: boolean }): string {
  const { hideSymbol = false, compact = false, showSign = false } = options || {};
  
  if (isNaN(amount) || !isFinite(amount)) {
    return hideSymbol ? '0' : '₹0';
  }

  const sign = amount < 0 ? '-' : (showSign && amount > 0 ? '+' : '');
  const absAmount = Math.abs(Math.round(amount));

  if (compact && absAmount >= 1000) {
    if (absAmount >= 100000) {
      const lakhs = (absAmount / 100000).toFixed(1).replace(/\.0$/, '');
      return `${sign}${hideSymbol ? '' : '₹'}${lakhs}L`;
    }
    const thousands = (absAmount / 1000).toFixed(1).replace(/\.0$/, '');
    return `${sign}${hideSymbol ? '' : '₹'}${thousands}k`;
  }

  // Indian currency numbering regex: 10,00,000
  const numStr = absAmount.toString();
  let lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  
  let formatted = '';
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
    formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  } else {
    formatted = lastThree;
  }

  return `${sign}${hideSymbol ? '' : '₹'}${formatted}`;
}

export function formatINRWithDecimals(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const isNegative = rounded < 0;
  const abs = Math.abs(rounded);
  const parts = abs.toFixed(2).split('.');
  
  const intPart = formatINR(parseInt(parts[0], 10), { hideSymbol: true });
  return `${isNegative ? '-' : ''}₹${intPart}.${parts[1]}`;
}

export function parseINR(input: string): number {
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}
