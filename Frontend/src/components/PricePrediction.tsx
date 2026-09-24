import React from 'react';
import { Sparkles, Cpu, Activity, Zap, BarChart2 } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { Stock, Timeframe } from '../types/stock';

interface PricePredictionProps {
  stock: Stock;
  activeTimeframe: Timeframe;
  onSelectTimeframe: (tf: Timeframe) => void;
  activeModelType: string;
  onSelectModelType: (modelType: string) => void;
}

export const PricePrediction: React.FC<PricePredictionProps> = ({
  stock,
  activeTimeframe,
  onSelectTimeframe,
  activeModelType,
  onSelectModelType,
}) => {
  const currentForecast = stock.timeframes[activeTimeframe];
  const timeframes: Timeframe[] = ['7D', '30D', '90D'];

  const modelOptions = [
    { id: 'linear', label: 'Linear Regression', icon: Activity, tag: 'OLS Linear' },
    { id: 'polynomial', label: 'Polynomial Reg.', icon: Zap, tag: 'Quadratic d=2' },
    { id: 'rbf', label: 'RBF Kernel SVR', icon: Cpu, tag: 'Hilbert RBF' },
    { id: 'rf', label: 'Random Forest', icon: BarChart2, tag: 'Ensemble' },
  ];

  const currencySymbol =
    stock.exchange === 'NSE' || stock.symbol.endsWith('.NS') || stock.id === 'reliance'
      ? '₹'
      : '$';

  // Format chart data for Recharts
  const formattedChartData = currentForecast.chartData.map((d) => ({
    date: d.date,
    historical: d.historical !== undefined ? d.historical : null,
    forecast: d.forecast !== undefined ? d.forecast : null,
    confidenceRange:
      d.forecast !== undefined
        ? [+(d.forecast * 0.985).toFixed(2), +(d.forecast * 1.015).toFixed(2)]
        : null,
  }));

  const allVals = currentForecast.chartData
    .flatMap((d) => [d.historical, d.forecast])
    .filter((v): v is number => v !== undefined);
  const minVal = Math.floor(Math.min(...allVals) * 0.96);
  const maxVal = Math.ceil(Math.max(...allVals) * 1.04);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const histItem = payload.find((p: any) => p.dataKey === 'historical');
      const fcItem = payload.find((p: any) => p.dataKey === 'forecast');

      return (
        <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 shadow-xl text-white text-xs space-y-1">
          <p className="font-semibold text-slate-400 border-b border-slate-800 pb-1">{label}</p>
          {histItem && histItem.value !== null && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-slate-300">Historical:</span>
              <span className="font-bold text-blue-400">
                {currencySymbol}
                {Number(histItem.value).toFixed(2)}
              </span>
            </div>
          )}
          {fcItem && fcItem.value !== null && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span className="text-slate-300">{activeModelType.toUpperCase()} Forecast:</span>
              <span className="font-bold text-purple-400">
                {currencySymbol}
                {Number(fcItem.value).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Model Selection Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
              Active ML Model Engine
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              Direct FastAPI Python ML Inference
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {modelOptions.map((m) => {
            const Icon = m.icon;
            const isSelected = activeModelType === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectModelType(m.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-blue-600 dark:bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                  }`}
                />
                <div className="text-left">
                  <div className="leading-tight">{m.label}</div>
                  <div
                    className={`text-[9px] font-normal ${
                      isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {m.tag}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Header & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Price prediction
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-400">
            Historical performance and projected price range using{' '}
            <strong className="text-blue-600 dark:text-blue-400 uppercase">
              {activeModelType}
            </strong>{' '}
            model
          </p>
        </div>

        {/* Timeframe Selector Pills */}
        <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
          {timeframes.map((tf) => {
            const isActive = activeTimeframe === tf;
            return (
              <button
                key={tf}
                type="button"
                onClick={() => onSelectTimeframe(tf)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: Interactive Recharts Chart Card + AI Forecast Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Interactive Recharts Chart Card */}
        <div className="lg:col-span-2 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs flex flex-col justify-between transition-colors">
          {/* Legend */}
          <div className="flex items-center justify-end gap-6 mb-3 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-[3px] bg-blue-600 rounded-full"></span>
              <span className="text-slate-500 dark:text-slate-400">Historical Price</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-[3px] bg-purple-500 border-b border-dashed border-purple-500 rounded-full"></span>
              <span className="text-slate-500 dark:text-slate-400">
                {activeModelType.toUpperCase()} Forecast
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500/20 border border-purple-400/40 rounded"></span>
              <span className="text-slate-500 dark:text-slate-400">Confidence Band</span>
            </div>
          </div>

          {/* Recharts Container */}
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={formattedChartData}
                margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="purpleConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800/80"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  domain={[minVal, maxVal]}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${currencySymbol}${val}`}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Prediction Confidence Band Area */}
                <Area
                  type="monotone"
                  dataKey="confidenceRange"
                  stroke="none"
                  fill="url(#purpleConfidence)"
                  isAnimationActive={true}
                />

                {/* Historical Solid Line */}
                <Line
                  type="monotone"
                  dataKey="historical"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#1d4ed8' }}
                  connectNulls={true}
                />

                {/* Forecast Dashed Line */}
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#a855f7"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#7e22ce' }}
                  connectNulls={true}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Footer info */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-400 dark:text-slate-500">
            <span>
              Current {currencySymbol}
              {stock.currentPrice.toFixed(2)}
            </span>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentForecast.currentVsForecastLabel}</span>
            </div>
          </div>
        </div>

        {/* Right AI Forecast Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div className="space-y-6">
            {/* Top Row: Icon + Label + Confidence Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
                    AI forecast
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {activeTimeframe} outlook
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                {currentForecast.confidence}% confidence
              </span>
            </div>

            {/* Projected Price & % Change */}
            <div className="pt-2">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">
                Projected price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {currentForecast.projectedPrice}
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {currentForecast.percentageChange}
                </span>
              </div>
            </div>

            {/* Confidence Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(currentForecast.confidence, 100)}%` }}
              ></div>
            </div>

            {/* Signal */}
            <div className="pt-1">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-0.5">
                Signal
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {currentForecast.signal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
