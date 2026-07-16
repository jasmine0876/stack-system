export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
      {/* Animated rings */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-navy-700/30 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full animate-spin" />
        <div className="absolute inset-2 border-4 border-transparent border-t-accent-light rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        <div className="absolute inset-4 border-4 border-transparent border-t-blue-300 rounded-full animate-spin" style={{ animationDuration: '2s' }} />
      </div>
      <p className="mt-6 text-navy-300 text-lg font-medium">正在抓取股票資料...</p>
      <p className="mt-1 text-navy-500 text-sm">請稍候，正從 Yahoo Finance 取得最新資訊</p>
    </div>
  );
}
