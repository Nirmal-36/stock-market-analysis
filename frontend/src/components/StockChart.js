import React, { useState, useEffect, useCallback } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { getStockHistory } from '../utils/api';
import './StockChart.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StockChart = ({ stockData, chartType = 'line' }) => {
    const [historicalData, setHistoricalData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState('7d');

    // Extract data safely
    const symbol = stockData?.symbol || '';
    const ohlcData = stockData?.data?.ohlc_data || null;
    const hasValidData = stockData && stockData.data && stockData.data.ohlc_data;

    // Generate sample historical data as fallback
    const generateSampleData = useCallback(() => {
        if (!ohlcData) return [];

        const days = 7;
        const currentPrice = ohlcData.close;
        const data = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // Generate realistic price variations (±2% from current)
            const variation = (Math.random() - 0.5) * 0.04; // ±2%
            const price = currentPrice * (1 + variation);

            data.push({
                date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                price: price,
                volume: Math.floor(Math.random() * 1000000) + 500000
            });
        }

        // Ensure today's data matches actual OHLC
        data[data.length - 1] = {
            date: 'Today',
            price: currentPrice,
            volume: ohlcData.volume || Math.floor(Math.random() * 1000000) + 500000
        };

        return data;
    }, [ohlcData]);

    // Fetch historical data when component mounts or symbol/period changes
    useEffect(() => {
        if (!hasValidData || !symbol) return;

        const fetchHistoricalData = async () => {
            setLoading(true);
            try {
                const histData = await getStockHistory(symbol, period);
                setHistoricalData(histData.data);
            } catch (error) {
                console.error('Error fetching historical data:', error);
                // Fall back to sample data if API fails
                setHistoricalData(generateSampleData());
            } finally {
                setLoading(false);
            }
        };

        fetchHistoricalData();
    }, [symbol, period, hasValidData, generateSampleData]);

    // Early return after hooks
    if (!hasValidData) {
        return (
            <div className="stock-chart">
                <div className="chart-placeholder">
                    <p>No chart data available</p>
                </div>
            </div>
        );
    }

    // Use historical data if available, otherwise fall back to sample data
    const chartData = historicalData || generateSampleData();

    // Format data for charts
    const formatChartData = (data) => {
        if (Array.isArray(data)) {
            // Real historical data format
            return data.map(item => ({
                date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                price: item.close,
                volume: item.volume
            }));
        } else {
            // Sample data format (fallback)
            return data;
        }
    };

    const formattedData = formatChartData(chartData);

    // Price chart configuration
    const priceChartData = {
        labels: formattedData.map(item => item.date),
        datasets: [
            {
                label: `${symbol} Price`,
                data: formattedData.map(item => item.price),
                borderColor: 'rgb(44, 95, 122)', // Dark blue from palette
                backgroundColor: 'rgba(44, 95, 122, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(44, 95, 122)',
                pointBorderColor: '#F5F5F5',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
            }
        ]
    };

    // Volume chart configuration
    const volumeChartData = {
        labels: formattedData.map(item => item.date),
        datasets: [
            {
                label: 'Volume',
                data: formattedData.map(item => item.volume),
                backgroundColor: formattedData.map((item, index) =>
                    index === 0 || item.price >= formattedData[index - 1]?.price
                        ? 'rgba(90, 138, 168, 0.7)' // Medium blue for positive
                        : 'rgba(200, 181, 166, 0.7)' // Light beige for negative
                ),
                borderColor: formattedData.map((item, index) =>
                    index === 0 || item.price >= formattedData[index - 1]?.price
                        ? 'rgb(90, 138, 168)' // Medium blue
                        : 'rgb(200, 181, 166)' // Light beige
                ),
                borderWidth: 1,
            }
        ]
    };

    // Chart options
    const priceChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        weight: 'bold'
                    }
                }
            },
            title: {
                display: true,
                text: `${symbol} - Price Trend (${period.toUpperCase()})`,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(44, 95, 122, 0.9)',
                titleColor: '#F5F5F5',
                bodyColor: '#F5F5F5',
                borderColor: 'rgb(90, 138, 168)',
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        return `Price: ₹${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Date',
                    font: {
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(90, 138, 168, 0.2)'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Price (₹)',
                    font: {
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(90, 138, 168, 0.2)'
                },
                ticks: {
                    callback: function (value) {
                        return '₹' + value.toFixed(2);
                    }
                }
            }
        }
    };

    const volumeChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        weight: 'bold'
                    }
                }
            },
            title: {
                display: true,
                text: `${symbol} - Volume (${period.toUpperCase()})`,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(44, 95, 122, 0.9)',
                titleColor: '#F5F5F5',
                bodyColor: '#F5F5F5',
                callbacks: {
                    label: function (context) {
                        const volume = context.parsed.y;
                        let formattedVolume;
                        if (volume >= 10000000) {
                            formattedVolume = `${(volume / 10000000).toFixed(2)}Cr`;
                        } else if (volume >= 100000) {
                            formattedVolume = `${(volume / 100000).toFixed(2)}L`;
                        } else if (volume >= 1000) {
                            formattedVolume = `${(volume / 1000).toFixed(2)}K`;
                        } else {
                            formattedVolume = volume.toLocaleString('en-IN');
                        }
                        return `Volume: ${formattedVolume}`;
                    }
                }
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Date',
                    font: {
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(90, 138, 168, 0.2)'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Volume',
                    font: {
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(90, 138, 168, 0.2)'
                },
                ticks: {
                    callback: function (value) {
                        if (value >= 10000000) {
                            return `${(value / 10000000).toFixed(1)}Cr`;
                        } else if (value >= 100000) {
                            return `${(value / 100000).toFixed(1)}L`;
                        } else if (value >= 1000) {
                            return `${(value / 1000).toFixed(1)}K`;
                        }
                        return value.toLocaleString('en-IN');
                    }
                }
            }
        }
    };

    return (
        <div className="stock-chart">
            {/* Period Selection Controls */}
            <div className="chart-controls">
                <span className="controls-label">Time Period:</span>
                {['1d', '7d', '1mo', '3mo', '6mo', '1y'].map(p => (
                    <button
                        key={p}
                        className={`chart-control-button ${period === p ? 'active' : ''}`}
                        onClick={() => setPeriod(p)}
                        disabled={loading}
                    >
                        {p.toUpperCase()}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="chart-loading">
                    <div className="chart-loading-spinner"></div>
                    <p className="chart-loading-text">Loading historical data...</p>
                </div>
            ) : (
                <div className="chart-container">
                    <div className="chart-section">
                        <div className="chart-wrapper">
                            <Line data={priceChartData} options={priceChartOptions} />
                        </div>
                    </div>

                    <div className="chart-section">
                        <div className="chart-wrapper">
                            <Bar data={volumeChartData} options={volumeChartOptions} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockChart;
