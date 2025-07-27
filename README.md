# Stock Market Analysis System

A full-stack web application for analyzing Indian stock market data with real-time price tracking, historical charts, and intelligent stock symbol matching.

## 🚀 Features

- **Real-time Stock Data**: Live price updates for Indian stocks
- **Interactive Charts**: Historical price visualization with Chart.js
- **Smart Search**: Fuzzy matching for stock symbols (handles typos and case variations)
- **Database Optimization**: Automatic cleanup of duplicate entries
- **Professional UI**: Modern, responsive design with professional color scheme
- **RESTful API**: FastAPI backend with comprehensive endpoints

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - Document database for stock data
- **Pandas** - Data analysis and manipulation
- **APScheduler** - Automated data fetching
- **Difflib** - Fuzzy string matching for stock symbols

### Frontend
- **React** - Component-based UI framework
- **Chart.js** - Interactive data visualization
- **Modern CSS** - Responsive design with professional styling

## 📦 Installation

### Prerequisites
- Python 3.9+
- Node.js 14+
- MongoDB

### Backend Setup
```bash
# Clone the repository
git clone <https://github.com/Nirmal-36/stock-market-analysis.git>
cd stock-market-analysis

# Create virtual environment
python3 -m venv myenv
source myenv/bin/activate  # On Windows: myenv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
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
