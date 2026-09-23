import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import type { Stock } from '../types/stock';


interface MarketInsightCardProps {
  stock: Stock;
}

export const MarketInsightCard: React.FC<MarketInsightCardProps> = ({ stock }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between transition-colors">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Market insight</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">What the model is seeing</p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
            <Sparkles className="w-3.5 h-3.5" />
            AI generated
          </span>
        </div>

        {/* Insight Body Text */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
          {stock.marketInsight}
        </p>
      </div>

      {/* Action Link */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
        <a
          href="#market-insights"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Read full analysis
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
