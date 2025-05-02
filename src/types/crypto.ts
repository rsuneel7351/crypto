export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  description?: string;
  categories?: string[];
  sparkline_in_7d?: {
    price: number[];
  };
  links?: {
    homepage?: string[];
    blockchain_site?: string[];
    official_forum_url?: string[];
    chat_url?: string[];
    announcement_url?: string[];
    twitter_screen_name?: string;
    facebook_username?: string;
    telegram_channel_identifier?: string;
    subreddit_url?: string;
    repos_url?: {
      github?: string[];
      bitbucket?: string[];
    };
  };
  last_updated?: string;
}

export interface HistoricalData {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][]; // [timestamp, market_cap]
  total_volumes: [number, number][]; // [timestamp, volume]
}

export type TimeRange = '1d' | '7d' | '30d' | '90d' | '1y' | 'max';
