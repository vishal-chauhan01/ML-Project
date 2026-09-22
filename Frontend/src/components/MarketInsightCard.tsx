import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import type { Stock } from '../types/stock';


interface MarketInsightCardProps {
  stock: Stock;
}

export const MarketInsightCard: React.FC<MarketInsightCardProps> = ({ stock }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">Market insight</h3>
            <p className="text-xs text-slate-400 font-medium">What the model is seeing</p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
            <Sparkles className="w-3.5 h-3.5" />
            AI generated
          </span>
        </div>

        {/* Insight Body Text */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-4">
          {stock.marketInsight}
        </p>
      </div>

      {/* Action Link */}
      <div className="pt-4 mt-4 border-t border-slate-100">
        <a
          href="#market-insights"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Read full analysis
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
