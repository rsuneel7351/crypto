import { rateLimiter } from "@/utils/rateLimiter";
import { Cryptocurrency, HistoricalData, TimeRange } from "../types/crypto";
import { apiKeyManager } from "@/utils/apiKeyManager";

const API_BASE_URL = "https://api.coingecko.com/api/v3";

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'x-cg-demo-api-key': apiKeyManager.getNextKey()
  };
};

const timeRangeToParams = (range: TimeRange): { days: string } => {
  switch (range) {
    case '1d':
      return { days: '1' };
    case '7d':
      return { days: '7' };
    case '30d':
      return { days: '30' };
    case '90d':
      return { days: '90' };
    case '1y':
      return { days: '365' };
    case 'max':
      return { days: 'max' };
    default:
      return { days: '7' };
  }
};

export const fetchCryptocurrencies = async (
  page: number = 1,
  perPage: number = 20
): Promise<Cryptocurrency[]> => {
  try {
    await rateLimiter.waitForNextRequest();
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h,7d`,
      {
        headers: getHeaders()
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cryptocurrencies");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cryptocurrencies:", error);
    throw error;
  }
};

export const fetchFavoriteCryptocurrencies = async (ids: string[]): Promise<Cryptocurrency[]> => {
  try {
    await rateLimiter.waitForNextRequest();
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${ids.join(",")}&order=market_cap_desc&sparkline=true&price_change_percentage=24h,7d`,
      {
        headers: getHeaders()
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch favorite cryptocurrencies");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching favorite cryptocurrencies:", error);
    throw error;
  }
};

export const fetchCryptocurrencyDetails = async (id: string): Promise<Cryptocurrency> => {
  try {
    await rateLimiter.waitForNextRequest();
    const response = await fetch(
      `${API_BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`,
      {
        headers: getHeaders()
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cryptocurrency details");
    }

    const data = await response.json();

    return {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      image: data.image.large,
      current_price: data.market_data.current_price.usd,
      market_cap: data.market_data.market_cap.usd,
      market_cap_rank: data.market_cap_rank,
      price_change_percentage_24h: data.market_data.price_change_percentage_24h,
      price_change_percentage_7d_in_currency: data.market_data.price_change_percentage_7d_in_currency?.usd,
      circulating_supply: data.market_data.circulating_supply,
      total_supply: data.market_data.total_supply,
      max_supply: data.market_data.max_supply,
      description: data.description?.en || "",
      categories: data.categories || [],
      links: data.links || {},
      last_updated: data.last_updated
    };
  } catch (error) {
    console.error("Error fetching cryptocurrency details:", error);
    throw error;
  }
};

export const fetchHistoricalData = async (
  id: string,
  range: TimeRange
): Promise<HistoricalData> => {
  try {
    await rateLimiter.waitForNextRequest();
    const { days } = timeRangeToParams(range);
    const response = await fetch(
      `${API_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: getHeaders()
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch historical data");
    }

    const data = await response.json();

    // Ensure the data is properly formatted
    if (!data.prices || !Array.isArray(data.prices)) {
      throw new Error("Invalid historical data format");
    }

    // Sort the data by timestamp to ensure chronological order
    const sortedPrices = [...data.prices].sort((a: [number, number], b: [number, number]) => a[0] - b[0]);

    return {
      prices: sortedPrices,
      market_caps: data.market_caps || [],
      total_volumes: data.total_volumes || []
    };
  } catch (error) {
    console.error("Error fetching historical data:", error, 'kaddu');
    throw error;
  }
};

export const searchCryptocurrencies = async (query: string): Promise<Cryptocurrency[]> => {
  try {
    await rateLimiter.waitForNextRequest();
    const response = await fetch(
      `${API_BASE_URL}/search?query=${query}`,
      {
        headers: getHeaders()
      }
    );

    if (!response.ok) {
      throw new Error("Failed to search cryptocurrencies");
    }

    const data = await response.json();

    if (!data.coins || data.coins.length === 0) {
      return [];
    }

    // Get top 10 results
    const topResults = data.coins.slice(0, 10);
    const coinIds = topResults.map((coin: any) => coin.id).join(",");

    if (!coinIds) {
      return [];
    }

    // Fetch detailed information for these coins
    await rateLimiter.waitForNextRequest();
    const detailedResponse = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`,
      {
        headers: getHeaders()
      }
    );

    if (!detailedResponse.ok) {
      throw new Error("Failed to fetch detailed cryptocurrency information");
    }

    return await detailedResponse.json();
  } catch (error) {
    console.error("Error searching cryptocurrencies:", error);
    throw error;
  }
};

export const HistoricalChart = (id, days = 365, currency) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;