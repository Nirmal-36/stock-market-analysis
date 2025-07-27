from db import stocks_collection, news_collection
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def normalize_symbol(symbol: str) -> str:
    """Normalize stock symbol to standard format"""
    if not symbol:
        return ""
    return symbol.strip().upper()

def update_stock_in_database(symbol: str, ohlc_data: dict, news_data: list, clean_old_data: bool = False):
    """
    Update stock data in database with optional cleanup of old data
    
    Args:
        symbol: Stock symbol (e.g., 'RELIANCE.NS')
        ohlc_data: OHLC data dictionary
        news_data: List of news articles
        clean_old_data: If True, delete all existing data for this stock before inserting new data
    """
    try:
        # Normalize symbol to ensure consistency
        normalized_symbol = normalize_symbol(symbol)
        today = datetime.now().strftime("%Y-%m-%d")
        
        if clean_old_data:
            # Delete ALL existing data for this stock (not just today's)
            deleted_stocks = stocks_collection.delete_many({"symbol": normalized_symbol})
            deleted_news = news_collection.delete_many({"stock": normalized_symbol})
            logger.info(f"🧹 Cleaned up {deleted_stocks.deleted_count} old OHLC records and {deleted_news.deleted_count} old news records for {normalized_symbol}")
        
        # Insert fresh OHLC data
        if ohlc_data:
            # Ensure the symbol in data is normalized
            ohlc_data["symbol"] = normalized_symbol
            stocks_collection.insert_one(ohlc_data)
            logger.info(f"📊 Inserted OHLC data for {normalized_symbol}")
        
        # Insert fresh news data
        if news_data:
            news_count = 0
            for article in news_data:
                article_copy = article.copy()
                article_copy["stock"] = normalized_symbol  # Use normalized symbol
                article_copy["published_date"] = today
                news_collection.insert_one(article_copy)
                news_count += 1
            logger.info(f"📰 Inserted {news_count} news articles for {normalized_symbol}")
            
    except Exception as e:
        logger.error(f"❌ Error updating {symbol} in database: {e}")
        raise e
