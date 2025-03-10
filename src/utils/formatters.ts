
/**
 * Utility function for formatting currency values
 * @param value - The numerical value to format as currency
 * @returns Formatted currency string in USD
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};
