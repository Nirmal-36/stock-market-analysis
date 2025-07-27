import schedule, time
from fetcher import fetch_ohlc, fetch_news
from db import stocks_collection, news_collection
from db_utils import update_stock_in_database
from indian_stocks import get_stocks

STOCKS = get_stocks("all")  # Get all Indian stocks

def update_all_stocks():
    """Daily batch update: Delete old data and insert fresh data for all stocks"""
    from datetime import datetime
    import logging
    import time
    
    # Set up logging
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)
    
    today = datetime.now().strftime("%Y-%m-%d")
    
    logger.info(f"🚀 Starting daily batch update for {today}")
    logger.info(f"📊 Total stocks to process: {len(STOCKS)}")
    logger.info("🧹 Old data will be cleaned automatically during updates...")
    
    # Batch update all stocks
    successful_updates = 0
    failed_updates = 0
    total_news_stored = 0
    
    for i, stock in enumerate(STOCKS, 1):
        try:
            logger.info(f"📈 Processing {stock} ({i}/{len(STOCKS)})")
            
            # Fetch OHLC and news data
            ohlc = fetch_ohlc(stock)
            company_name = stock.replace('.NS', '')
            news = fetch_news(company_name)
            
            if ohlc and news:
                # Use centralized update function with cleanup
                update_stock_in_database(stock, ohlc, news, clean_old_data=True)
                logger.info(f"   ✅ Updated: Close ₹{ohlc['close']}, {len(news)} news articles")
                successful_updates += 1
                total_news_stored += len(news)
            else:
                logger.warning(f"   ❌ Failed to fetch data for {stock}")
                failed_updates += 1
            
            # Small delay to avoid rate limiting
            time.sleep(0.5)
                
        except Exception as e:
            logger.error(f"   ❌ Error processing {stock}: {e}")
            failed_updates += 1
    
    logger.info(f"🎉 Daily batch update completed!")
    logger.info(f"   📈 OHLC: {successful_updates} successful, {failed_updates} failed")
    logger.info(f"   📰 Total news articles stored: {total_news_stored}")

schedule.every().day.at("18:00").do(update_all_stocks)

while True:
    schedule.run_pending()
    time.sleep(60)
