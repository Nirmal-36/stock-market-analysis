from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fetcher import fetch_ohlc, fetch_news
from models import StockResponse, OHLCData, NewsArticle
from db import stocks_collection, news_collection
from db_utils import update_stock_in_database
from stock_utils import normalize_symbol, find_stock_matches, clean_duplicate_symbols_in_db
from datetime import datetime
from indian_stocks import get_stocks
from typing import List
import logging
import pandas as pd
import yfinance as yf

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Stock Market Analysis API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Stock Market Analysis API", 
        "version": "1.0.0",
        "features": [
            "Real-time stock data fetching",
            "Automatic database updates on user requests",
            "Daily batch updates via scheduler",
            "Smart caching with database fallback"
        ]
    }

@app.get("/api/stocks/list")
def get_stock_list():
    """Get list of all available stocks"""
    return {"stocks": get_stocks("all")}

@app.get("/api/stocks/categories")
def get_stock_categories():
    """Get stocks by category"""
    return {
        "all": get_stocks("all"),
        "banking": get_stocks("banking"),
        "it": get_stocks("it")
    }

@app.get("/api/stock/{symbol}")
def get_stock(symbol: str):
    """
    Get real-time stock data with smart symbol matching
    
    Features:
    - Case-insensitive symbol matching
    - Fuzzy matching for typos
    - Automatic symbol normalization
    - Always fetches real-time data and updates database
    """
    today = datetime.now().strftime("%Y-%m-%d")
    
    logger.info(f"🔍 User requested data for: '{symbol}'")
    
    # Use fuzzy matching to find the stock
    match_result = find_stock_matches(symbol)
    
    if match_result["exact_match"]:
        # Exact match found
        final_symbol = match_result["exact_match"]
        logger.info(f"✅ Exact match found: {final_symbol}")
    elif match_result["suggestions"]:
        # No exact match, but suggestions available
        suggestions_str = ", ".join(match_result["suggestions"][:3])
        company_matches_str = ", ".join(match_result["company_matches"][:3]) if match_result["company_matches"] else ""
        
        error_msg = f"Stock '{symbol}' not found. Did you mean: {suggestions_str}?"
        if company_matches_str:
            error_msg += f" (Company matches: {company_matches_str})"
        
        logger.warning(f"❌ No exact match for '{symbol}'. Suggestions: {suggestions_str}")
        raise HTTPException(status_code=404, detail=error_msg)
    else:
        # No matches at all
        available_examples = ", ".join([s.replace('.NS', '') for s in get_stocks("all")[:5]])
        error_msg = f"Stock '{symbol}' not found. Available examples: {available_examples}..."
        logger.warning(f"❌ No matches found for '{symbol}'")
        raise HTTPException(status_code=404, detail=error_msg)
    
    # ALWAYS fetch real-time data (no database lookup first)
    logger.info(f"🚀 Fetching real-time data for {final_symbol}")
    
    try:
        # Fetch real-time OHLC
        real_time_ohlc = fetch_ohlc(final_symbol)
        if not real_time_ohlc:
            logger.error(f"❌ No OHLC data returned for {final_symbol}")
            raise HTTPException(
                status_code=404, 
                detail=f"No price data available for '{symbol}'. The stock might be delisted or market is closed."
            )
        
        # Fetch real-time news
        company_name = final_symbol.replace('.NS', '')
        real_time_news = fetch_news(company_name)
        
        # Update database with fresh real-time data (clean old data)
        update_stock_in_database(final_symbol, real_time_ohlc, real_time_news, clean_old_data=True)
        
        logger.info(f"✅ Updated {final_symbol} with real-time data")
        
        # Clean the OHLC data to remove MongoDB ObjectId and other unwanted fields
        clean_ohlc = {
            "symbol": real_time_ohlc.get("symbol"),
            "open": real_time_ohlc.get("open"),
            "high": real_time_ohlc.get("high"),
            "low": real_time_ohlc.get("low"),
            "close": real_time_ohlc.get("close"),
            "volume": real_time_ohlc.get("volume", 0),
            "date": real_time_ohlc.get("date")
        }
        
        # Return the original user input as symbol for frontend display
        return {
            "symbol": symbol.upper().replace('.NS', ''),  # Clean format for frontend
            "normalized_symbol": final_symbol,  # What we actually used
            "data": {
                "ohlc_data": clean_ohlc,
                "timestamp": datetime.now().isoformat()
            },
            "news": [
                {
                    "title": n.get("title", ""),
                    "snippet": n.get("summary", n.get("snippet", "")),
                    "source": n.get("source", ""),
                    "link": n.get("link", n.get("url", "")),
                    "date": today
                } for n in real_time_news
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching data for {final_symbol}: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error fetching data for '{symbol}': {str(e)}"
        )

@app.get("/api/stocks/batch")
def get_multiple_stocks(symbols: str):
    """
    Get real-time data for multiple stocks (comma-separated symbols)
    
    Args:
        symbols: Comma-separated stock symbols
    """
    symbol_list = [s.strip() for s in symbols.split(",")]
    results = {}
    
    logger.info(f"🔍 Batch request for {len(symbol_list)} stocks")
    
    for symbol in symbol_list:
        try:
            stock_data = get_stock(symbol)
            results[symbol] = stock_data
        except HTTPException as e:
            results[symbol] = {"error": e.detail}
        except Exception as e:
            results[symbol] = {"error": f"Unexpected error: {str(e)}"}
    
    return results

@app.get("/api/database/stats")
def get_database_stats():
    """Get current database statistics"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    total_stocks = stocks_collection.count_documents({})
    total_news = news_collection.count_documents({})
    today_stocks = stocks_collection.count_documents({"date": today})
    today_news = news_collection.count_documents({"published_date": today})
    
    # Get unique symbols
    unique_symbols = stocks_collection.distinct("symbol")
    
    return {
        "database_stats": {
            "total_ohlc_records": total_stocks,
            "total_news_records": total_news,
            "today_ohlc_records": today_stocks,
            "today_news_records": today_news,
            "unique_stocks": len(unique_symbols),
            "available_symbols": unique_symbols[:10],  # Show first 10
            "last_updated": today
        }
    }

@app.get("/api/stocks/search/{query}")
def search_stocks(query: str):
    """
    Search for stocks with fuzzy matching
    
    Args:
        query: Stock symbol or company name to search for
    """
    logger.info(f"🔍 Stock search query: '{query}'")
    
    match_result = find_stock_matches(query, max_suggestions=10)
    
    return {
        "query": query,
        "exact_match": match_result["exact_match"],
        "symbol_suggestions": match_result["suggestions"],
        "company_matches": match_result["company_matches"],
        "total_suggestions": len(match_result["suggestions"]) + len(match_result["company_matches"])
    }

@app.post("/api/database/cleanup")
def cleanup_database():
    """
    Clean up duplicate symbols in database
    """
    logger.info("🧹 Starting database cleanup...")
    
    try:
        cleaned_count = clean_duplicate_symbols_in_db()
        
        return {
            "message": "Database cleanup completed",
            "duplicates_cleaned": cleaned_count,
            "status": "success"
        }
        
    except Exception as e:
        logger.error(f"❌ Error during database cleanup: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Database cleanup failed: {str(e)}"
        )

@app.get("/api/stock/{symbol}/history")
def get_stock_history(symbol: str, period: str = "7d"):
    """
    Get historical stock data for charts
    
    Args:
        symbol: Stock symbol
        period: Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
    """
    # Normalize symbol
    original_symbol = symbol
    if not symbol.endswith('.NS'):
        symbol = symbol + '.NS'
    
    logger.info(f"📈 Fetching historical data for {symbol} (period: {period})")
    
    try:
        ticker = yf.Ticker(symbol)
        
        # Fetch historical data
        hist = ticker.history(period=period)
        
        if hist.empty:
            raise HTTPException(
                status_code=404, 
                detail=f"No historical data available for '{original_symbol}'"
            )
        
        # Convert to list of dictionaries for JSON response
        history_data = []
        for i in range(len(hist)):
            row = hist.iloc[i]
            date_str = str(hist.index[i])[:10]  # Get first 10 chars (YYYY-MM-DD)
            
            history_data.append({
                "date": date_str,
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": int(row["Volume"]) if not pd.isna(row["Volume"]) else 0
            })
        
        logger.info(f"✅ Retrieved {len(history_data)} historical records for {symbol}")
        
        return {
            "symbol": original_symbol,
            "period": period,
            "data": history_data
        }
        
    except Exception as e:
        logger.error(f"❌ Error fetching historical data for {symbol}: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error fetching historical data for '{original_symbol}': {str(e)}"
        )