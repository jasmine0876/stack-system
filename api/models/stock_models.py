from pydantic import BaseModel
from typing import List, Optional


class HistoryRecord(BaseModel):
    date: str
    close: Optional[float] = None
    volume: Optional[int] = None
    ma5: Optional[float] = None
    ma20: Optional[float] = None
    ma60: Optional[float] = None


class StockStatistics(BaseModel):
    ma5: Optional[float] = None
    ma20: Optional[float] = None
    ma60: Optional[float] = None
    rsi14: Optional[float] = None
    high52w: Optional[float] = None
    low52w: Optional[float] = None


class StockResponse(BaseModel):
    symbol: str
    name: str
    latestPrice: Optional[float] = None
    previousClose: Optional[float] = None
    change: Optional[float] = None
    changePercent: Optional[float] = None
    updatedAt: Optional[str] = None
    statistics: StockStatistics
    analysis: List[str]
    history: List[HistoryRecord]
