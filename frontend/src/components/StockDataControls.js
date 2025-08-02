import React, { useState, useRef } from 'react';
import './StockDataControls.css';
import { getStockHistory } from '../utils/api';

const StockDataControls = ({ stockSymbol, selectedPeriod, onPeriodChange, onHistoryData, onLoading, onError }) => {
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Refs for managing API calls
  const abortControllerRef = useRef(null);
  const currentRequestRef = useRef(null);

  const timePeriods = [
    { value: '7d', label: '7 Days' },
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: '2Y', label: '2 Years' },
    { value: '5Y', label: '5 Years' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Handle period selection
  const handlePeriodChange = async (period) => {
    if (loadingHistory) return;

    onPeriodChange(period); // Update parent state

    if (period === 'custom') {
      setUseCustomRange(true);
      return;
    }

    setUseCustomRange(false);
    setDateRange({ startDate: '', endDate: '' });

    // Fetch data if stock is selected
    if (stockSymbol) {
      await fetchData(period);
    }
  };

  // Fetch historical data
  const fetchData = async (period) => {
    if (!stockSymbol) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const requestId = `${stockSymbol}-${period}-${Date.now()}`;
    currentRequestRef.current = requestId;

    setLoadingHistory(true);
    if (onLoading) onLoading(true);

    try {
      const data = await getStockHistory(stockSymbol, period);
      
      // Check if this request is still current
      if (currentRequestRef.current !== requestId) {
        return;
      }

      if (onHistoryData) onHistoryData(data);
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      
      if (currentRequestRef.current !== requestId) {
        return;
      }

      console.error('Error fetching data:', error);
      if (onError) onError(`Failed to fetch data: ${error.message}`);
    } finally {
      if (currentRequestRef.current === requestId) {
        setLoadingHistory(false);
        if (onLoading) onLoading(false);
      }
    }
  };

  // Handle custom date range changes
  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch data for custom date range
  const handleCustomRangeFetch = async () => {
    if (!stockSymbol || !dateRange.startDate || !dateRange.endDate) return;

    setLoadingHistory(true);
    if (onLoading) onLoading(true);

    try {
      const data = await getStockHistory(
        stockSymbol,
        'custom',
        dateRange.startDate,
        dateRange.endDate
      );
      
      if (onHistoryData) onHistoryData(data);
    } catch (error) {
      console.error('Error fetching custom range data:', error);
      if (onError) onError(`Failed to fetch data for date range: ${error.message}`);
    } finally {
      setLoadingHistory(false);
      if (onLoading) onLoading(false);
    }
  };

  // Download CSV
  const downloadCSV = async () => {
    if (!stockSymbol) return;

    try {
      let url;
      let filename;

      if (useCustomRange && dateRange.startDate && dateRange.endDate) {
        // Custom date range
        url = `http://localhost:8000/api/stock/${stockSymbol}/export?format=csv&start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`;
        filename = `${stockSymbol}_${dateRange.startDate}_to_${dateRange.endDate}.csv`;
      } else {
        // Time period
        url = `http://localhost:8000/api/stock/${stockSymbol}/export?format=csv&period=${selectedPeriod}`;
        filename = `${stockSymbol}_${selectedPeriod}.csv`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvData = await response.text();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      if (onError) onError(`Download failed: ${error.message}`);
    }
  };

  return (
    <div className="stock-data-controls">
      <div className="controls-header">
        <h3 className="controls-title">📊 Historical Data & Export</h3>
        <p className="controls-subtitle">Select time period and download data</p>
      </div>

      <div className="controls-section">
        <div className="period-selector">
          <label className="period-label">Time Period:</label>
          <div className="period-buttons">
            {timePeriods.map((period) => (
              <button
                key={period.value}
                className={`period-button ${selectedPeriod === period.value && !useCustomRange ? 'active' : ''}`}
                onClick={() => handlePeriodChange(period.value)}
                disabled={loadingHistory}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {useCustomRange && (
          <div className="date-range-section">
            <h4 className="date-range-title">📅 Select Date Range</h4>
            <div className="date-inputs">
              <div className="date-input-group">
                <label className="date-label">Start Date:</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  className="date-input"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="date-input-group">
                <label className="date-label">End Date:</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  className="date-input"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <button
              className="fetch-button"
              onClick={handleCustomRangeFetch}
              disabled={!dateRange.startDate || !dateRange.endDate || loadingHistory}
            >
              {loadingHistory ? 'Fetching...' : 'Fetch Data'}
            </button>
          </div>
        )}

        <div className="download-section">
          <button
            className="download-button"
            onClick={downloadCSV}
            disabled={!stockSymbol || loadingHistory}
            title="Download CSV for selected time period"
          >
            {loadingHistory ? (
              <span>
                <div className="loading-spinner-small"></div>
                Loading...
              </span>
            ) : (
              '📥 Download CSV'
            )}
          </button>
          
          {stockSymbol && !loadingHistory && (
            <div className="data-info">
              <span className="data-count">
                ✅ Ready to download CSV for {useCustomRange ? 'custom date range' : `${selectedPeriod} period`}
              </span>
            </div>
          )}
          
          {!stockSymbol && !loadingHistory && (
            <div className="data-info">
              <span className="data-count no-data">
                ⏳ Search for a stock to enable CSV download
              </span>
            </div>
          )}
        </div>
      </div>

      {loadingHistory && (
        <div className="loading-history">
          <div className="loading-spinner"></div>
          <p>Fetching {useCustomRange ? 'custom range' : selectedPeriod} historical data...</p>
        </div>
      )}
    </div>
  );
};

export default StockDataControls;
