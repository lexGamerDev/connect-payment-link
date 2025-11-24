// Currency formatting utilities

export const CURRENCY = {
  LAK: {
    code: 'LAK',
    symbol: '₭',
    name: 'Lao Kip',
    locale: 'lo-LA'
  }
} as const;

export const formatPrice = (price: number, currency: 'LAK' = 'LAK'): string => {
  const currencyInfo = CURRENCY[currency];
  
  try {
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: currencyInfo.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  } catch (error) {
    // Fallback if locale is not supported
    return `${currencyInfo.symbol}${new Intl.NumberFormat('en-US').format(price)}`;
  }
};

export const formatPriceSimple = (price: number): string => {
  return `₭${new Intl.NumberFormat('en-US').format(price)}`;
};
