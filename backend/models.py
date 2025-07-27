from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

class OHLCData(BaseModel):
    symbol: str
    open: float
    high: float
    low: float
    close: float
    date: str
    volume: int = 0  # Optional with default

class StockData(BaseModel):
    ohlc_data: dict  # Use dict to be flexible with field names
    timestamp: str

class NewsArticle(BaseModel):
    title: str
    snippet: str
    source: str
    link: str
    date: str

class StockResponse(BaseModel):
    symbol: str
    data: StockData
    news: List[NewsArticle]
