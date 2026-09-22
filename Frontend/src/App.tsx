import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SubHeader } from './components/SubHeader';
import { StockOverview } from './components/StockOverview';
import { PricePrediction } from './components/PricePrediction';
import { MarketInsightCard } from './components/MarketInsightCard';
import { KeyMetricsCard } from './components/KeyMetricsCard';
import { Footer } from './components/Footer';
import { WatchlistPage } from './pages/WatchlistPage';
import { MarketInsightsPage } from './pages/MarketInsightsPage';
import { ModelsPage } from './pages/ModelsPage';
import { apiService } from './services/api';
import type { Stock, Timeframe } from './types/stock';

export function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('7D');
  const [activeModelType, setActiveModelType] = useState<string>('linear');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch stocks from FastAPI when model type or component mounts
  useEffect(() => {
    setLoading(true);
    apiService.getStocks(activeModelType).then((data) => {
      if (data && data.length > 0) {
        setStocks(data);
        setSelectedStock(data[0]);
      }
      setLoading(false);
    });
  }, [activeModelType]);

  // Hash route listener (#overview, #watchlist, #market-insights, #models)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTab(hash);
      } else {
        setActiveTab('overview');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  const handleToggleWatchlist = async (stockId: string) => {
    const isSaved = await apiService.toggleWatchlist(stockId);
    setStocks((prev) =>
      prev.map((s) => (s.id === stockId ? { ...s, isSavedToWatchlist: isSaved } : s))
    );
    if (selectedStock && selectedStock.id === stockId) {
      setSelectedStock((prev) => (prev ? { ...prev, isSavedToWatchlist: isSaved } : null));
    }
  };

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
  };

  const handleSelectStockAndNavigate = (stock: Stock) => {
    setSelectedStock(stock);
    handleTabChange('overview');
  };

  // Filter stocks if searching
  const filteredStocks = searchQuery
    ? stocks.filter(
        (s) =>
          s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stocks;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col antialiased">
      {/* Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-medium">
            Loading Sharewise FastAPI ML Engine Data...
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div>
                {selectedStock ? (
                  <>
                    <SubHeader
                      stocks={filteredStocks}
                      selectedStock={selectedStock}
                      onSelectStock={handleSelectStock}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      onToggleWatchlist={handleToggleWatchlist}
                    />
                    <StockOverview stock={selectedStock} />
                    <PricePrediction
                      stock={selectedStock}
                      activeTimeframe={activeTimeframe}
                      onSelectTimeframe={setActiveTimeframe}
                      activeModelType={activeModelType}
                      onSelectModelType={setActiveModelType}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MarketInsightCard stock={selectedStock} />
                      <KeyMetricsCard stock={selectedStock} />
                    </div>
                  </>
                ) : (
                  <div className="py-20 text-center text-slate-500 font-semibold bg-white rounded-2xl border border-slate-200 shadow-xs">
                    No active stock data found. Please start Python FastAPI backend engine.
                  </div>
                )}
                <Footer />
              </div>
            )}

            {activeTab === 'watchlist' && (
              <div>
                <WatchlistPage
                  stocks={stocks}
                  onToggleWatchlist={handleToggleWatchlist}
                  onSelectStockAndNavigate={handleSelectStockAndNavigate}
                />
                <Footer />
              </div>
            )}

            {activeTab === 'market-insights' && (
              <div>
                <MarketInsightsPage />
                <Footer />
              </div>
            )}

            {activeTab === 'models' && (
              <div>
                <ModelsPage stocks={stocks} />
                <Footer />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
