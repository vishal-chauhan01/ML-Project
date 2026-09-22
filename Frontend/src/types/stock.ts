export type Timeframe = '7D' | '30D' | '90D';

export interface ChartPoint {
  date: string;
  historical?: number;
  forecast?: number;
}

export interface TimeframeData {
  projectedPrice: string;
  percentageChange: string;
  confidence: number;
  signal: string;
  chartData: ChartPoint[];
  currentVsForecastLabel: string;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  currentPrice: number;
  priceChange: number;
  percentageChange: number;
  asOfTime: string;
  todaysRange: string;
  volume: string;
  marketCap: string;
  isSavedToWatchlist: boolean;
  timeframes: Record<Timeframe, TimeframeData>;
  marketInsight: string;
  keyMetrics: {
    range52W: string;
    todaysOpen: string;
    avgVolume: string;
    analystRating: string;
  };
}
