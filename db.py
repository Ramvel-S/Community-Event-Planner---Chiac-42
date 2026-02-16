import mysql.connector
from config import DB_CONFIG

def get_db():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except mysql.connector.Error as err:
        print(f"Error connecting to Databse :{err}")
        return None
    


