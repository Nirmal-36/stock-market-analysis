import requests, os
from db import stocks_collection, news_collection
import yfinance as yf
import pandas as pd
from typing import cast
from dotenv import load_dotenv
load_dotenv()

ALPHA_KEY = os.getenv("ALPHA_VANTAGE_KEY")
SERPAPI_KEY = os.getenv("SERPAPI_KEY")


def fetch_ohlc(symbol: str):
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="1d")

        if hist.empty:
            return None

        latest = hist.iloc[-1]
        date = hist.index[-1]  # Avoids Pylance issues

        return {
            "symbol": symbol,
            "open": float(latest["Open"]),
            "high": float(latest["High"]),
            "low": float(latest["Low"]),
            "close": float(latest["Close"]),
            "volume": int(latest.get("Volume", 0)),
            "date": date.strftime("%Y-%m-%d")
        }
    except Exception as e:
        return None


def fetch_news(stock_name):
    url = "https://serpapi.com/search.json"
    params = {
        "q": stock_name,
        "tbm": "nws",  # News tab
        "api_key": SERPAPI_KEY
    }
    response = requests.get(url, params=params)
    results = response.json().get("news_results", [])[:5]

    news = []
    for article in results:
        news.append({
            "title": article.get("title", ""),
            "published_date": article.get("date", ""),
            "summary": article.get("snippet", ""),
            "link": article.get("link", "")
        })

    return news
