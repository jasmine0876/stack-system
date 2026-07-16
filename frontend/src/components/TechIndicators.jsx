export default function TechIndicators({ statistics, latestPrice }) {
  if (!statistics) return null;

  const { ma5, ma20, ma60, rsi14, high52w, low52w } = statistics;

  // RSI gauge position (0-100 mapped to percentage)
  const rsiPosition = rsi14 != null ? Math.min(Math.max(rsi14, 0), 100) : 50;
  const rsiColor =
    rsi14 > 70 ? 'text-stock-up' : rsi14 < 30 ? 'text-stock-down' : 'text-accent-light';
  const rsiLabel =
    rsi14 > 70 ? '偏高' : rsi14 < 30 ? '偏低' : '中性';

  // 52-week position
  const weekRange = high52w && low52w ? high52w - low52w : 0;
  const weekPosition =
    weekRange > 0 && latestPrice ? ((latestPrice - low52w) / weekRange) * 100 : 50;

  const maItems = [
    { label: 'MA5（5 日均線）', value: ma5, desc: '短期趨勢指標' },
    { label: 'MA20（20 日均線）', value: ma20, desc: '中期趨勢指標' },
    { label: 'MA60（60 日均線）', value: ma60, desc: '長期趨勢指標' },
  ];

  return (
    <div className="glass-card animate-fade-in-up-delay-4">
      <h3 className="text-lg font-bold text-navy-100 mb-5 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        技術指標
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* MA Cards */}
        {maItems.map(({ label, value, desc }) => {
          const diff = latestPrice && value ? latestPrice - value : null;
          const isAbove = diff > 0;
          return (
            <div
              key={label}
              className="bg-navy-800/40 rounded-xl p-4 border border-navy-700/30"
            >
              <p className="text-xs text-navy-500 mb-1">{desc}</p>
              <p className="text-sm font-medium text-navy-300 mb-2">{label}</p>
              <p className="text-2xl font-bold text-navy-50">
                {value?.toLocaleString('zh-TW', { minimumFractionDigits: 2 }) ?? '—'}
              </p>
              {diff != null && (
                <p className={`text-xs mt-1 ${isAbove ? 'text-stock-up' : 'text-stock-down'}`}>
                  股價{isAbove ? '高於' : '低於'}此均線 {Math.abs(diff).toFixed(2)}
                </p>
              )}
            </div>
          );
        })}

        {/* RSI Card */}
        <div className="bg-navy-800/40 rounded-xl p-4 border border-navy-700/30">
          <p className="text-xs text-navy-500 mb-1">相對強弱指標</p>
          <p className="text-sm font-medium text-navy-300 mb-2">RSI（14 日）</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl font-bold ${rsiColor}`}>
              {rsi14?.toFixed(2) ?? '—'}
            </p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              rsi14 > 70
                ? 'bg-stock-up-bg text-stock-up'
                : rsi14 < 30
                  ? 'bg-stock-down-bg text-stock-down'
                  : 'bg-accent/10 text-accent-light'
            }`}>
              {rsiLabel}
            </span>
          </div>
          {/* RSI Bar */}
          <div className="mt-3 relative">
            <div className="h-2 rounded-full bg-gradient-to-r from-green-500 via-blue-400 to-red-500 opacity-40" />
            <div
              className="absolute top-0 w-3 h-3 -mt-0.5 rounded-full bg-white shadow-md border-2 border-navy-900 transition-all duration-500"
              style={{ left: `calc(${rsiPosition}% - 6px)` }}
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-stock-down">超賣 30</span>
              <span className="text-[10px] text-navy-500">50</span>
              <span className="text-[10px] text-stock-up">超買 70</span>
            </div>
          </div>
        </div>

        {/* 52 Week Range */}
        <div className="bg-navy-800/40 rounded-xl p-4 border border-navy-700/30 md:col-span-2 lg:col-span-2">
          <p className="text-xs text-navy-500 mb-1">過去一年價格區間</p>
          <p className="text-sm font-medium text-navy-300 mb-3">52 週最高 / 最低</p>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-navy-500">最低</p>
              <p className="text-lg font-bold text-stock-down">
                {low52w?.toLocaleString('zh-TW', { minimumFractionDigits: 2 }) ?? '—'}
              </p>
            </div>
            <div className="flex-1">
              <div className="relative h-3 rounded-full bg-navy-700/60">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-stock-down to-accent"
                  style={{ width: `${weekPosition}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg border-2 border-accent transition-all duration-500"
                  style={{ left: `calc(${weekPosition}% - 8px)` }}
                />
              </div>
              <p className="text-center text-xs text-navy-400 mt-1.5">
                目前位置：{weekPosition.toFixed(0)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-navy-500">最高</p>
              <p className="text-lg font-bold text-stock-up">
                {high52w?.toLocaleString('zh-TW', { minimumFractionDigits: 2 }) ?? '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
