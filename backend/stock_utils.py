from difflib import get_close_matches
from indian_stocks import get_stocks
import re

def normalize_symbol(symbol: str) -> str:
    """
    Normalize stock symbol to standard format
    - Convert to uppercase
    - Add .NS if not present
    - Remove extra spaces
    """
    if not symbol:
        return ""
    
    # Clean and normalize
    symbol = symbol.strip().upper()
    
    # Add .NS if not present
    if not symbol.endswith('.NS'):
        symbol = symbol + '.NS'
    
    return symbol

def find_stock_matches(user_input: str, max_suggestions: int = 5) -> dict:
    """
    Find stock matches using fuzzy matching
    
    Args:
        user_input: User's input (can be symbol or company name)
        max_suggestions: Maximum number of suggestions to return
    
    Returns:
        {
            "exact_match": "SYMBOL.NS" or None,
            "suggestions": ["SYMBOL1.NS", "SYMBOL2.NS", ...],
            "company_matches": ["Company Name 1", "Company Name 2", ...]
        }
    """
    all_stocks = get_stocks("all")
    
    # Normalize user input
    normalized_input = normalize_symbol(user_input)
    
    # Check for exact match first
    if normalized_input in all_stocks:
        return {
            "exact_match": normalized_input,
            "suggestions": [],
            "company_matches": []
        }
    
    # Create symbol list without .NS for matching
    symbols_without_ns = [stock.replace('.NS', '') for stock in all_stocks]
    user_input_clean = user_input.strip().upper().replace('.NS', '')
    
    # Try exact match without .NS
    if user_input_clean in symbols_without_ns:
        exact_symbol = user_input_clean + '.NS'
        return {
            "exact_match": exact_symbol,
            "suggestions": [],
            "company_matches": []
        }
    
    # Fuzzy matching on symbols
    symbol_matches = get_close_matches(
        user_input_clean, 
        symbols_without_ns, 
        n=max_suggestions, 
        cutoff=0.6
    )
    
    # Convert back to .NS format
    symbol_suggestions = [match + '.NS' for match in symbol_matches]
    
    # Create company name mapping for common stocks
    company_mapping = {
        'RELIANCE.NS': 'Reliance Industries',
        'TCS.NS': 'Tata Consultancy Services',
        'INFY.NS': 'Infosys',
        'HDFCBANK.NS': 'HDFC Bank',
        'ICICIBANK.NS': 'ICICI Bank',
        'SBIN.NS': 'State Bank of India',
        'BAJFINANCE.NS': 'Bajaj Finance',
        'BHARTIARTL.NS': 'Bharti Airtel',
        'ASIANPAINT.NS': 'Asian Paints',
        'MARUTI.NS': 'Maruti Suzuki',
        'TATAMOTORS.NS': 'Tata Motors',
        'WIPRO.NS': 'Wipro',
        'TECHM.NS': 'Tech Mahindra',
        'POWERGRID.NS': 'Power Grid Corporation',
        'NESTLEIND.NS': 'Nestle India',
        'KOTAKBANK.NS': 'Kotak Mahindra Bank',
        'LT.NS': 'Larsen & Toubro',
        'ADANIPORTS.NS': 'Adani Ports',
        'AXISBANK.NS': 'Axis Bank',
        'TITAN.NS': 'Titan Company'
    }
    
    # Try fuzzy matching on company names
    company_names = list(company_mapping.values())
    company_matches = get_close_matches(
        user_input.strip(), 
        company_names, 
        n=max_suggestions, 
        cutoff=0.6
    )
    
    # If company name matches, get corresponding symbols
    if company_matches:
        for symbol, company in company_mapping.items():
            if company in company_matches and symbol not in symbol_suggestions:
                symbol_suggestions.insert(0, symbol)
    
    return {
        "exact_match": None,
        "suggestions": symbol_suggestions[:max_suggestions],
        "company_matches": company_matches
    }

def clean_duplicate_symbols_in_db():
    """
    Clean duplicate symbols in database (different cases of same stock)
    """
    from db import stocks_collection, news_collection
    import logging
    
    logger = logging.getLogger(__name__)
    
    # Get all unique symbols from database
    all_symbols = stocks_collection.distinct("symbol")
    
    # Group symbols by normalized version
    symbol_groups = {}
    for symbol in all_symbols:
        normalized = normalize_symbol(symbol)
        if normalized not in symbol_groups:
            symbol_groups[normalized] = []
        symbol_groups[normalized].append(symbol)
    
    # Find and clean duplicates
    cleaned_count = 0
    for normalized, symbols in symbol_groups.items():
        if len(symbols) > 1:
            logger.info(f"🔍 Found duplicates for {normalized}: {symbols}")
            
            # Keep the properly formatted one (uppercase with .NS)
            primary_symbol = normalized
            duplicates = [s for s in symbols if s != primary_symbol]
            
            # Move data from duplicates to primary symbol
            for duplicate in duplicates:
                # Update OHLC records
                stocks_collection.update_many(
                    {"symbol": duplicate},
                    {"$set": {"symbol": primary_symbol}}
                )
                
                # Update news records
                news_collection.update_many(
                    {"stock": duplicate},
                    {"$set": {"stock": primary_symbol}}
                )
                
                logger.info(f"🔄 Merged {duplicate} → {primary_symbol}")
                cleaned_count += 1
    
    if cleaned_count > 0:
        logger.info(f"✅ Cleaned {cleaned_count} duplicate symbols")
    else:
        logger.info("✅ No duplicate symbols found")
    
    return cleaned_count
