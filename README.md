# 📈 Stock Market Analysis System

A modern full-stack web application for real-time Indian stock market analysis with interactive charts, data visualization, and comprehensive stock tracking capabilities.

## ✨ Features

- **Real-Time Data** - Live stock prices and market updates
- **Interactive Charts** - Historical price visualization with Chart.js
- **Smart Search** - Intelligent stock symbol matching with fuzzy search
- **Data Export** - CSV download for any time period
- **Custom Analysis** - Flexible date range selection
- **Professional UI** - Clean, responsive design

## 🛠️ Technology Stack

**Backend:** FastAPI • MongoDB • yfinance • Pandas • Uvicorn  
**Frontend:** React 18 • Chart.js • Axios • Modern CSS

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- MongoDB

### Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Nirmal-36/stock-market-analysis.git
cd stock-market-analysis

# 2. Backend Setup
python3 -m venv myenv
source myenv/bin/activate  # Windows: myenv\Scripts\activate
pip install -r requirements.txt

# 3. Start Backend Server
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 4. Frontend Setup (new terminal)
cd frontend
npm install
npm start
```

### Access Points
- **Frontend Application:** http://localhost:3000
- **API Backend:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## 📊 API Reference

### Core Endpoints
```
GET  /api/stock/{symbol}          # Current stock data
GET  /api/stock/{symbol}/history  # Historical data
GET  /api/stock/{symbol}/export   # CSV export
GET  /api/stocks/list             # Available stocks
GET  /api/health                  # System health
```

## 🎯 Usage Guide

1. **Search Stocks** - Enter Indian stock symbols (RELIANCE, TCS, ICICIBANK)
2. **View Live Data** - Real-time prices, volume, and daily changes
3. **Analyze Trends** - Interactive charts with multiple timeframes
4. **Custom Periods** - Select specific date ranges for analysis
5. **Export Data** - Download historical data in CSV format

### Time Periods Available
- 7 Days, 1 Month, 3 Months, 6 Months
- 1 Year, 2 Years, 5 Years
- Custom date ranges

## 📁 Project Architecture

```
stock-market-analysis/
├── backend/
│   ├── main.py           # FastAPI application
│   ├── models.py         # Data models
│   ├── db.py            # Database connection
│   ├── fetcher.py       # Data fetching logic
│   └── stock_utils.py   # Utility functions
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── utils/      # Helper functions
│   │   └── App.js      # Main application
│   └── public/         # Static assets
└── requirements.txt    # Python dependencies
```

## ⚙️ Configuration

Create `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/stock_market
```

MongoDB collections created automatically:
- `stocks` - OHLC price data
- `news` - Market news articles

## 🎨 UI Design

Professional color scheme:
- **Primary:** #2C5F7A (Deep Blue)
- **Secondary:** #5A8AA8 (Medium Blue)  
- **Accent:** #C8B5A6 (Light Beige)
- **Background:** #F5F5F5 (Light Gray)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Yahoo Finance** - Stock data provider
- **Chart.js** - Data visualization
- **FastAPI** - Backend framework
- **React** - Frontend framework

---

**Built with ❤️ for the Indian stock market community**
