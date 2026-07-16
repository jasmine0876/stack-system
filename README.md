# 📈 台股分析儀表板 Taiwan Stock Analyzer

一個前後端分離的台股個股分析網站，讓初學者輸入股票代號即可快速查看股價走勢、技術指標與白話分析結論。

## ✨ 功能特色

- **股票搜尋** — 輸入台股代號（如 2330、2317、0050），即時查詢
- **基本資訊卡片** — 顯示股票名稱、最新收盤價、漲跌幅
- **股價走勢圖** — 收盤價折線圖，支援 3 個月 / 6 個月 / 1 年切換
- **均線疊加** — MA5、MA20、MA60 同時顯示在走勢圖上
- **成交量圖表** — 每日成交量長條圖，紅漲綠跌
- **技術指標** — RSI（14日）、52 週最高最低價
- **白話分析** — 將技術指標翻譯成初學者看得懂的結論
- **免責聲明** — 所有分析結論均附帶投資風險提醒

## 🛠 技術架構

| 層級 | 技術 |
|------|------|
| 前端 | React 19 + Vite |
| 樣式 | Tailwind CSS v4 |
| 圖表 | Recharts |
| 後端 | Python FastAPI |
| 資料抓取 | yfinance |
| 資料處理 | pandas |

## 📁 專案結構

```
├── frontend/                  # React 前端
│   ├── src/
│   │   ├── App.jsx            # 主頁面
│   │   ├── components/        # UI 元件
│   │   │   ├── SearchBar.jsx
│   │   │   ├── StockInfoCard.jsx
│   │   │   ├── PriceChart.jsx
│   │   │   ├── VolumeChart.jsx
│   │   │   ├── TechIndicators.jsx
│   │   │   ├── AnalysisSummary.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorMessage.jsx
│   │   └── hooks/
│   │       └── useStockData.js
│   └── vite.config.js
├── backend/
│   ├── main.py                # FastAPI 應用
│   ├── services/
│   │   └── stock_service.py   # 資料抓取 + 計算
│   ├── models/
│   │   └── stock_models.py    # 資料模型
│   └── requirements.txt
├── .env.example
└── README.md
```

## 🚀 快速開始

### 1. 安裝後端

```bash
# 進入後端目錄
cd backend

# 安裝 Python 套件
pip install -r requirements.txt

# 啟動後端伺服器（預設 port 8000）
python -m uvicorn main:app --reload --port 8000
```

後端啟動後可至 http://localhost:8000/docs 查看 Swagger API 文件。

### 2. 安裝前端

```bash
# 進入前端目錄
cd frontend

# 安裝 Node.js 套件
npm install

# 啟動開發伺服器（預設 port 5173）
npm run dev
```

前端開啟後至 http://localhost:5173 即可使用。

> **注意**：前端已設定 Vite proxy，開發時 `/api` 路徑會自動轉發至後端 `localhost:8000`。

## 📡 API 說明

### `GET /api/stock/{symbol}?period=1y`

| 參數 | 說明 | 範例 |
|------|------|------|
| `symbol` | 台股代號 | `2330`、`2317`、`0050` |
| `period` | 資料期間（可選） | `3mo`、`6mo`、`1y` |

**回傳範例：**

```json
{
  "symbol": "2330",
  "name": "台積電",
  "latestPrice": 1000.0,
  "previousClose": 990.0,
  "change": 10.0,
  "changePercent": 1.01,
  "updatedAt": "2026-07-16",
  "statistics": {
    "ma5": 980.0,
    "ma20": 960.0,
    "ma60": 920.0,
    "rsi14": 62.0,
    "high52w": 1100.0,
    "low52w": 700.0
  },
  "analysis": [
    "目前股價高於 20 日均線，近期走勢相對強勢。",
    "RSI 為 62，處於中性區間。"
  ],
  "history": [
    {
      "date": "2026-07-01",
      "close": 980.0,
      "volume": 30000000,
      "ma5": 970.0,
      "ma20": 950.0,
      "ma60": null
    }
  ]
}
```

## ⚠️ 免責聲明

本網站資料僅供學習與資訊參考，不構成任何投資建議。資料來源為 Yahoo Finance，可能存在延遲或不準確之處。
