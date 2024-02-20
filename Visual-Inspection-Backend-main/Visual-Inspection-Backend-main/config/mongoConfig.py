from pymongo import MongoClient
from dotenv import load_dotenv
from os import getenv
import os
load_dotenv()
env = os.getenv("env")

def getMongoConnection(dbName, collectionName):
    mongoURL = getenv('mongoURL')
    print(mongoURL)
    conn = MongoClient(mongoURL)
    db = conn[dbName]
    collection = db[collectionName]
    return conn, collection