import { useState, useCallback } from 'react';
import { useStockData } from './hooks/useStockData';
import SearchBar from './components/SearchBar';
import StockInfoCard from './components/StockInfoCard';
import PriceChart from './components/PriceChart';
import VolumeChart from './components/VolumeChart';
import TechIndicators from './components/TechIndicators';
import AnalysisSummary from './components/AnalysisSummary';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

export default function App() {
  const { data, loading, error, fetchStock } = useStockData();
  const [currentPeriod, setCurrentPeriod] = useState('1y');
  const [currentSymbol, setCurrentSymbol] = useState('');

  const handleSearch = useCallback(
    (symbol) => {
      setCurrentSymbol(symbol);
      setCurrentPeriod('1y');
      fetchStock(symbol, '1y');
    },
    [fetchStock]
  );

  const handlePeriodChange = useCallback(
    (period) => {
      if (currentSymbol) {
        setCurrentPeriod(period);
        fetchStock(currentSymbol, period);
      }
    },
    [currentSymbol, fetchStock]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-navy-950/80 border-b border-navy-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy-50 tracking-tight">
                  台股分析儀表板
                </h1>
                <p className="text-xs text-navy-500 hidden sm:block">
                  Taiwan Stock Analyzer
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 w-full sm:w-auto">
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>
          </div>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && !loading && (
          <ErrorMessage
            message={error}
            onRetry={() => currentSymbol && handleSearch(currentSymbol)}
          />
        )}

        {/* Data Display */}
        {data && !loading && (
          <div className="space-y-6">
            {/* Stock Info Card */}
            <StockInfoCard data={data} />

            {/* Price Chart */}
            <PriceChart
              history={data.history}
              currentPeriod={currentPeriod}
              onPeriodChange={handlePeriodChange}
            />

            {/* Volume Chart */}
            <VolumeChart history={data.history} />

            {/* Tech Indicators */}
            <TechIndicators
              statistics={data.statistics}
              latestPrice={data.latestPrice}
            />

            {/* Analysis Summary */}
            <AnalysisSummary analysis={data.analysis} />
          </div>
        )}

        {/* Empty State */}
        {!data && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-navy-800/80 to-navy-900/80 border border-navy-700/30 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-navy-300 mb-2">
              開始探索台股
            </h2>
            <p className="text-navy-500 text-center max-w-md leading-relaxed">
              輸入台股代號（例如 2330 台積電），即可查看完整的股價走勢、技術指標與白話分析。
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              {[
                { icon: '📈', label: '股價走勢圖' },
                { icon: '📊', label: '成交量分析' },
                { icon: '🎯', label: '技術指標' },
                { icon: '💡', label: '白話結論' },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 bg-navy-800/30 border border-navy-700/20 rounded-xl text-sm text-navy-400"
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-navy-800/50 bg-navy-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-navy-600">
            ⚠️ 本網站資料僅供學習與資訊參考，不構成任何投資建議。資料來源：Yahoo Finance。
          </p>
        </div>
      </footer>
    </div>
  );
}
