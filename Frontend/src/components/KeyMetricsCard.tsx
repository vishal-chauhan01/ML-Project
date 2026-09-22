import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { Stock } from '../types/stock';


interface KeyMetricsCardProps {
  stock: Stock;
}

export const KeyMetricsCard: React.FC<KeyMetricsCardProps> = ({ stock }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-tight">Key metrics</h3>
          <p className="text-xs text-slate-400 font-medium">Fundamental snapshot</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 2x2 Metrics Grid */}
      <div className="grid grid-cols-2 gap-y-5 gap-x-4">
        <div>
          <span className="block text-xs text-slate-400 font-medium mb-1">52-week range</span>
          <span className="text-xs sm:text-sm font-semibold text-slate-900">
            {stock.keyMetrics.range52W}
          </span>
        </div>

        <div>
          <span className="block text-xs text-slate-400 font-medium mb-1">Today's open</span>
          <span className="text-xs sm:text-sm font-semibold text-slate-900">
            {stock.keyMetrics.todaysOpen}
          </span>
        </div>

        <div>
          <span className="block text-xs text-slate-400 font-medium mb-1">Avg. volume</span>
          <span className="text-xs sm:text-sm font-semibold text-slate-900">
            {stock.keyMetrics.avgVolume}
          </span>
        </div>

        <div>
          <span className="block text-xs text-slate-400 font-medium mb-1">Analyst rating</span>
          <div className="text-xs sm:text-sm font-semibold">
            <span className="text-emerald-600 font-bold">Buy </span>
            <span className="text-slate-900">4.7/5</span>
          </div>
        </div>
      </div>
    </div>
  );
};
