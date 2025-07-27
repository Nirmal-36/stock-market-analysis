# Stock Market Analysis Project - Clean Structure

## 📁 KEEP - Core Backend Files (Production Ready)

### `/backend/` - Main Application
- ✅ `main.py` - FastAPI application (CURRENT WORKING VERSION)
- ✅ `models.py` - Pydantic data models  
- ✅ `fetcher.py` - Data fetching from APIs
- ✅ `db.py` - MongoDB database connection
- ✅ `scheduler.py` - Daily batch updates
- ✅ `indian_stocks.py` - Stock symbols list

### Root Files
- ✅ `.env` - Environment variables (if exists)
- ✅ `requirements.txt` - Python dependencies (if exists)

## 📁 DELETE - Test and Temporary Files

### Test Files (Not needed for production)
- ❌ `test_db.py`
- ❌ `test_fetcher.py` 
- ❌ `test_scheduler.py`
- ❌ `test_api.py`
- ❌ `test_two_tier_system.py`
- ❌ `test_scheduler_demo.py`
- ❌ `quick_scheduler_test.py`

### Population Scripts (One-time use)
- ❌ `populate_database.py`
- ❌ `populate_all_stocks.py`
- ❌ `smart_populate.py`

### Utility Scripts (One-time use)
- ❌ `check_database.py`

### Duplicate Files
- ❌ `main_enhanced.py` (We're using main.py)

## 📁 KEEP - Environment
- ✅ `myenv/` - Python virtual environment

## 📁 ADD - Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── StockSearch.js/tsx
│   │   ├── StockCard.js/tsx
│   │   ├── StockChart.js/tsx
│   │   └── NewsList.js/tsx
│   ├── pages/
│   │   ├── Home.js/tsx
│   │   └── StockDetail.js/tsx
│   ├── utils/
│   │   └── api.js/tsx
│   └── App.js/tsx
├── public/
├── package.json
└── README.md
```
