/**
 * Converts a weight value to a human-readable string
 * @param size - Weight in grams (number or string)
 * @returns Formatted weight string (e.g., "1.5kg" or "500g")
 */
export const convertSize = (size: number | string): string => {
  const value = typeof size === 'string' ? parseInt(size, 10) : size;

  if (isNaN(value)) {
    return '0g';
  }

  if (value >= 1000) {
    const kg = value / 1000;
    // Remove trailing zeros
    return `${kg % 1 === 0 ? kg.toFixed(0) : kg.toFixed(1)}kg`;
  }

  return `${value}g`;
};

/**
 * Converts kg to grams
 */
export const kgToGrams = (kg: number): number => kg * 1000;

/**
 * Converts grams to kg
 */
export const gramsToKg = (grams: number): number => grams / 1000;
