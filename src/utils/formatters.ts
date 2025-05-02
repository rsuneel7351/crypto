
export const formatPrice = (price: number): string => {
  if (price === undefined || price === null) return "N/A";

  // For very small numbers (less than 0.01)
  if (price < 0.01 && price > 0) {
    return "$" + price.toFixed(6);
  }

  // For numbers less than 1 but >= 0.01
  if (price < 1 && price >= 0.01) {
    return "$" + price.toFixed(4);
  }

  // For regular prices
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

export const formatMarketCap = (marketCap: number): string => {
  if (marketCap === undefined || marketCap === null) return "N/A";

  if (marketCap >= 1_000_000_000_000) {
    return "$" + (marketCap / 1_000_000_000_000).toFixed(2) + "T";
  }

  if (marketCap >= 1_000_000_000) {
    return "$" + (marketCap / 1_000_000_000).toFixed(2) + "B";
  }

  if (marketCap >= 1_000_000) {
    return "$" + (marketCap / 1_000_000).toFixed(2) + "M";
  }

  return "$" + (marketCap / 1_000).toFixed(2) + "K";
};

export const formatPercentage = (percentage: number | undefined): string => {
  if (percentage === undefined || percentage === null) return "N/A";
  
  return percentage.toFixed(2) + "%";
};

export const formatSupply = (supply: number): string => {
  if (supply === undefined || supply === null) return "N/A";

  if (supply >= 1_000_000_000) {
    return (supply / 1_000_000_000).toFixed(2) + "B";
  }

  if (supply >= 1_000_000) {
    return (supply / 1_000_000).toFixed(2) + "M";
  }

  if (supply >= 1_000) {
    return (supply / 1_000).toFixed(2) + "K";
  }

  return supply.toFixed(2);
};
