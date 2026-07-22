import yfinance as yf
import pandas as pd
import numpy as np
import os
import tempfile
from datetime import datetime
from typing import Optional
from google import genai
from google.genai import types


# Vercel 的函式程式只能安全寫入暫存目錄。yfinance 會將時區與
# Yahoo cookie 寫入快取，因此在 serverless 環境將快取改到 /tmp。
YFINANCE_CACHE_DIR = os.path.join(tempfile.gettempdir(), "py-yfinance")
os.makedirs(YFINANCE_CACHE_DIR, exist_ok=True)
yf.set_tz_cache_location(YFINANCE_CACHE_DIR)


def compute_rsi(series: pd.Series, period: int = 14) -> Optional[float]:
    """計算 RSI（Relative Strength Index）"""
    if len(series) < period + 1:
        return None

    delta = series.diff()
    gain = delta.where(delta > 0, 0.0)
    loss = (-delta).where(delta < 0, 0.0)

    # 使用指數移動平均 (EMA) 方式計算
    avg_gain = gain.ewm(alpha=1 / period, min_periods=period).mean()
    avg_loss = loss.ewm(alpha=1 / period, min_periods=period).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    last_rsi = rsi.iloc[-1]
    if pd.isna(last_rsi):
        return None
    return round(float(last_rsi), 2)


def generate_analysis(
    latest_price: float,
    ma5: Optional[float],
    ma20: Optional[float],
    ma60: Optional[float],
    rsi14: Optional[float],
    high52w: Optional[float],
    low52w: Optional[float],
) -> list[str]:
    """根據技術指標產生白話分析結論"""
    analysis = []

    # 均線分析
    if ma20 is not None:
        if latest_price > ma20:
            analysis.append("目前股價高於 20 日均線，近期走勢相對強勢。")
        else:
            analysis.append("目前股價低於 20 日均線，近期走勢相對弱勢。")

    if ma5 is not None and ma20 is not None:
        if ma5 > ma20:
            analysis.append("短期均線（MA5）位於中期均線（MA20）之上，短線動能偏多。")
        else:
            analysis.append("短期均線（MA5）位於中期均線（MA20）之下，短線動能偏弱。")

    if ma60 is not None:
        if latest_price > ma60:
            analysis.append("股價站穩 60 日均線之上，中長期趨勢偏多。")
        else:
            analysis.append("股價跌破 60 日均線，中長期趨勢偏弱，建議觀察是否止穩。")

    # RSI 分析
    if rsi14 is not None:
        if rsi14 > 80:
            analysis.append(
                f"RSI 為 {rsi14}，已進入嚴重超買區間，股價短期可能有修正壓力。"
            )
        elif rsi14 > 70:
            analysis.append(
                f"RSI 為 {rsi14}，進入相對高檔區間，留意股價是否出現回檔訊號。"
            )
        elif rsi14 < 20:
            analysis.append(
                f"RSI 為 {rsi14}，已進入嚴重超賣區間，可進一步觀察是否出現反彈契機。"
            )
        elif rsi14 < 30:
            analysis.append(
                f"RSI 為 {rsi14}，進入相對低檔區間，可進一步觀察是否出現止跌訊號。"
            )
        else:
            analysis.append(f"RSI 為 {rsi14}，處於中性區間，尚未出現明顯超買或超賣訊號。")

    # 52 週高低分析
    if high52w is not None and low52w is not None:
        price_range = high52w - low52w
        if price_range > 0:
            position = (latest_price - low52w) / price_range * 100
            if position > 90:
                analysis.append(
                    f"目前股價接近 52 週最高價（{high52w:,.2f}），處於近一年高點附近。"
                )
            elif position < 10:
                analysis.append(
                    f"目前股價接近 52 週最低價（{low52w:,.2f}），處於近一年低點附近。"
                )
            else:
                analysis.append(
                    f"目前股價位於 52 週區間的 {position:.0f}% 位置"
                    f"（最低 {low52w:,.2f}，最高 {high52w:,.2f}）。"
                )

    # 免責聲明
    analysis.append("⚠️ 以上分析僅供學習與資訊參考，不構成任何投資建議。")

    return analysis


def fetch_stock_data(symbol: str, period: str = "1y") -> dict:
    """
    抓取台股資料並計算技術指標。

    Args:
        symbol: 台股代號（如 2330）
        period: 資料期間（3mo, 6mo, 1y）

    Returns:
        包含股票資訊、技術指標、歷史資料的字典
    """
    # 轉換為 Yahoo Finance 格式
    yahoo_symbol = f"{symbol}.TW"

    try:
        ticker = yf.Ticker(yahoo_symbol)

        # 先嘗試抓取歷史資料以驗證股票是否存在
        # 為了計算 MA60，需要額外抓取更多歷史資料
        extended_periods = {"3mo": "6mo", "6mo": "1y", "1y": "2y"}
        fetch_period = extended_periods.get(period, "2y")

        hist = ticker.history(period=fetch_period, timeout=10, raise_errors=True)

        if hist.empty:
            # 嘗試 .TWO（上櫃股票）
            yahoo_symbol = f"{symbol}.TWO"
            ticker = yf.Ticker(yahoo_symbol)
            hist = ticker.history(period=fetch_period, timeout=10, raise_errors=True)

            if hist.empty:
                raise ValueError(f"查無股票代號 {symbol} 的資料，請確認代號是否正確。")

        # ticker.info 會再發出一次較慢的 Yahoo 請求，serverless IP 也容易
        # 在這個端點被限流。股價分析不依賴它，所以不讓名稱查詢阻斷分析。
        stock_name = symbol

        # 計算技術指標（使用全部歷史資料）
        hist["MA5"] = hist["Close"].rolling(window=5).mean()
        hist["MA20"] = hist["Close"].rolling(window=20).mean()
        hist["MA60"] = hist["Close"].rolling(window=60).mean()

        # 計算 RSI
        rsi14 = compute_rsi(hist["Close"], 14)

        # 52 週高低（使用最近 252 個交易日）
        recent_year = hist["Close"].tail(252)
        high52w = round(float(recent_year.max()), 2) if len(recent_year) > 0 else None
        low52w = round(float(recent_year.min()), 2) if len(recent_year) > 0 else None

        # 根據使用者請求的 period 過濾歷史資料（用於前端顯示）
        period_map = {"3mo": 63, "6mo": 126, "1y": 252}
        display_days = period_map.get(period, 252)
        display_hist = hist.tail(display_days)

        # 最新資料
        latest_price = round(float(hist["Close"].iloc[-1]), 2)
        previous_close = round(float(hist["Close"].iloc[-2]), 2) if len(hist) >= 2 else None
        change = round(latest_price - previous_close, 2) if previous_close else None
        change_percent = (
            round((change / previous_close) * 100, 2)
            if previous_close and change is not None
            else None
        )

        # 最新均線值
        ma5_val = (
            round(float(hist["MA5"].iloc[-1]), 2)
            if not pd.isna(hist["MA5"].iloc[-1])
            else None
        )
        ma20_val = (
            round(float(hist["MA20"].iloc[-1]), 2)
            if not pd.isna(hist["MA20"].iloc[-1])
            else None
        )
        ma60_val = (
            round(float(hist["MA60"].iloc[-1]), 2)
            if not pd.isna(hist["MA60"].iloc[-1])
            else None
        )

        # 更新日期
        updated_at = hist.index[-1].strftime("%Y-%m-%d")

        # 產生白話分析
        analysis = generate_analysis(
            latest_price, ma5_val, ma20_val, ma60_val, rsi14, high52w, low52w
        )

        # 組裝歷史資料（供前端繪圖）
        history_records = []
        for idx, row in display_hist.iterrows():
            record = {
                "date": idx.strftime("%Y-%m-%d"),
                "close": round(float(row["Close"]), 2) if not pd.isna(row["Close"]) else None,
                "volume": int(row["Volume"]) if not pd.isna(row["Volume"]) else None,
                "ma5": round(float(row["MA5"]), 2) if not pd.isna(row["MA5"]) else None,
                "ma20": round(float(row["MA20"]), 2) if not pd.isna(row["MA20"]) else None,
                "ma60": round(float(row["MA60"]), 2) if not pd.isna(row["MA60"]) else None,
            }
            history_records.append(record)

        return {
            "symbol": symbol,
            "name": stock_name,
            "latestPrice": latest_price,
            "previousClose": previous_close,
            "change": change,
            "changePercent": change_percent,
            "updatedAt": updated_at,
            "statistics": {
                "ma5": ma5_val,
                "ma20": ma20_val,
                "ma60": ma60_val,
                "rsi14": rsi14,
                "high52w": high52w,
                "low52w": low52w,
            },
            "analysis": analysis,
            "history": history_records,
        }

    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"抓取股票 {symbol} 資料時發生錯誤：{str(e)}")


def fetch_stock_reason(symbol: str) -> str:
    """
    抓取台股新聞並透過 Gemini 產生今日走向原因的白話分析。
    """
    yahoo_symbol = f"{symbol}.TW"
    try:
        ticker = yf.Ticker(yahoo_symbol)
        
        # 測試是否能抓到這檔股票（如果沒有歷史資料可能是 .TWO）
        hist = ticker.history(period="1d", timeout=5)
        if hist.empty:
            yahoo_symbol = f"{symbol}.TWO"
            ticker = yf.Ticker(yahoo_symbol)

        news = ticker.news
        if not news:
            return "目前沒有關於此股票的近期新聞，無法提供今日走向分析。"

        # 整理新聞內容
        news_texts = []
        for article in news[:5]: # 取前 5 則最新新聞
            title = article.get("title", "")
            summary = article.get("summary", "")
            # 有些結構可能放在 content 裡
            if not title and "content" in article:
                title = article["content"].get("title", "")
                summary = article["content"].get("summary", "")
            if title:
                news_texts.append(f"標題: {title}\n摘要: {summary}")

        if not news_texts:
            return "目前沒有關於此股票的近期新聞，無法提供今日走向分析。"

        combined_news = "\n\n".join(news_texts)

        # 呼叫 Gemini API
        api_key = os.environ.get("GEMINI_API_KEY", "").strip()
        client = genai.Client(api_key=api_key)
        prompt = f'''
請根據以下關於股票代號 {symbol} 的最新新聞，以「繁體中文」寫一段簡短、白話的分析，
向一般投資新手解釋「這支股票近期（或今日）為什麼會這樣走向」。
如果新聞中沒有明確的利多或利空，請誠實告知。
請勿包含任何投資建議，只需陳述事實與合理的推論。

以下是最新新聞：
{combined_news}
'''
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        
        return response.text.strip()
    
    except Exception as e:
        if "API key" in str(e) or "client" in str(e).lower() or "credentials" in str(e).lower():
            api_key = os.environ.get("GEMINI_API_KEY", "").strip()
            if not api_key:
                return "系統環境變數中找不到 `GEMINI_API_KEY`，請確認 Vercel 設定並重新發布（Redeploy）。"
            else:
                return f"⚠️ 金鑰設定錯誤或無效。目前讀取到的金鑰開頭為「{api_key[:6]}...」，長度為 {len(api_key)} 字元。錯誤細節：{str(e)}"
        raise ValueError(f"分析股票 {symbol} 走向原因時發生錯誤：{str(e)}")

