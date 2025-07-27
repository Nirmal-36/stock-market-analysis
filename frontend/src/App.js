import React, { useState } from 'react';
import StockSearch from './components/StockSearch';
import StockCard from './components/StockCard';
import StockChart from './components/StockChart';
import './App.css';

function App() {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStockFound = (data) => {
    setStockData(data);
    setError('');
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setStockData(null);
  };

  const clearData = () => {
    setStockData(null);
    setError('');
  };

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

              {/* Stock Chart */}
              <StockChart stockData={stockData} />
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
