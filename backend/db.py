from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()

MONGO_URI = os.environ.get("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["stock_dashboard"]
stocks_collection = db["stocks"]
news_collection = db["news"]