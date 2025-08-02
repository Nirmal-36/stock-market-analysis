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

const StockChart = ({ stockData, historicalData: propHistoricalData, chartType = 'line' }) => {
    const [historicalData, setHistoricalData] = useState(null);

    // Extract data safely
    const symbol = stockData?.symbol || '';
    const ohlcData = stockData?.data?.ohlc_data || null;
    const hasValidData = stockData && stockData.data && stockData.data.ohlc_data;

    // Use historical data from props if available
    useEffect(() => {
        if (propHistoricalData && propHistoricalData.history) {
            console.log('📊 StockChart: Updating historical data, length:', propHistoricalData.history.length);
            setHistoricalData(propHistoricalData.history);
        } else if (propHistoricalData === null) {
            console.log('📊 StockChart: Clearing historical data');
            setHistoricalData(null);
        }
    }, [propHistoricalData]);

    // Generate sample historical data as fallback
    const generateSampleData = useCallback(() => {
        if (!ohlcData) return [];

        const days = 7;
        const currentPrice = ohlcData.close;
        const data = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Generate realistic price variation
            const variation = (Math.random() - 0.5) * 0.04; // ±2% variation
            const price = currentPrice * (1 + variation);
            const volume = Math.floor(Math.random() * 1000000) + 100000;

            data.push({
                date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                price: price,
                volume: volume
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
        if (Array.isArray(data) && data.length > 0 && data[0].date) {
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
                label: `${symbol} Volume`,
                data: formattedData.map(item => item.volume),
                backgroundColor: 'rgba(90, 138, 168, 0.8)',
                borderColor: 'rgb(90, 138, 168)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
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
                    color: '#2C5F7A',
                    font: {
                        weight: 'bold'
                    }
                }
            },
            title: {
                display: false
            },
            tooltip: {
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
                    color: '#2C5F7A',
                    font: {
                        weight: 'bold'
                    }
                }
            },
            title: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(44, 95, 122, 0.9)',
                titleColor: '#F5F5F5',
                bodyColor: '#F5F5F5',
                borderColor: 'rgb(90, 138, 168)',
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        return `Volume: ${context.parsed.y.toLocaleString('en-IN')}`;
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
            <div className="chart-container">
                <div className="chart-section">
                    <h3 className="chart-title">📈 Price Chart</h3>
                    <div className="chart-wrapper">
                        <Line data={priceChartData} options={priceChartOptions} />
                    </div>
                </div>

                <div className="chart-section">
                    <h3 className="chart-title">📊 Volume Chart</h3>
                    <div className="chart-wrapper">
                        <Bar data={volumeChartData} options={volumeChartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockChart;
