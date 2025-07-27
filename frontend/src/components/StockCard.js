import React from 'react';
import './StockCard.css';

const StockCard = ({ stockData }) => {
  if (!stockData) return null;

  const { symbol, data, news } = stockData;
  const ohlcData = data.ohlc_data;
  const currentPrice = ohlcData?.close || 0;
  const openPrice = ohlcData?.open || 0;
  const highPrice = ohlcData?.high || 0;
  const lowPrice = ohlcData?.low || 0;
  const volume = ohlcData?.volume || 0;

  // Calculate price change and percentage
  const priceChange = currentPrice - openPrice;
  const priceChangePercent = openPrice !== 0 ? ((priceChange / openPrice) * 100) : 0;
  const isPositive = priceChange >= 0;

  // Format numbers
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatVolume = (vol) => {
    if (vol >= 10000000) {
      return `${(vol / 10000000).toFixed(2)}Cr`;
    } else if (vol >= 100000) {
      return `${(vol / 100000).toFixed(2)}L`;
    } else if (vol >= 1000) {
      return `${(vol / 1000).toFixed(2)}K`;
    }
    return vol.toLocaleString('en-IN');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="stock-card">
      {/* Header */}
      <div className="stock-header">
        <div className="stock-title">
          <h2 className="stock-symbol">{symbol}</h2>
          <span className="last-updated">
            Last Updated: {formatDate(data.timestamp)}
          </span>
        </div>
        <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
          <span className="price-change-value">
            {isPositive ? '+' : ''}{formatPrice(priceChange)}
          </span>
          <span className="price-change-percent">
            ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Price Information */}
      <div className="price-section">
        <div className="current-price">
          <span className="price-label">Current Price</span>
          <span className="price-value">{formatPrice(currentPrice)}</span>
        </div>
        
        <div className="price-details">
          <div className="price-item">
            <span className="label">Open</span>
            <span className="value">{formatPrice(openPrice)}</span>
          </div>
          <div className="price-item">
            <span className="label">High</span>
            <span className="value high">{formatPrice(highPrice)}</span>
          </div>
          <div className="price-item">
            <span className="label">Low</span>
            <span className="value low">{formatPrice(lowPrice)}</span>
          </div>
          <div className="price-item">
            <span className="label">Volume</span>
            <span className="value">{formatVolume(volume)}</span>
          </div>
        </div>
      </div>

      {/* News Section */}
      {news && news.length > 0 && (
        <div className="news-section">
          <h3 className="news-title">Latest News</h3>
          <div className="news-list">
            {news.slice(0, 5).map((item, index) => (
              <div key={index} className="news-item">
                <div className="news-content">
                  <h4 className="news-headline">{item.title}</h4>
                  <p className="news-snippet">{item.snippet}</p>
                  <div className="news-meta">
                    <span className="news-source">{item.source}</span>
                    <span className="news-date">{formatDate(item.date)}</span>
                  </div>
                </div>
                {item.link && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="news-link"
                  >
                    Read More →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Status Indicator */}
      <div className="market-status">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-text">Real-time Data</span>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
