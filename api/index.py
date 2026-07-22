from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
try:
    # Vercel 環境 (CWD = api/)
    from _services.stock_service import fetch_stock_data, fetch_stock_reason
    from _models.stock_models import StockResponse
except ModuleNotFoundError:
    # 本地環境 (CWD = 根目錄)
    from api._services.stock_service import fetch_stock_data, fetch_stock_reason
    from api._models.stock_models import StockResponse

app = FastAPI(
    title="台股個股分析 API",
    description="提供台股即時資料、技術指標與白話分析",
    version="1.0.0",
)

# CORS 設定：允許前端開發伺服器連線
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    """Used to verify that the Vercel Python function started successfully."""
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "台股個股分析 API 運行中", "docs": "/docs"}


@app.get("/api/stock/{symbol}", response_model=StockResponse)
def get_stock(
    symbol: str,
    period: str = Query(
        default="1y",
        description="資料期間：3mo（3個月）、6mo（6個月）、1y（1年）",
        pattern="^(3mo|6mo|1y)$",
    ),
):
    """
    查詢台股個股資料。

    - **symbol**: 台股股票代號，例如 2330、2317、0050
    - **period**: 歷史資料期間，可選 3mo / 6mo / 1y
    """
    # 驗證股票代號格式
    symbol = symbol.strip()
    if not symbol:
        raise HTTPException(status_code=400, detail="請輸入股票代號。")

    try:
        data = fetch_stock_data(symbol, period)
        return data
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"伺服器發生錯誤，請稍後再試。錯誤訊息：{str(e)}",
        )


@app.get("/api/stock/{symbol}/reason")
def get_stock_reason(symbol: str):
    """
    獲取股票今日走向原因（透過 AI 分析最新新聞）。
    """
    symbol = symbol.strip()
    if not symbol:
        raise HTTPException(status_code=400, detail="請輸入股票代號。")

    try:
        reason = fetch_stock_reason(symbol)
        return {"symbol": symbol, "reason": reason}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"伺服器發生錯誤，無法分析原因：{str(e)}",
        )


@app.get("/api/models")
def list_available_models():
    """用來除錯：列出這把金鑰能使用的所有模型"""
    from google import genai
    import os
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        return {"error": "找不到金鑰"}
    try:
        client = genai.Client(api_key=api_key)
        models = []
        for m in client.models.list():
            models.append(m.name)
        return {"models": models}
    except Exception as e:
        return {"error": str(e)}
