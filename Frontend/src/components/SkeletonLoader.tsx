import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* SubHeader Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 h-16" />

      {/* StockOverview Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 h-36 flex justify-between items-center">
        <div className="space-y-3 w-1/3">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        </div>
        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded w-1/4 hidden md:block" />
      </div>

      {/* PricePrediction Chart Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 h-[300px] flex flex-col justify-between">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-40 bg-slate-100 dark:bg-slate-800/50 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 h-[300px] space-y-4">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
};
