export type CoinGeckoAsset = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
};

export type ExchangeRateAsset = {
  timestamp: number;
  source: string;
  quotes: Record<string, number>;
};
