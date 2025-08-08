from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi
load_dotenv()

MONGO_URI = os.environ.get("MONGO_URI")
# Use certifi CA bundle and explicit TLS to avoid macOS LibreSSL handshake issues
client = MongoClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=20000,
    socketTimeoutMS=20000,
)
db = client["stock_dashboard"]
stocks_collection = db["stocks"]
news_collection = db["news"]