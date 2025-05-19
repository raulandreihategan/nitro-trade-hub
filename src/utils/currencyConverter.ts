
/**
 * Currency conversion utility functions
 */

// List of supported currencies with their codes and symbols
export const supportedCurrencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

// Get currency symbol from currency code
export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = supportedCurrencies.find(c => c.code === currencyCode);
  return currency ? currency.symbol : '$';
};

// Exchange rates against USD (base currency)
// These would ideally come from an API, but for now we'll use static rates
export const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.23,
  CAD: 1.38,
  AUD: 1.52,
};

/**
 * Convert amount from one currency to another
 * @param amount The amount to convert
 * @param fromCurrency The source currency code
 * @param toCurrency The target currency code
 * @returns The converted amount
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number => {
  // If currencies are the same, no conversion needed
  if (fromCurrency === toCurrency) return amount;
  
  // Get exchange rates
  const fromRate = exchangeRates[fromCurrency as keyof typeof exchangeRates] || 1;
  const toRate = exchangeRates[toCurrency as keyof typeof exchangeRates] || 1;
  
  // Convert to USD first (as base), then to target currency
  const amountInUSD = amount / fromRate;
  const convertedAmount = amountInUSD * toRate;
  
  // Round to 2 decimal places
  return Math.round(convertedAmount * 100) / 100;
};

/**
 * Format amount with currency symbol
 * @param amount The amount to format
 * @param currencyCode The currency code
 * @returns Formatted string with currency symbol
 */
export const formatCurrency = (amount: number, currencyCode: string): string => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${amount.toFixed(2)}`;
};
