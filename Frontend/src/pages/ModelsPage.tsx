import React, { useEffect, useState } from 'react';
import { Cpu, Play, CheckCircle2, Zap, RefreshCw } from 'lucide-react';

import { apiService } from '../services/api';
import type { Stock } from '../types/stock';

interface ModelsPageProps {
  stocks: Stock[];
}

export const ModelsPage: React.FC<ModelsPageProps> = ({ stocks }) => {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Inference Sandbox State
  const [selectedStockId, setSelectedStockId] = useState<string>('');
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('7D');
  const [inferenceResult, setInferenceResult] = useState<any>(null);
  const [inferring, setInferring] = useState(false);

  useEffect(() => {
    if (stocks.length > 0 && !selectedStockId) {
      setSelectedStockId(stocks[0].id);
    }
  }, [stocks]);

  useEffect(() => {
    apiService.getModels().then((data) => {
      setModels(data);
      if (data && data.length > 0) {
        setSelectedModelId(data[0].id);
      }
      setLoading(false);
    });
  }, []);

  const handleRunInference = async () => {
    if (!selectedStockId || !selectedModelId) return;
    setInferring(true);
    const res = await apiService.runPrediction(selectedStockId, selectedModelId, selectedTimeframe);
    setInferenceResult(res);
    setInferring(false);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-medium">
        Loading AI Machine Learning Models...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            AI Machine Learning Models
          </h1>
        </div>
        <p className="text-sm text-slate-500">
          Architecture overview, hyper-parameter configs, and live prediction sandbox.
        </p>
      </div>

      {/* Interactive Model Inference Sandbox Banner */}
      <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
          <Zap className="w-4 h-4 fill-blue-600 text-blue-600" />
          Interactive Live Model Inference Sandbox
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          {/* Select Stock */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Select Stock</label>
            <select
              value={selectedStockId}
              onChange={(e) => setSelectedStockId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              {stocks.length === 0 && <option value="">No stocks available</option>}
              {stocks.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.symbol} · {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Model */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Select AI Model</label>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              {models.length === 0 && <option value="">No models loaded</option>}
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Horizon */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Horizon Timeframe</label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="7D">7 Days Horizon</option>
              <option value="30D">30 Days Horizon</option>
              <option value="90D">90 Days Horizon</option>
            </select>
          </div>

          {/* Action Button */}
          <div className="flex items-end">
            <button
              onClick={handleRunInference}
              disabled={inferring || !selectedStockId || !selectedModelId}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {inferring ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running Inference...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Run Model Inference
                </>
              )}
            </button>
          </div>
        </div>

        {/* Inference Results Output */}
        {inferenceResult && (
          <div className="mt-4 pt-4 border-t border-slate-100 bg-purple-50/60 rounded-xl p-4 border border-purple-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">
                    {inferenceResult.stockSymbol}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    Model: <strong>{inferenceResult.modelName}</strong>
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {inferenceResult.projectedPrice}
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    {inferenceResult.percentageChange}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    (Current: {inferenceResult.currentPrice})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Model Confidence</span>
                  <span className="text-sm font-extrabold text-emerald-700">
                    {inferenceResult.confidence}%
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Signal</span>
                  <span className="text-xs font-bold text-purple-700">
                    {inferenceResult.signal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((model) => (
          <div
            key={model.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-0.5">
                    {model.type}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{model.name}</h3>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                    model.status.includes('Active')
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {model.status}
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">{model.description}</p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">R² Accuracy</span>
                  <span className="text-xs font-extrabold text-blue-600">{model.accuracy}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Dir. Acc</span>
                  <span className="text-xs font-extrabold text-purple-600">{model.directionalAccuracy || '50.0%'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">MAE</span>
                  <span className="text-xs font-extrabold text-slate-900">{model.mae}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">RMSE</span>
                  <span className="text-xs font-extrabold text-slate-900">{model.rmse}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">R² Score</span>
                  <span className="text-xs font-extrabold text-slate-900">{model.r2Score}</span>
                </div>
              </div>

              {/* Features Tags */}
              <div>
                <span className="text-xs text-slate-400 font-semibold block mb-1.5">
                  Input Features & Signals
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(model.features || []).map((feat: string, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Training: {model.trainEpochs}</span>
              <span className="flex items-center gap-1 text-slate-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Validated on Test Split
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
