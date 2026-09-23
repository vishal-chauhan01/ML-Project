import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Stock } from '../types/stock';


interface StockOverviewProps {
  stock: Stock;
}

export const StockOverview: React.FC<StockOverviewProps> = ({ stock }) => {
  const isPositive = stock.priceChange >= 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs mb-6 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Section: Company Name, Symbol, Exchange, Price */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{stock.name}</span>
            <span className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
              {stock.exchange}
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stock.exchange === 'NSE' || stock.symbol.endsWith('.NS') || stock.id === 'reliance' ? '₹' : '$'}{stock.currentPrice.toFixed(2)}
            </span>
            <div
              className={`flex items-center gap-0.5 text-sm sm:text-base font-bold ${
                isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>
                {isPositive ? `+${stock.priceChange.toFixed(2)}` : stock.priceChange.toFixed(2)} (
                {isPositive ? `+${stock.percentageChange}%` : `${stock.percentageChange}%`})
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{stock.asOfTime}</p>
        </div>

        {/* Right Section: Today's Range, Volume, Market Cap */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:items-center gap-4 sm:gap-8 md:gap-12 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
          <div>
            <span className="block text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">Today's range</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{stock.todaysRange}</span>
          </div>
          <div>
            <span className="block text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">Volume</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{stock.volume}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="block text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">Market cap</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{stock.marketCap}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
