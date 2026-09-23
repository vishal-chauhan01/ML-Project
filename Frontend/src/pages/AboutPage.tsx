import React from 'react';
import {
  Brain,
  Zap,
  BarChart3,
  Cpu,
  ShieldCheck,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';

interface AboutPageProps {
  onNavigateToOverview?: () => void;
  onNavigateToModels?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateToOverview,
  onNavigateToModels,
}) => {
  const mlModels = [
    {
      name: 'Linear Regression',
      type: 'Parametric Baseline',
      accuracy: '84.2%',
      r2: '0.842',
      directionAcc: '68.5%',
      description: 'Establishes fundamental price trajectory trends using ordinary least squares optimization on rolling temporal features.',
      badge: 'Fast & Interpretable',
      color: 'border-blue-200 bg-blue-50/50 text-blue-700'
    },
    {
      name: 'Polynomial Regression',
      type: 'Degree 2 Non-Linear',
      accuracy: '88.7%',
      r2: '0.887',
      directionAcc: '74.1%',
      description: 'Captures non-linear price curvature and accelerations in short-to-mid term market dynamics.',
      badge: 'Curvature Detection',
      color: 'border-purple-200 bg-purple-50/50 text-purple-700'
    },
    {
      name: 'Support Vector Regressor (RBF)',
      type: 'Kernel Method',
      accuracy: '91.4%',
      r2: '0.914',
      directionAcc: '81.3%',
      description: 'Radial Basis Function kernel mapping high-dimensional feature spaces for robust resistance level predictions.',
      badge: 'High Precision',
      color: 'border-amber-200 bg-amber-50/50 text-amber-700'
    },
    {
      name: 'Random Forest Regressor',
      type: 'Ensemble Learning',
      accuracy: '94.8%',
      r2: '0.948',
      directionAcc: '87.6%',
      description: 'Aggregates 100 decision trees to mitigate overfitting and maximize predictive performance across volatile regimes.',
      badge: 'Top Performer',
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-700'
    },
  ];

  const platformFeatures = [
    {
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      title: 'Real-Time Market Data',
      description: 'Integrated live financial market data engine delivering updated stock quotes, OHLC metrics, and volume analysis.',
    },
    {
      icon: <Brain className="w-5 h-5 text-blue-500" />,
      title: 'Multi-Model Inference Engine',
      description: 'Compare predictions from 4 distinct ML algorithms simultaneously to evaluate model variance and confidence.',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-purple-500" />,
      title: 'AI Market Intelligence',
      description: 'Macroeconomic executive summaries, sector sentiment heatmaps, and automated technical indicator deep dives.',
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-500" />,
      title: 'Localized Portfolio Watchlist',
      description: 'Persistent watchlist tracking with live metric synchronization and INR (₹) price formatting.',
    },
  ];

  const techStack = [
    { category: 'Frontend Architecture', tech: 'React 18, Vite, TypeScript, Tailwind CSS' },
    { category: 'Machine Learning Core', tech: 'Python 3.11, PyTorch, Scikit-Learn, NumPy' },
    { category: 'Backend API Service', tech: 'FastAPI, Uvicorn, RESTful Endpoints, CORS Middleware' },
    { category: 'Financial Data Providers', tech: 'yfinance Engine, Alpha Vantage API, Custom Cache Layer' },
  ];

  const keyStats = [
    { value: '94.8%', label: 'Top Model R² Score' },
    { value: '4', label: 'ML Algorithms' },
    { value: 'Real-Time', label: 'Market Data Sync' },
    { value: '100%', label: 'Responsive UI' },
  ];

  return (
    <div className="space-y-10 py-2">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-12 text-white shadow-xl">
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen Predictive Stock Analytics
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Empowering Financial Decisions with <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">Machine Learning</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            <strong>ShareWise AI</strong> bridges modern machine learning algorithms with live equity markets. By combining multi-model regression frameworks, real-time data streaming, and automated market sentiment heatmaps, ShareWise transforms complex data into actionable financial insights.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => {
                if (onNavigateToOverview) onNavigateToOverview();
                else window.location.hash = 'overview';
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 cursor-pointer"
            >
              Explore Live Stock Sandbox
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (onNavigateToModels) onNavigateToModels();
                else window.location.hash = 'models';
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-sm transition-all cursor-pointer backdrop-blur-xs"
            >
              <Cpu className="w-4 h-4 text-blue-300" />
              Compare ML Benchmarks
            </button>
            <a
              href="https://github.com/vishal-chauhan01/ML-Project"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700/80 font-semibold text-sm transition-all cursor-pointer backdrop-blur-xs"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View Source on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Key Metric Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {keyStats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-2xs text-center space-y-1 hover:border-blue-200 dark:hover:border-blue-800 transition-all"
          >
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stat.value}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mission & Platform Pillars */}
      <div className="space-y-4">
        <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Core Platform Capabilities
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Engineered from the ground up for high-accuracy financial predictions and market visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platformFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs hover:shadow-md transition-all flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                {feat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Machine Learning Models Breakdown */}
      <div className="space-y-4">
        <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Machine Learning Model Suite
              </h2>
            </div>
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-100 dark:border-purple-800">
              Ensemble Architecture
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Our backend trains and compares four distinct regression algorithms to maximize forecast reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mlModels.map((model, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${model.color}`}>
                    {model.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{model.type}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{model.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{model.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 text-center">
                <div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">R² Score</span>
                  <strong className="text-xs text-slate-900 dark:text-white font-extrabold">{model.r2}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">Dir. Accuracy</span>
                  <strong className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">{model.directionAcc}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">Confidence</span>
                  <strong className="text-xs text-blue-600 dark:text-blue-400 font-extrabold">{model.accuracy}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack & Architecture Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Technical Architecture & Stack</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techStack.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {item.category}
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                {item.tech}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-900 dark:bg-slate-950 text-slate-300 p-5 rounded-2xl border border-transparent dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Deployment Ready: Render (API Backend) & Vercel (React Frontend)</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>CORS Enabled & Auto Failover Data Pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
};
