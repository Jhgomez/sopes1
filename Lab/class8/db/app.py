import random
import time
import mysql.connector
from datetime import datetime

db_config = {
    'host': 'localhost',
    'user': 'grafana_user',
    'password': 'grafana_password',
    'database': 'grafana_db',
    'port': '3306'
}

def connect_db():
    try:
        connection = mysql.connector.connect(**db_config)
        print("Connection established")
        return connection
    except mysql.connector.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def insert_data(connection):
    try:
        cursor = connection.cursor()

        metrics = ['CPU Usage', 'Memory Usage', 'Disk Usage']

        for metric in metrics:
            value = round(random.uniform(0, 100), 2)

            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            query = "INSERT INTO metrics (metric_name, value, timestamp) VALUES (%s, %s, %s)"
            cursor.execute(query, (metric, value, timestamp))
            print(f"Inserted data: {metric}, {value}, {timestamp}")
        connection.commit()
    except mysql.connector.Error as e:
        print(f"Error inserting data: {e}")

def main():
    connection = connect_db()
    if connection:
        try:
            while True:
                insert_data(connection)
                time.sleep(5)
        except KeyboardInterrupt:
            print("Exiting...")
            connection.close()
        finally:
            connection.close()
            print("Connection closed")

if __name__ == '__main__':
    main()
