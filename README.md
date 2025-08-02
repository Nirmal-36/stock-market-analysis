# 📈 Stock Market Analysis System

A comprehensive full-stack web application for analyzing Indian stock market data with real-time price tracking, historical charts, CSV exports, and intelligent stock symbol matching.

## ✨ Features

### 🎯 Core Functionality
- **Real-time Stock Data**: Live price updates for Indian stocks using Yahoo Finance
- **Interactive Charts**: Historical price visualization with Chart.js
- **Smart Search**: Fuzzy matching for stock symbols (handles typos and case variations)
- **CSV Export**: Download historical data in CSV format for any time period
- **Custom Date Ranges**: Analyze data for specific time periods

### 🔧 Technical Features
- **Database Optimization**: Automatic cleanup of duplicate entries
- **Professional UI**: Modern, responsive design
- **RESTful API**: FastAPI backend with comprehensive endpoints
- **Real-time Updates**: Auto-refresh stock data
- **Error Handling**: Comprehensive error management

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - Document database for stock data
- **yfinance** - Yahoo Finance API for stock data
- **Pandas** - Data analysis and manipulation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - Component-based UI framework
- **Chart.js** - Interactive data visualization
- **Axios** - HTTP client for API calls
- **Modern CSS** - Responsive design with professional styling

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Nirmal-36/stock-market-analysis.git
cd stock-market-analysis
```

2. **Backend Setup**
```bash
# Create virtual environment
python3 -m venv myenv
source myenv/bin/activate  # On Windows: myenv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. **Frontend Setup**
```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📚 API Endpoints

### Stock Data
- `GET /api/stock/{symbol}` - Get current stock data
- `GET /api/stock/{symbol}/history` - Get historical data
- `GET /api/stock/{symbol}/export` - Export data as CSV
- `GET /api/stocks/list` - List all available stocks

### Utility
- `GET /api/database/stats` - Database statistics
- `GET /api/health` - Health check

## 🎮 Usage

1. **Search for Stocks**: Type any Indian stock symbol (e.g., RELIANCE, TCS, ICICIBANK)
2. **View Real-time Data**: See current price, volume, and daily changes
3. **Analyze Charts**: Switch between different time periods (7D, 1M, 3M, 6M, 1Y, 2Y, 5Y)
4. **Custom Ranges**: Select specific date ranges for analysis
5. **Export Data**: Download historical data as CSV files

## 📁 Project Structure

```
stock-market-analysis/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic models
│   ├── db.py               # Database connection
│   ├── db_utils.py         # Database utilities
│   ├── fetcher.py          # Data fetching logic
│   ├── stock_utils.py      # Stock symbol utilities
│   └── indian_stocks.py    # Indian stock symbols
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── utils/         # API utilities
│   │   ├── App.js         # Main application
│   │   └── index.js       # Entry point
│   └── public/            # Static files
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```
MONGO_URI=mongodb://localhost:27017/stock_market
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
SERPAPI_KEY=your_serpapi_key
```

### MongoDB Setup
The application creates the following collections:
- `stocks` - OHLC data storage
- `news` - News articles storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Yahoo Finance for stock data
- Chart.js for visualization
- FastAPI for the backend framework
- React team for the frontend framework

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - Document database for stock data
- **yfinance** - Yahoo Finance API for stock data
- **Pandas** - Data analysis and manipulation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - Component-based UI framework
- **Chart.js** - Interactive data visualization
- **Axios** - HTTP client for API calls
- **Modern CSS** - Responsive design with professional styling

## � Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Nirmal-36/stock-market-analysis.git
cd stock-market-analysis
```

2. **Backend Setup**
```bash
# Create virtual environment
python3 -m venv myenv
source myenv/bin/activate  # On Windows: myenv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start MongoDB (if local)
mongod

# Run the backend server
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. **Frontend Setup**
```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📚 API Endpoints

### Stock Data
- `GET /api/stock/{symbol}` - Get current stock data
- `GET /api/stock/{symbol}/history` - Get historical data
- `GET /api/stock/{symbol}/export` - Export data as CSV
- `GET /api/stocks/list` - List all available stocks

### Utility
- `GET /api/database/stats` - Database statistics
- `GET /api/health` - Health check

## 🎮 Usage

1. **Search for Stocks**: Type any Indian stock symbol (e.g., RELIANCE, TCS, ICICIBANK)
2. **View Real-time Data**: See current price, volume, and daily changes
3. **Analyze Charts**: Switch between different time periods (7D, 1M, 3M, 6M, 1Y, 2Y, 5Y)
4. **Custom Ranges**: Select specific date ranges for analysis
5. **Export Data**: Download historical data as CSV files

## 📁 Project Structure

```
stock-market-analysis/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic models
│   ├── db.py               # Database connection
│   ├── db_utils.py         # Database utilities
│   ├── fetcher.py          # Data fetching logic
│   ├── stock_utils.py      # Stock symbol utilities
│   └── indian_stocks.py    # Indian stock symbols
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── utils/         # API utilities
│   │   ├── App.js         # Main application
│   │   └── index.js       # Entry point
│   └── public/            # Static files
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```
MONGO_URI=mongodb://localhost:27017/stock_market
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
SERPAPI_KEY=your_serpapi_key
```

### MongoDB Setup
The application creates the following collections:
- `stocks` - OHLC data storage
- `news` - News articles storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Yahoo Finance for stock data
- Chart.js for visualization
- FastAPI for the backend framework
- React team for the frontend framework
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Database Setup
```bash
# Make sure MongoDB is running
# The application will create collections automatically
```

## 🚀 Running the Application

### Start Backend Server
```bash
# From project root, with virtual environment activated
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Start Frontend Development Server
```bash
# In a new terminal
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📊 API Endpoints

- `GET /stocks` - List all stocks
- `GET /stocks/search?query={symbol}` - Search stocks with fuzzy matching
- `GET /stocks/{symbol}/price` - Get current stock price
- `GET /stocks/{symbol}/history` - Get historical data
- `POST /stocks/cleanup` - Clean duplicate database entries

## 🎨 Color Scheme

The application uses a professional color palette:
- **Primary Blue**: #2C5F7A (Dark blue for headers and primary elements)
- **Secondary Blue**: #5A8AA8 (Medium blue for interactive elements)
- **Accent Beige**: #C8B5A6 (Light beige for cards and backgrounds)
- **Light Gray**: #F5F5F5 (Background and subtle elements)

## 🔧 Configuration

Key configuration options in `.env`:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=stock_market_db
API_UPDATE_INTERVAL=3600  # seconds
```

## 📁 Project Structure

```
stock-market-analysis/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application
│   ├── models.py           # Data models
│   ├── fetcher.py          # Data fetching logic
│   ├── db.py               # Database connection
│   ├── stock_utils.py      # Stock utilities & fuzzy matching
│   └── scheduler.py        # Automated tasks
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main app component
│   └── public/
├── requirements.txt        # Python dependencies
└── .env                   # Environment variables
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Stock data providers
- React and FastAPI communities
- Chart.js for visualization capabilities