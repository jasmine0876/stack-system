export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in-up">
      {/* Error icon */}
      <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-navy-100 mb-2">查詢失敗</h3>
      <p className="text-navy-400 text-center max-w-md mb-6 leading-relaxed">
        {message || '無法取得資料，請稍後再試。'}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-accent/10 border border-accent/30 text-accent-light font-medium rounded-xl hover:bg-accent/20 hover:border-accent/50 transition-all duration-200 cursor-pointer"
        >
          重新搜尋
        </button>
      )}

      {/* Helpful tips */}
      <div className="mt-8 text-left max-w-sm">
        <p className="text-xs text-navy-500 mb-2">💡 常見問題：</p>
        <ul className="text-xs text-navy-500 space-y-1 list-disc list-inside">
          <li>請確認輸入的是台股代號，例如：2330、0050</li>
          <li>確認後端伺服器已啟動（port 8000）</li>
          <li>部分冷門股票可能資料不齊全</li>
        </ul>
      </div>
    </div>
  );
}
