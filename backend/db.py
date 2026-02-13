import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="USER_ID",
        password="PASSWORD",
        database="event_planner"
    )
