// API utility functions for stock market data
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get single stock data
export const getStock = async (symbol) => {
  try {
    const response = await api.get(`/api/stock/${symbol}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch stock data');
  }
};

// Get historical stock data for charts
export const getStockHistory = async (symbol, period = '7d') => {
  try {
    const response = await api.get(`/api/stock/${symbol}/history?period=${period}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch historical data');
  }
};

// Get multiple stocks
export const getMultipleStocks = async (symbols) => {
  try {
    const symbolString = symbols.join(',');
    const response = await api.get(`/api/stocks/batch?symbols=${symbolString}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch multiple stocks data');
  }
};

// Get all available stocks
export const getAvailableStocks = async () => {
  try {
    const response = await api.get('/api/stocks/list');
    return response.data.stocks;
  } catch (error) {
    throw new Error('Failed to fetch available stocks');
  }
};

// Get stock categories
export const getStockCategories = async () => {
  try {
    const response = await api.get('/api/stocks/categories');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch stock categories');
  }
};

// Get database statistics
export const getDatabaseStats = async () => {
  try {
    const response = await api.get('/api/database/stats');
    return response.data.database_stats;
  } catch (error) {
    throw new Error('Failed to fetch database stats');
  }
};

export default api;
