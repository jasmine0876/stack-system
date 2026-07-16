import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const PERIOD_OPTIONS = [
  { key: '3mo', label: '3M' },
  { key: '6mo', label: '6M' },
  { key: '1y', label: '1Y' },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-navy-900/95 backdrop-blur-md border border-navy-600/40 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-sm text-navy-300 mb-2 font-medium">{label}</p>
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-navy-400">{item.name}：</span>
          <span className="font-semibold text-navy-100">
            {item.value?.toLocaleString('zh-TW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PriceChart({ history, currentPeriod, onPeriodChange }) {
  const chartData = useMemo(() => {
    if (!history?.length) return [];
    return history.map((item) => ({
      ...item,
      date: item.date.slice(5), // MM-DD format
      fullDate: item.date,
    }));
  }, [history]);

  if (!chartData.length) return null;

  // Calculate Y domain with padding
  const prices = chartData
    .flatMap((d) => [d.close, d.ma5, d.ma20, d.ma60])
    .filter((v) => v != null);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.05;

  return (
    <div className="glass-card animate-fade-in-up-delay-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h3 className="text-lg font-bold text-navy-100 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          股價走勢圖
        </h3>
        <div className="flex gap-1 bg-navy-800/60 p-1 rounded-xl">
          {PERIOD_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onPeriodChange(key)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                currentPeriod === key
                  ? 'bg-accent text-white shadow-md shadow-accent/30'
                  : 'text-navy-400 hover:text-navy-200 hover:bg-navy-700/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(148,163,184,0.15)' }}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              domain={[minPrice - padding, maxPrice + padding]}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(148,163,184,0.15)' }}
              tickFormatter={(v) => v.toFixed(0)}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ fontSize: '13px', color: '#94a3b8' }}
            />
            <Line
              type="monotone"
              dataKey="close"
              name="收盤價"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="ma5"
              name="MA5"
              stroke="#06b6d4"
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="none"
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="ma20"
              name="MA20"
              stroke="#f59e0b"
              strokeWidth={1.5}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="ma60"
              name="MA60"
              stroke="#a855f7"
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="4 4"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
