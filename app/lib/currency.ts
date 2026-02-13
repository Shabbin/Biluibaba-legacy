/**
 * Format a number as BDT currency with comma separators
 * @param amount - The numeric amount to format
 * @returns Formatted string with commas (e.g., "1,234" or "12,345,678")
 */
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '0';
  }
  
  // Round to nearest integer for BDT (no decimals)
  const rounded = Math.round(numAmount);
  
  // Add comma separators
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Parse a formatted currency string back to a number
 * @param formattedAmount - String with commas (e.g., "1,234")
 * @returns Numeric value
 */
export function parseCurrency(formattedAmount: string): number {
  const cleaned = formattedAmount.replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
