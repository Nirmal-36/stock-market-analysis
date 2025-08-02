import React, { useState, useCallback, useEffect } from 'react';
import StockSearch from './components/StockSearch';
import StockCard from './components/StockCard';
import StockChart from './components/StockChart';
import StockDataControls from './components/StockDataControls';
import { getStockHistory } from './utils/api';
import './App.css';

function App() {
  const [stockData, setStockData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('3M'); // Default to 3 months
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStockFound = useCallback((data) => {
    setStockData(data);
    setHistoricalData(null); // Reset historical data when new stock is selected
    setError('');
  }, []);

  const handleHistoryData = useCallback((data) => {
    setHistoricalData(data);
  }, []);

  const handleLoading = useCallback((isLoading) => {
    setLoading(isLoading);
  }, []);

  const handleError = useCallback((errorMessage) => {
    setError(errorMessage);
    setStockData(null);
  }, []);

  const clearData = useCallback(() => {
    setStockData(null);
    setHistoricalData(null);
    setError('');
  }, []);

  // Auto-fetch 3 months of historical data when a new stock is selected
  useEffect(() => {
    if (stockData && stockData.symbol && !historicalData) {
      setLoading(true);
      
      getStockHistory(stockData.symbol, selectedPeriod)
        .then(data => {
          setHistoricalData(data);
        })
        .catch(error => {
          setError(`Failed to load historical data: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [stockData, historicalData, selectedPeriod]);

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            📈 Stock Market Analysis
          </h1>
          <p className="app-subtitle">
            Real-time Indian stock market data and analysis
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* Search Section */}
          <StockSearch
            onStockFound={handleStockFound}
            onLoading={handleLoading}
            onError={handleError}
          />

          {/* Loading State */}
          {loading && (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p className="loading-text">Fetching real-time stock data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-section">
              <div className="error-content">
                <span className="error-icon">⚠️</span>
                <p className="error-message">{error}</p>
                <button onClick={clearData} className="error-button">
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Stock Data Display */}
          {stockData && !loading && (
            <div className="results-section">
              <div className="results-header">
                <h2 className="results-title">
                  Stock Analysis for {stockData.symbol}
                </h2>
                <button onClick={clearData} className="clear-button">
                  🔍 Search Another Stock
                </button>
              </div>

              {/* Stock Card */}
              <StockCard stockData={stockData} />

              {/* Stock Data Controls - Time Period Selection & CSV Download */}
              <StockDataControls 
                stockSymbol={stockData.symbol}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                onHistoryData={handleHistoryData}
                onLoading={handleLoading}
                onError={handleError}
              />

              {/* Stock Chart */}
              <StockChart 
                stockData={stockData} 
                historicalData={historicalData}
              />
            </div>
          )}

          {/* Welcome State */}
          {!stockData && !loading && !error && (
            <div className="welcome-section">
              <div className="welcome-content">
                <div className="welcome-icon">📊</div>
                <h2 className="welcome-title">Welcome to Stock Market Analysis</h2>
                <p className="welcome-description">
                  Get real-time data, latest news, and price analysis for Indian stocks. 
                  Search for any stock symbol above to get started.
                </p>
                <div className="welcome-features">
                  <div className="feature">
                    <span className="feature-icon">⚡</span>
                    <span className="feature-text">Real-time Data</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📰</span>
                    <span className="feature-text">Latest News</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📈</span>
                    <span className="feature-text">Price Charts</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🇮🇳</span>
                    <span className="feature-text">Indian Markets</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-text">
            Built with React & FastAPI • Real-time data powered by Yahoo Finance
          </p>
          <p className="footer-disclaimer">
            Data provided for educational purposes only. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
