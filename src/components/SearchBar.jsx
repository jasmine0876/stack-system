import { useState } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol.trim() && !loading) {
      onSearch(symbol.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const quickSymbols = [
    { code: '2330', name: '台積電' },
    { code: '2317', name: '鴻海' },
    { code: '0050', name: '元大台灣50' },
    { code: '2454', name: '聯發科' },
    { code: '2881', name: '富邦金' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex gap-3">
        {/* Search Icon */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="stock-search-input"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
            onKeyDown={handleKeyDown}
            placeholder="輸入台股代號，例如 2330"
            className="w-full pl-12 pr-4 py-4 bg-navy-800/60 border border-navy-600/40 rounded-2xl text-navy-50 text-lg placeholder-navy-500 outline-none transition-all duration-300 focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-navy-800/80 backdrop-blur-sm"
            disabled={loading}
            autoComplete="off"
          />
        </div>
        <button
          id="search-button"
          type="submit"
          disabled={loading || !symbol.trim()}
          className="px-8 py-4 bg-gradient-to-r from-accent to-blue-600 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:from-accent-hover hover:to-blue-700 hover:shadow-lg hover:shadow-accent/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none active:scale-95 cursor-pointer whitespace-nowrap"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              分析中
            </span>
          ) : (
            '開始分析'
          )}
        </button>
      </form>

      {/* Quick Access */}
      <div className="flex flex-wrap items-center gap-2 mt-4 justify-center">
        <span className="text-sm text-navy-500 mr-1">快速查詢：</span>
        {quickSymbols.map((s) => (
          <button
            key={s.code}
            type="button"
            onClick={() => {
              setSymbol(s.code);
              onSearch(s.code);
            }}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-navy-800/50 border border-navy-600/30 rounded-full text-navy-300 hover:text-accent-light hover:border-accent/40 hover:bg-navy-700/50 transition-all duration-200 disabled:opacity-40 cursor-pointer"
          >
            {s.code} {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
