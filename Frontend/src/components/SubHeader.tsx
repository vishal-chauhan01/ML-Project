import React from 'react';
import { Search, Star, Clock, Info, ChevronDown } from 'lucide-react';
import type { Stock } from '../types/stock';


interface SubHeaderProps {
  stocks: Stock[];
  selectedStock: Stock;
  onSelectStock: (stock: Stock) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onToggleWatchlist: (stockId: string) => void;
}

export const SubHeader: React.FC<SubHeaderProps> = ({
  stocks,
  selectedStock,
  onSelectStock,
  searchQuery,
  setSearchQuery,
  onToggleWatchlist,
}) => {
  return (
    <div className="space-y-5 mb-6">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              INDIA MARKET OPEN
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              9:15 AM – 3:30 PM IST
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Good morning
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Explore AI-powered predictions for your favorite stocks.
          </p>
        </div>

        {/* Watchlist Toggle Button */}
        <div>
          <button
            onClick={() => onToggleWatchlist(selectedStock.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all shadow-xs ${
              selectedStock.isSavedToWatchlist
                ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Star
              className={`w-4 h-4 ${
                selectedStock.isSavedToWatchlist ? 'fill-blue-600 text-blue-600' : 'text-slate-400'
              }`}
            />
            {selectedStock.isSavedToWatchlist ? 'Saved to watchlist' : 'Add to watchlist'}
          </button>
        </div>
      </div>

      {/* Control Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          {/* Stock Select Dropdown */}
          <div className="relative w-full sm:w-auto text-left">
            <div className="flex items-center w-full bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition-colors">
              <div className="w-7 h-7 ml-3 shrink-0 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                {selectedStock.symbol.charAt(0)}
              </div>
              <select
                value={selectedStock.id}
                onChange={(e) => {
                  const found = stocks.find((s) => s.id === e.target.value);
                  if (found) onSelectStock(found);
                }}
                className="w-full appearance-none bg-transparent pl-2.5 pr-8 py-2 text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
              >
                {stocks.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.symbol} · {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full sm:w-auto sm:min-w-[220px] sm:max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stocks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Prediction Update Info */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium self-start sm:self-auto">
          <span>Predictions updated 5 min ago</span>
          <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" />
        </div>
      </div>
    </div>
  );
};
