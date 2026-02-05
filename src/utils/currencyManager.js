/**
 * Currency Manager System
 * Handles currency formatting and conversion
 */

export const currencies = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRate: 1, // Base currency
  },
  TZS: {
    code: 'TZS',
    symbol: 'TSh',
    name: 'Tanzanian Shilling',
    exchangeRate: 2500, // Example: 1 USD = 2500 TZS (update as needed)
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    exchangeRate: 0.92, // Example: 1 USD = 0.92 EUR (update as needed)
  },
};

/**
 * Format amount to currency format
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (e.g., 'TZS', 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  const curr = currencies[currency];
  if (!curr) return `${amount}`;

  // Handle large numbers with thousand separators
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${curr.symbol} ${formatted}`;
};

/**
 * Format amount with full currency info
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted string like "TSh 5,000 (TZS)"
 */
export const formatCurrencyFull = (amount, currency = 'USD') => {
  const curr = currencies[currency];
  if (!curr) return `${amount}`;

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${curr.symbol} ${formatted} (${curr.code})`;
};

/**
 * Convert between currencies
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - From currency code
 * @param {string} toCurrency - To currency code
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency = 'USD', toCurrency = 'USD') => {
  const from = currencies[fromCurrency];
  const to = currencies[toCurrency];

  if (!from || !to) return amount;

  // Convert to base (USD) first, then to target
  const inUSD = amount / from.exchangeRate;
  return inUSD * to.exchangeRate;
};

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency = 'USD') => {
  return currencies[currency]?.symbol || '$';
};

/**
 * Get currency name
 * @param {string} currency - Currency code
 * @returns {string} Currency name
 */
export const getCurrencyName = (currency = 'USD') => {
  return currencies[currency]?.name || 'Unknown';
};

/**
 * Parse currency string back to number
 * @param {string} currencyString - String like "$ 5,000.50"
 * @returns {number} Parsed number
 */
export const parseCurrencyString = (currencyString) => {
  // Remove currency symbols and spaces, keep only numbers and decimal point
  return parseFloat(currencyString.replace(/[^\d.-]/g, ''));
};

/**
 * Format table cell with currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} HTML formatted string
 */
export const formatCurrencyTable = (amount, currency = 'USD') => {
  const curr = currencies[currency];
  if (!curr) return `${amount}`;

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${curr.symbol} ${formatted}`;
};

/**
 * Get all available currencies
 * @returns {array} Array of currency options
 */
export const getAvailableCurrencies = () => {
  return Object.keys(currencies).map((code) => ({
    code,
    symbol: currencies[code].symbol,
    name: currencies[code].name,
  }));
};

/**
 * Validate currency code
 * @param {string} currency - Currency code to validate
 * @returns {boolean} True if valid currency
 */
export const isValidCurrency = (currency) => {
  return Object.keys(currencies).includes(currency);
};

export default {
  currencies,
  formatCurrency,
  formatCurrencyFull,
  convertCurrency,
  getCurrencySymbol,
  getCurrencyName,
  parseCurrencyString,
  formatCurrencyTable,
  getAvailableCurrencies,
  isValidCurrency,
};
