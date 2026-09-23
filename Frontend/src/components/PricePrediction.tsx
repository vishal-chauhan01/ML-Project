import React, { useState } from 'react';
import { Sparkles, Cpu, Activity, Zap, BarChart2 } from 'lucide-react';
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
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const modelOptions = [
    { id: 'linear', label: 'Linear Regression', icon: Activity, tag: 'OLS Linear' },
    { id: 'polynomial', label: 'Polynomial Reg.', icon: Zap, tag: 'Quadratic d=2' },
    { id: 'rbf', label: 'RBF Kernel SVR', icon: Cpu, tag: 'Hilbert RBF' },
    { id: 'rf', label: 'Random Forest', icon: BarChart2, tag: 'Ensemble' },
  ];

  const chartData = currentForecast.chartData;
  const historicalPoints = chartData.filter((d) => d.historical !== undefined);
  const forecastPoints = chartData.filter((d) => d.forecast !== undefined);

  // Min and max values for Y-axis calculation
  const allValues = chartData
    .map((d) => (d.historical !== undefined ? d.historical : d.forecast!))
    .concat(stock.currentPrice);
  const minVal = Math.floor(Math.min(...allValues) * 0.95);
  const maxVal = Math.ceil(Math.max(...allValues) * 1.05);

  const width = 600;
  const height = 220;
  const paddingX = 45;
  const paddingY = 25;

  const getX = (index: number) => {
    return paddingX + (index / (chartData.length - 1)) * (width - paddingX * 2);
  };

  const getY = (val: number) => {
    return height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - paddingY * 2);
  };

  // Generate SVG path for historical data
  const historicalSvgPath = historicalPoints.reduce((acc, pt, i) => {
    const dataIndex = chartData.findIndex((d) => d.date === pt.date);
    const x = getX(dataIndex);
    const y = getY(pt.historical!);
    if (i === 0) return `M ${x} ${y}`;
    const prevPt = historicalPoints[i - 1];
    const prevIndex = chartData.findIndex((d) => d.date === prevPt.date);
    const prevX = getX(prevIndex);
    const prevY = getY(prevPt.historical!);
    const cpX1 = prevX + (x - prevX) / 2;
    const cpX2 = prevX + (x - prevX) / 2;
    return `${acc} C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
  }, '');

  // Generate SVG path for forecast data
  const forecastSvgPath = forecastPoints.reduce((acc, pt, i) => {
    const dataIndex = chartData.findIndex((d) => d.date === pt.date);
    const x = getX(dataIndex);
    const y = getY(pt.forecast!);
    if (i === 0) return `M ${x} ${y}`;
    const prevPt = forecastPoints[i - 1];
    const prevIndex = chartData.findIndex((d) => d.date === prevPt.date);
    const prevX = getX(prevIndex);
    const prevY = getY(prevPt.forecast!);
    const cpX1 = prevX + (x - prevX) / 2;
    const cpX2 = prevX + (x - prevX) / 2;
    return `${acc} C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
  }, '');

  // Generate shaded area for forecast
  const lastForecastDataIndex = chartData.length - 1;
  const firstForecastDataIndex = chartData.findIndex((d) => d.forecast !== undefined);
  const forecastAreaPath =
    forecastSvgPath +
    ` L ${getX(lastForecastDataIndex)} ${height - paddingY}` +
    ` L ${getX(firstForecastDataIndex)} ${height - paddingY} Z`;

  // Grid Y ticks
  const yTicks = [
    maxVal,
    Math.round(minVal + (maxVal - minVal) * 0.66),
    Math.round(minVal + (maxVal - minVal) * 0.33),
    minVal,
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Model Selection Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-none">Active ML Model Engine</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Direct FastAPI Python ML Inference</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {modelOptions.map((m) => {
            const Icon = m.icon;
            const isSelected = activeModelType === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectModelType(m.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-blue-600 dark:bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                <div className="text-left">
                  <div className="leading-tight">{m.label}</div>
                  <div className={`text-[9px] font-normal ${isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Price prediction</h2>
          <p className="text-sm text-slate-400 dark:text-slate-400">
            Historical performance and projected price range using{' '}
            <strong className="text-blue-600 dark:text-blue-400 uppercase">{activeModelType}</strong> model
          </p>
        </div>

        {/* Timeframe Selector Pills */}
        <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
          {timeframes.map((tf) => {
            const isActive = activeTimeframe === tf;
            return (
              <button
                key={tf}
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

      {/* Grid: Chart Card + AI Forecast Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Chart Card */}
        <div className="lg:col-span-2 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs flex flex-col justify-between transition-colors">
          {/* Legend */}
          <div className="flex items-center justify-end gap-6 mb-2 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-4 h-[2.5px] bg-blue-600 dark:bg-blue-400 rounded-full"></span>
              <span className="text-slate-500 dark:text-slate-400">Historical</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-[2.5px] bg-purple-500 dark:bg-purple-400 rounded-full border-b border-dashed border-purple-500"></span>
              <span className="text-slate-500 dark:text-slate-400">
                {activeModelType.toUpperCase()} Forecast
              </span>
            </div>
          </div>

          {/* SVG Smooth Chart Container */}
          <div className="w-full overflow-hidden relative">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto max-h-[240px] overflow-visible"
            >
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines & Y-ticks */}
              {yTicks.map((tickVal, idx) => {
                const y = getY(tickVal);
                return (
                  <g key={idx}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={width - paddingX}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-100 dark:text-slate-800/80"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      className="fill-slate-400 dark:fill-slate-500 text-[10px] font-medium"
                      textAnchor="end"
                    >
                      {stock.exchange === 'NSE' || stock.symbol.endsWith('.NS') || stock.id === 'reliance' ? '₹' : '$'}{tickVal}
                    </text>
                  </g>
                );
              })}

              {/* Forecast Area Shading */}
              <path d={forecastAreaPath} fill="url(#purpleGradient)" />

              {/* Historical Solid Blue Line */}
              <path
                d={historicalSvgPath}
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Forecast Dashed Purple Line */}
              <path
                d={forecastSvgPath}
                fill="none"
                stroke="#a855f7"
                strokeWidth="3"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />

              {/* Points & X-Axis Labels */}
              {chartData.map((pt, index) => {
                const x = getX(index);
                const val = pt.historical !== undefined ? pt.historical : pt.forecast!;
                const y = getY(val);
                const isHovered = hoverIndex === index;
                const isForecast = pt.forecast !== undefined && pt.historical === undefined;

                return (
                  <g
                    key={index}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    {/* Hover indicator vertical line */}
                    {isHovered && (
                      <line
                        x1={x}
                        y1={paddingY}
                        x2={x}
                        y2={height - paddingY}
                        stroke="#cbd5e1"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Point Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 6 : 4}
                      fill={isForecast ? '#a855f7' : '#2563eb'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-all duration-150"
                    />

                    {/* X-axis date label */}
                    <text
                      x={x}
                      y={height - 5}
                      className="fill-slate-400 dark:fill-slate-500 text-[10px] font-medium"
                      textAnchor="middle"
                    >
                      {pt.date}
                    </text>

                    {/* Tooltip on hover */}
                    {isHovered && (
                      <g transform={`translate(${x - 45}, ${y - 35})`}>
                        <rect
                          width="90"
                          height="26"
                          rx="6"
                          fill="#0f172a"
                          className="shadow-md"
                        />
                        <text
                          x="45"
                          y="17"
                          fill="#ffffff"
                          fontSize="11"
                          fontWeight="600"
                          textAnchor="middle"
                        >
                          {stock.exchange === 'NSE' || stock.symbol.endsWith('.NS') || stock.id === 'reliance' ? '₹' : '$'}{val.toFixed(2)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Chart Footer info */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-400 dark:text-slate-500">
            <span>Current {stock.exchange === 'NSE' || stock.symbol.endsWith('.NS') || stock.id === 'reliance' ? '₹' : '$'}{stock.currentPrice.toFixed(2)}</span>
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
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight">AI forecast</h3>
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
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-0.5">Signal</span>
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
