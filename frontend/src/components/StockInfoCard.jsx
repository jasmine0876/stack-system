export default function StockInfoCard({ data }) {
  if (!data) return null;

  const { symbol, name, latestPrice, previousClose, change, changePercent, updatedAt } = data;
  const isUp = change > 0;
  const isDown = change < 0;
  const isFlat = change === 0;

  const changeColor = isUp
    ? 'text-stock-up'
    : isDown
      ? 'text-stock-down'
      : 'text-stock-neutral';

  const changeBg = isUp
    ? 'bg-stock-up-bg'
    : isDown
      ? 'bg-stock-down-bg'
      : 'bg-navy-700/50';

  const arrow = isUp ? '▲' : isDown ? '▼' : '—';
  const sign = isUp ? '+' : '';

  return (
    <div className="glass-card animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Name & Symbol */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-blue-600/20 border border-accent/20 flex items-center justify-center">
            <span className="text-xl font-bold text-accent">{symbol.slice(0, 2)}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy-50">{name}</h2>
            <p className="text-navy-400 text-sm mt-0.5">{symbol}.TW</p>
          </div>
        </div>

        {/* Right: Price Info */}
        <div className="flex items-end gap-6">
          <div className="text-right">
            <p className="text-sm text-navy-400 mb-1">最新收盤價</p>
            <p className={`text-4xl font-extrabold tracking-tight ${changeColor}`}>
              {latestPrice?.toLocaleString('zh-TW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className={`text-right px-4 py-2 rounded-xl ${changeBg}`}>
            <div className={`text-lg font-bold ${changeColor} flex items-center gap-1 justify-end`}>
              <span className="text-sm">{arrow}</span>
              <span>{sign}{change?.toFixed(2)}</span>
            </div>
            <div className={`text-sm font-semibold ${changeColor}`}>
              {sign}{changePercent?.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Row */}
      <div className="flex flex-wrap gap-6 mt-5 pt-4 border-t border-navy-700/50">
        <InfoItem label="前一日收盤" value={previousClose?.toLocaleString('zh-TW', { minimumFractionDigits: 2 })} />
        <InfoItem label="漲跌金額" value={`${sign}${change?.toFixed(2)}`} valueColor={changeColor} />
        <InfoItem label="漲跌幅" value={`${sign}${changePercent?.toFixed(2)}%`} valueColor={changeColor} />
        <InfoItem label="資料更新日期" value={updatedAt} />
      </div>
    </div>
  );
}

function InfoItem({ label, value, valueColor = 'text-navy-100' }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-navy-500 mb-0.5">{label}</span>
      <span className={`text-sm font-semibold ${valueColor}`}>{value ?? '—'}</span>
    </div>
  );
}
