import { z } from 'zod';

export type Timeframe = '7D' | '30D' | '90D';

export const ChartPointSchema = z.object({
  date: z.string(),
  historical: z.number().optional(),
  forecast: z.number().optional(),
});

export const TimeframeDataSchema = z.object({
  projectedPrice: z.string(),
  percentageChange: z.string(),
  confidence: z.number(),
  signal: z.string(),
  chartData: z.array(ChartPointSchema),
  currentVsForecastLabel: z.string(),
});

export const StockKeyMetricsSchema = z.object({
  range52W: z.string(),
  todaysOpen: z.string(),
  avgVolume: z.string(),
  analystRating: z.string(),
});

export const StockSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  exchange: z.string(),
  currentPrice: z.number(),
  priceChange: z.number(),
  percentageChange: z.number(),
  asOfTime: z.string(),
  todaysRange: z.string(),
  volume: z.string(),
  marketCap: z.string(),
  isSavedToWatchlist: z.boolean(),
  timeframes: z.record(z.string(), TimeframeDataSchema),
  marketInsight: z.string(),
  keyMetrics: StockKeyMetricsSchema,
});

export const MarketInsightSchema = z.object({
  macroSummary: z.string(),
  sectorHeatmap: z.array(
    z.object({
      name: z.string(),
      sentiment: z.string(),
      score: z.number(),
      change: z.string(),
    })
  ),
  deepDives: z.array(
    z.object({
      symbol: z.string(),
      title: z.string(),
      rsi: z.string(),
      macd: z.string(),
      ma20: z.string(),
      bollinger: z.string(),
      summary: z.string(),
    })
  ),
});

export const ModelMetricSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  accuracy: z.string(),
  directionalAccuracy: z.string(),
  mae: z.string(),
  rmse: z.string(),
  r2Score: z.string(),
  features: z.array(z.string()),
});

// Infer TypeScript types directly from Zod schemas to guarantee 100% type alignment
export type ChartPoint = z.infer<typeof ChartPointSchema>;
export type TimeframeData = z.infer<typeof TimeframeDataSchema>;
export type Stock = z.infer<typeof StockSchema>;
export type MarketInsight = z.infer<typeof MarketInsightSchema>;
export type ModelMetric = z.infer<typeof ModelMetricSchema>;

