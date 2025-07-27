# List of major Indian stocks for NSE (National Stock Exchange)
# Format: "SYMBOL.NS" for NSE stocks

INDIAN_STOCKS = [
    # Nifty 50 Major Stocks
    "RELIANCE.NS",    # Reliance Industries
    "TCS.NS",         # Tata Consultancy Services
    "HDFCBANK.NS",    # HDFC Bank
    "INFY.NS",        # Infosys
    "ICICIBANK.NS",   # ICICI Bank
    "HINDUNILVR.NS",  # Hindustan Unilever
    "ITC.NS",         # ITC Limited
    "SBIN.NS",        # State Bank of India
    "BHARTIARTL.NS",  # Bharti Airtel
    "KOTAKBANK.NS",   # Kotak Mahindra Bank
    "LT.NS",          # Larsen & Toubro
    "HCLTECH.NS",     # HCL Technologies
    "ASIANPAINT.NS",  # Asian Paints
    "MARUTI.NS",      # Maruti Suzuki
    "BAJFINANCE.NS",  # Bajaj Finance
    "WIPRO.NS",       # Wipro
    "ULTRACEMCO.NS",  # UltraTech Cement
    "NESTLEIND.NS",   # Nestle India
    "AXISBANK.NS",    # Axis Bank
    "TITAN.NS",       # Titan Company
    "SUNPHARMA.NS",   # Sun Pharmaceutical
    "POWERGRID.NS",   # Power Grid Corporation
    "NTPC.NS",        # NTPC Limited
    "TECHM.NS",       # Tech Mahindra
    "M&M.NS",         # Mahindra & Mahindra
    "BAJAJFINSV.NS",  # Bajaj Finserv
    "DRREDDY.NS",     # Dr. Reddy's Laboratories
    "JSWSTEEL.NS",    # JSW Steel
    "TATAMOTORS.NS",  # Tata Motors
    "INDUSINDBK.NS",  # IndusInd Bank
    "CIPLA.NS",       # Cipla
    "GRASIM.NS",      # Grasim Industries
    "BRITANNIA.NS",   # Britannia Industries
    "COALINDIA.NS",   # Coal India
    "HINDALCO.NS",    # Hindalco Industries
    "EICHERMOT.NS",   # Eicher Motors
    "BPCL.NS",        # Bharat Petroleum
    "ONGC.NS",        # Oil & Natural Gas Corporation
    "DIVISLAB.NS",    # Divi's Laboratories
    "TATASTEEL.NS",   # Tata Steel
    "HEROMOTOCO.NS",  # Hero MotoCorp
    "ADANIPORTS.NS",  # Adani Ports
    "BAJAJ-AUTO.NS",  # Bajaj Auto
    "SHREECEM.NS",    # Shree Cement
    "APOLLOHOSP.NS",  # Apollo Hospitals
    "UPL.NS",         # UPL Limited
    "TATACONSUM.NS",  # Tata Consumer Products
    "SBILIFE.NS",     # SBI Life Insurance
    "HDFCLIFE.NS",    # HDFC Life Insurance
    "GODREJCP.NS",    # Godrej Consumer Products
]

# You can add more stocks or categorize them further
BANKING_STOCKS = [
    "HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS", "KOTAKBANK.NS", 
    "AXISBANK.NS", "INDUSINDBK.NS", "BANKBARODA.NS", "PNB.NS"
]

IT_STOCKS = [
    "TCS.NS", "INFY.NS", "HCLTECH.NS", "WIPRO.NS", 
    "TECHM.NS", "MINDTREE.NS", "MPHASIS.NS"
]

# Function to get all stocks or by category
def get_stocks(category="all"):
    if category == "all":
        return INDIAN_STOCKS
    elif category == "banking":
        return BANKING_STOCKS
    elif category == "it":
        return IT_STOCKS
    else:
        return INDIAN_STOCKS
