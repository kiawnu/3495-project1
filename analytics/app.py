import mysql.connector
from apscheduler.schedulers.background import BackgroundScheduler
from pymongo import MongoClient
from flask import Flask
import yaml
import time
import logging.config

with open("app_conf.yml", "r") as f:
    CONFIG = yaml.safe_load(f.read())

with open("log_conf.yml", "r") as f:
    LOG_CONFIG = yaml.safe_load(f.read())
    logging.config.dictConfig(LOG_CONFIG)

logger = logging.getLogger("basicLogger")

app = Flask(__name__)


@app.route("/")
def placeholder():
    return "<p>Placeholder</p>"


def establish_sql_connection():
    return mysql.connector.connect(
        host="mysql",
        user=CONFIG["mysql"]["user"],
        password=CONFIG["mysql"]["user_password"],
        database=CONFIG["mysql"]["database"],
        port=CONFIG["mysql"]["port"],
    )


def connect_with_retry():
    global mongo_client, mongo_db
    while True:
        try:
            mongo_client = MongoClient(
                CONFIG["mongo"]["uri"], serverSelectionTimeoutMS=5000
            )
            mongo_client.admin.command("ping")  # Ping the MongoDB server
            mongo_db = mongo_client[CONFIG["mongo"]["database"]]
            print("Connected to MongoDB")
            break
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}. Retrying in 5 seconds...")
            time.sleep(5)


def get_stats(db_session):
    logger.info("Connected to mysql")
    cursor = db_session.cursor()
    stats = {
        "passenger_count_avg": 0,
        "peak_traffic_time": "",
        "most_used_line": "",
        "num_cargo_trains": 0,
        "num_passenger_trains": 0,
    }

    # Average passenger count
    cursor.execute(f"""
                    select round(avg(passengers_onb), 0) from {CONFIG["mysql"]["database"]}.{CONFIG["mysql"]["table"]["name"]}
                """)
    results = cursor.fetchall()
    logger.debug(f"avg pass results: {results}")
    if results:
        print(f"Average passengers on board: {results[0][0]}")
        stats["passenger_count_avg"] = int(results[0][0])

    # Peak Traffic time - this is busiest hour
    cursor.execute(f"""
                    select hour(arrival_time) as hour, count(*) as total from {CONFIG["mysql"]["database"]}.{CONFIG["mysql"]["table"]["name"]}
                    group by hour(arrival_time)
                    order by total desc
                    limit 1;
                """)
    results = cursor.fetchall()
    logger.debug(f"peak traffic results: {results}")
    if results:
        print(f"Peak traffic time: {results[0][0]} o'clock")
        stats["peak_traffic_time"] = str(results[0][0])

    # Most popular line
    cursor.execute(f"""
                    select train_line, count(*) as total from {CONFIG["mysql"]["database"]}.{CONFIG["mysql"]["table"]["name"]}
                    group by train_line
                    order by total desc
                    limit 1;
                """)
    results = cursor.fetchall()
    logger.debug(f"most pop line results: {results}")
    if results:
        print(f"Most used line: {results[0][0]}")
        stats["most_used_line"] = results[0][0]

    # num cargo trains
    # num passenger trains
    cursor.execute(f"""
                    select train_type, count(*) from {CONFIG["mysql"]["database"]}.{CONFIG["mysql"]["table"]["name"]}
                    group by train_type;
                """)
    results = cursor.fetchall()
    logger.debug(f"train type results: {results}")
    if results:
        for row in results:
            if row[0] == "passenger":
                print(f"Num passenger trains: {row[1]}")
                stats["num_passenger_trains"] = int(row[1])
            elif row[0] == "cargo":
                print(f"Num cargo trains: {row[1]}")
                stats["num_cargo_trains"] = int(row[1])

    cursor.close()
    db_session.close()

    return stats


def send_to_mongo(stats):
    connect_with_retry()

    collection = mongo_db[CONFIG["mongo"]["collection"]]
    collection.insert_one(stats)
    mongo_client.close()


def main():
    # some kind of loop that keeps running
    # lowkey an infitie while loop would work i think
    stats = get_stats(establish_sql_connection())
    send_to_mongo(stats)


def init_scheduler():
    sched = BackgroundScheduler(daemon=True)
    sched.add_job(main, "interval", seconds=CONFIG["scheduler"]["interval"])
    sched.start()


if __name__ == "__main__":
    init_scheduler()
    app.run(debug=True)
