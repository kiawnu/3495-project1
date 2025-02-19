# TODO:
# 1. connect to mongodb and dump the stats
#
# 2. Set it up to run on some frequency
#   -> reference tims lab?

import mysql.connector

from pymongo import MongoClient
import yaml
import time

with open("app_conf.yml", "r") as f:
    CONFIG = yaml.safe_load(f.read())

MONGO_URI = CONFIG["mongo"]["uri"]
DB_NAME = CONFIG["mongo"]["database"]


# time.sleep(5)
def establish_sql_connection():
    return mysql.connector.connect(
        host="mysql",
        user=CONFIG["mysql"]["user"],
        password=CONFIG["mysql"]["user_password"],
        database=CONFIG["mysql"]["database"],
        port=CONFIG["mysql"]["port"],
    )


def connect_with_retry():
    global client, db
    while True:
        try:
            client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            client.admin.command("ping")  # Ping the MongoDB server
            db = client[DB_NAME]
            print("Connected to MongoDB")
            break
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}. Retrying in 5 seconds...")
            time.sleep(5)


connect_with_retry()


def get_stats(db_session):
    cursor = db_session.cursor()
    stats = {}

    # Average passenger count
    cursor.execute(f"""
                    select round(avg(passengers_onb), 0) from {CONFIG["mysql"]["database"]}.{CONFIG["mysql"]["table"]["name"]}
                """)
    results = cursor.fetchall()
    if results:
        print(f"Average passengers on board: {results[0][0]}")
        stats["avg_passengers"] = str(results[0][0])

    # Peak Traffic time - this is busiest hour
    cursor.execute(f"""
                    select hour(arrival_time) as hour, count(*) as total from {CONFIG["mysql"]["database"]}.{CONFIG["mysql"]["table"]["name"]}
                    group by hour(arrival_time)
                    order by total desc
                    limit 1;
                """)
    results = cursor.fetchall()
    if results:
        print(f"Peak traffic time: {results[0][0]} o'clock")
        stats["peak_traffic_time"] = results[0][0]

    # Most popular line
    cursor.execute(f"""
                    select train_line, count(*) as total from {CONFIG["mysql"]["database"]}.{CONFIG["mysql"]["table"]["name"]}
                    group by train_line
                    order by total desc
                    limit 1;
                """)
    results = cursor.fetchall()
    if results:
        print(f"Most popular line: {results[0][0]}")
        stats["most_popular_line"] = results[0][0]

    # num cargo trains
    # num passenger trains
    cursor.execute(f"""
                    select train_type, count(*) from {CONFIG["mysql"]["database"]}.{CONFIG["mysql"]["table"]["name"]}
                    group by train_type;
                """)
    results = cursor.fetchall()
    if results:
        for row in results:
            if row[0] == "passenger":
                print(f"Num passenger trains: {row[1]}")
                stats["num_passenger_trains"] = row[1]
            elif row[0] == "cargo":
                print(f"Num cargo trains: {row[1]}")
                stats["num_cargo_trains"] = row[1]

    cursor.close()
    db_session.close()

    return stats


def send_to_mongo(stats):
    print(stats)

    # # Connect to MongoDB
    # mongo_client = pymongo.MongoClient(f"mongodb://{CONFIG['mongo']['host']}:{CONFIG['mongo']['port']}/")
    # mongo_db = mongo_client[CONFIG['mongo']['database']]
    # mongo_collection = mongo_db[CONFIG['mongo']['collection']]

    # # Prepare data to insert into MongoDB
    # # Here, we are inserting the analysis results
    # mongo_collection.insert_one(data_analysis)

    # # If you want to insert all the MySQL rows into MongoDB:
    # mongo_collection.insert_many([{"column1": row[0], "column2": row[1]} for row in results])

    # # Close MongoDB connection
    # mongo_client.close()


def main():
    # some kind of loop that keeps running
    # lowkey an infitie while loop would work i think
    stats = get_stats(establish_sql_connection())
    send_to_mongo(stats)


if __name__ == "__main__":
    main()
