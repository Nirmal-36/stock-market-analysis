import React, { useState, useEffect } from 'react';
import { getStock, getAvailableStocks } from '../utils/api';
import './StockSearch.css';

const StockSearch = ({ onStockFound, onLoading, onError }) => {
  const [symbol, setSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load available stocks on component mount
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const stocks = await getAvailableStocks();
        setAvailableStocks(stocks);
      } catch (error) {
        console.error('Failed to load available stocks:', error);
      }
    };
    loadStocks();
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (symbol.length > 0) {
      const filtered = availableStocks
        .filter(stock => 
          stock.toLowerCase().includes(symbol.toLowerCase()) ||
          stock.replace('.NS', '').toLowerCase().includes(symbol.toLowerCase())
        )
        .slice(0, 5); // Show max 5 suggestions
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [symbol, availableStocks]);

  const searchStock = async (searchSymbol = symbol) => {
    if (!searchSymbol.trim()) {
      onError('Please enter a stock symbol');
      return;
    }

    setIsLoading(true);
    onLoading(true);
    
    try {
      const stockData = await getStock(searchSymbol);
      onStockFound(stockData);
      setShowSuggestions(false);
    } catch (error) {
      onError(error.message);
    } finally {
      setIsLoading(false);
      onLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchStock();
  };

  const handleSuggestionClick = (suggestion) => {
    const cleanSymbol = suggestion.replace('.NS', '');
    setSymbol(cleanSymbol);
    setShowSuggestions(false);
    searchStock(cleanSymbol);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="stock-search">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter stock symbol (e.g., RELIANCE, TCS, INFY)"
            className="search-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={isLoading || !symbol.trim()}
          >
            {isLoading ? '🔄' : '🔍'} Search
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="suggestion-symbol">
                  {suggestion.replace('.NS', '')}
                </span>
                <span className="suggestion-full">
                  {suggestion}
                </span>
              </div>
            ))}
          </div>
        )}
      </form>

      <div className="quick-search">
        <span className="quick-search-label">Quick Search:</span>
        {['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'].map(stock => (
          <button
            key={stock}
            onClick={() => handleSuggestionClick(stock)}
            className="quick-button"
            disabled={isLoading}
          >
            {stock}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockSearch;
