import React, { useEffect, useState } from 'react';
import { Sparkles, BarChart2, Activity, ShieldCheck } from 'lucide-react';

import { apiService } from '../services/api';

export const MarketInsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getMarketInsights().then((data) => {
      setInsights(data);
      setLoading(false);
    });
  }, []);

  if (loading || !insights) {
    return (
      <div className="py-20 text-center text-slate-400 font-medium">
        Loading AI Market Intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Market Insights
          </h1>
        </div>
        <p className="text-sm text-slate-500">
          AI-generated macro economics, sector sentiment, and technical indicators.
        </p>
      </div>

      {/* AI Macro Executive Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          Macro Executive Intelligence
        </div>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
          "{insights.macroSummary}"
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
          <span>Model Update: <strong>10 min ago</strong></span>
          <span>Market Regimes: <strong>High Conviction Expansion</strong></span>
          <span>Global Liquidity: <strong>Positive</strong></span>
        </div>
      </div>

      {/* Sector Sentiment Heatmap Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-600" />
            Sector Sentiment Heatmap
          </h2>
          <span className="text-xs text-slate-400 font-medium">Real-Time Aggregated Score</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.sectorHeatmap.map((sec: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">{sec.sentiment}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {sec.change}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">{sec.name}</h4>
              <div>
                <div className="flex justify-between text-xs text-slate-500 font-medium mb-1">
                  <span>Score</span>
                  <span className="font-bold text-slate-800">{sec.score} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${sec.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep-Dive Technical Analysis Cards */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-600" />
          Technical Indicator Breakdown & AI Deep Dives
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {insights.deepDives.map((deep: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">
                    {deep.symbol}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    High Reliability
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{deep.title}</h3>

                {/* Technical Indicators 2x2 Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block mb-0.5">RSI (14)</span>
                    <strong className="text-slate-800">{deep.rsi}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">MACD</span>
                    <strong className="text-slate-800">{deep.macd}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">20-Day MA</span>
                    <strong className="text-slate-800">{deep.ma20}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Bollinger</span>
                    <strong className="text-slate-800">{deep.bollinger}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{deep.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
