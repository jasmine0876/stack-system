import { useState, useCallback } from 'react';

const API_BASE = '/api';

export function useStockData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStock = useCallback(async (symbol, period = '1y') => {
    if (!symbol || !symbol.trim()) {
      setError('請輸入股票代號');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`${API_BASE}/stock/${symbol.trim()}?period=${period}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.detail || `查詢失敗（HTTP ${response.status}）`;
        throw new Error(message);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('無法連線至伺服器，請確認後端服務是否已啟動。');
      } else {
        setError(err.message || '發生未知錯誤，請稍後再試。');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, fetchStock, clearData };
}
