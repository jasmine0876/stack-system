import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const vol = payload[0]?.value;
  return (
    <div className="bg-navy-900/95 backdrop-blur-md border border-navy-600/40 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-sm text-navy-300 mb-1 font-medium">{label}</p>
      <p className="text-sm font-semibold text-navy-100">
        成交量：{vol?.toLocaleString('zh-TW')} 股
      </p>
    </div>
  );
}

export default function VolumeChart({ history }) {
  const chartData = useMemo(() => {
    if (!history?.length) return [];
    return history.map((item, i) => ({
      date: item.date.slice(5),
      volume: item.volume,
      isUp: i > 0 ? item.close >= history[i - 1].close : true,
    }));
  }, [history]);

  if (!chartData.length) return null;

  return (
    <div className="glass-card animate-fade-in-up-delay-3">
      <h3 className="text-lg font-bold text-navy-100 mb-5 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        成交量
      </h3>

      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(148,163,184,0.15)' }}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(148,163,184,0.15)' }}
              tickFormatter={(v) => {
                if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
                if (v >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
                if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
                return v;
              }}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="volume" radius={[2, 2, 0, 0]} maxBarSize={8}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isUp ? 'rgba(239, 68, 68, 0.6)' : 'rgba(34, 197, 94, 0.6)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
