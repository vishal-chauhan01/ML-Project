import React, { useState, useEffect } from 'react';
import { Server, RefreshCw, Zap } from 'lucide-react';

interface ColdStartBannerProps {
  isWarmingUp: boolean;
  isLiveConnected: boolean;
  onUseCached: () => void;
  onRetry: () => void;
}

export const ColdStartBanner: React.FC<ColdStartBannerProps> = ({
  isWarmingUp,
  isLiveConnected,
  onUseCached,
  onRetry,
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isWarmingUp && !isLiveConnected) {
      setElapsed(0);
      timer = setInterval(() => {
        setElapsed((prev) => (prev >= 45 ? 45 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWarmingUp, isLiveConnected]);

  if (isLiveConnected || !isWarmingUp) return null;

  const progressPct = Math.min(Math.round((elapsed / 35) * 100), 98);

  return (
    <div className="bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-5 shadow-xs transition-all animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Info & Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Server className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Render Free Instance Warming Up
              </h4>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                {elapsed}s / 35s
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Render spins down free containers when idle. Waking up Python FastAPI engine...
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onUseCached}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Use Instant Cache</span>
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="p-1.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer"
            title="Retry Live Server Connection"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-amber-500/20 h-1.5 rounded-full overflow-hidden mt-3">
        <div
          className="bg-amber-500 h-full rounded-full transition-all duration-1000"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
};
