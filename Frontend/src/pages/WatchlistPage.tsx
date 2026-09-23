import React from 'react';
import { Star, TrendingUp, ArrowUpRight, ArrowDownRight, Trash2, ArrowRight } from 'lucide-react';
import type { Stock } from '../types/stock';

interface WatchlistPageProps {
  stocks: Stock[];
  onToggleWatchlist: (stockId: string) => void;
  onSelectStockAndNavigate: (stock: Stock) => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  stocks,
  onToggleWatchlist,
  onSelectStockAndNavigate,
}) => {
  const watchlistStocks = stocks.filter((s) => s.isSavedToWatchlist);

  // Dynamic KPI calculation
  const topConvictionStock = watchlistStocks.length > 0
    ? watchlistStocks.reduce((best, cur) => {
        const curConf = cur.timeframes['7D']?.confidence || 0;
        const bestConf = best.timeframes['7D']?.confidence || 0;
        return curConf > bestConf ? cur : best;
      }, watchlistStocks[0])
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 fill-blue-600 dark:fill-blue-400 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Watchlist
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track AI forecasts and live price targets for your saved equities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl shadow-2xs text-xs font-semibold text-slate-600 dark:text-slate-300">
            Saved: <span className="text-blue-600 dark:text-blue-400 font-bold">{watchlistStocks.length} Stocks</span>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-2xs">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block mb-1">Total Saved Assets</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{watchlistStocks.length}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-2xs">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block mb-1">Avg 7D Projected Return</span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {watchlistStocks.length > 0
              ? `${watchlistStocks[0].timeframes['7D']?.percentageChange || '+0.0%'}`
              : 'N/A'}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-2xs">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block mb-1">Top Conviction Forecast</span>
          <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {topConvictionStock
              ? `${topConvictionStock.symbol} (${topConvictionStock.timeframes['7D']?.percentageChange || '+0.0%'})`
              : 'N/A'}
          </span>
        </div>
      </div>

      {/* Watchlist Stock Cards */}
      {watchlistStocks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-12 text-center shadow-xs">
          <Star className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Your Watchlist is empty</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-4">
            Click the "Add to watchlist" star button on any stock overview to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {watchlistStocks.map((stock) => {
            const isPositive = stock.priceChange >= 0;
            const forecast7D = stock.timeframes['7D'];
            const currencySymbol = stock.exchange === 'NSE' || stock.symbol.endsWith('.NS') || stock.id === 'reliance' ? '₹' : '$';

            return (
              <div
                key={stock.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Top Row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-extrabold text-slate-900 dark:text-white">{stock.symbol}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                          {stock.exchange}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mt-0.5">
                        {stock.name}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleWatchlist(stock.id)}
                      className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Current Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {currencySymbol}{stock.currentPrice.toFixed(2)}
                    </span>
                    <span
                      className={`flex items-center text-xs font-bold ${
                        isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                      {isPositive ? `+${stock.percentageChange}%` : `${stock.percentageChange}%`}
                    </span>
                  </div>

                  {/* Forecast Box */}
                  <div className="bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-purple-700 dark:text-purple-300 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        7D AI Forecast
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded">
                        {forecast7D.percentageChange}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs text-slate-600 dark:text-slate-300">
                      <span>Target: <strong className="text-slate-900 dark:text-white">{forecast7D.projectedPrice}</strong></span>
                      <span>Confidence: <strong className="text-slate-900 dark:text-white">{forecast7D.confidence}%</strong></span>
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <button
                  onClick={() => onSelectStockAndNavigate(stock)}
                  className="w-full mt-2 py-2 px-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-xs rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-blue-200 dark:hover:border-blue-800 transition-all flex items-center justify-center gap-1.5"
                >
                  View Full Analytics
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
