import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  YAxis,
  Tooltip,
} from 'recharts';
import type { Stock } from '../types/stock';

interface StockOverviewProps {
  stock: Stock;
}

export const StockOverview: React.FC<StockOverviewProps> = ({ stock }) => {
  const isPositive = stock.priceChange >= 0;
  const currencySymbol =
    stock.exchange === 'NSE' || stock.symbol.endsWith('.NS') || stock.id === 'reliance'
      ? '₹'
      : '$';

  // Extract chart data from '7D' timeframe for mini trend & volume
  const trendData = stock.timeframes['7D']?.chartData.map((d, i) => ({
    date: d.date,
    price: d.historical !== undefined ? d.historical : d.forecast,
    volume: Math.round(500000 + ((i * 137) % 300000)),
  })) || [];

  const prices = trendData.map((d) => d.price).filter((p): p is number => p !== undefined);
  const minPrice = prices.length ? Math.floor(Math.min(...prices) * 0.98) : 0;
  const maxPrice = prices.length ? Math.ceil(Math.max(...prices) * 1.02) : 100;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const priceItem = payload.find((p: any) => p.dataKey === 'price');
      return (
        <div className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 shadow-md text-white text-xs">
          <p className="text-[10px] text-slate-400">{label}</p>
          {priceItem && (
            <p className="font-bold text-emerald-400">
              {currencySymbol}
              {Number(priceItem.value).toFixed(2)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs mb-6 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Section: Company Name, Symbol, Exchange, Price */}
        <div className="shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {stock.name}
            </span>
            <span className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
              {stock.exchange}
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currencySymbol}
              {stock.currentPrice.toFixed(2)}
            </span>
            <div
              className={`flex items-center gap-0.5 text-sm sm:text-base font-bold ${
                isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>
                {isPositive ? `+${stock.priceChange.toFixed(2)}` : stock.priceChange.toFixed(2)}{' '}
                ({isPositive ? `+${stock.percentageChange}%` : `${stock.percentageChange}%`})
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {stock.asOfTime}
          </p>
        </div>

        {/* Center Section: Interactive Recharts Mini Sparkline + Volume */}
        <div className="flex-1 min-w-0 max-w-xs h-[75px] bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-2 border border-slate-100 dark:border-slate-800/60 hidden sm:block">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> 7-Day Trend & Volume
            </span>
          </div>
          <ResponsiveContainer width="100%" height={45}>
            <ComposedChart data={trendData} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isPositive ? '#10b981' : '#f43f5e'}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor={isPositive ? '#10b981' : '#f43f5e'}
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <YAxis yAxisId="price" domain={[minPrice, maxPrice]} hide={true} />
              <YAxis yAxisId="volume" domain={[0, 1000000]} hide={true} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill={isPositive ? '#a7f3d0' : '#fecdd3'}
                opacity={0.5}
                barSize={6}
              />
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke={isPositive ? '#10b981' : '#f43f5e'}
                strokeWidth={2}
                fill="url(#trendGradient)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Right Section: Today's Range, Volume, Market Cap */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:items-center gap-4 sm:gap-8 md:gap-12 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 pt-4 lg:pt-0">
          <div>
            <span className="block text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">
              Today's range
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {stock.todaysRange}
            </span>
          </div>
          <div>
            <span className="block text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">
              Volume
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {stock.volume}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="block text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">
              Market cap
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {stock.marketCap}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
