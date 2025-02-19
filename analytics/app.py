import mysql.connector
import pymongo
import yaml

with open('app_conf.yml', 'r') as f:
    CONFIG = yaml.safe_load(f.read())

# Database connection
db_connection = mysql.connector.connect(
    host=CONFIG['mysql']['host'],
    user=CONFIG['mysql']['user'],
    password=CONFIG['mysql']['user_password'],
    database=CONFIG['mysql']['database']
)



cursor = db_connection.cursor()

# Example query
cursor.execute(f"SELECT * FROM {CONFIG['mysql']['table']}")
results = cursor.fetchall()

for row in results:
    print(row)

cursor.close()
db_connection.close()


# Find stats min, max, avg from sql 



# send to mongo



# Connect to MongoDB
mongo_client = pymongo.MongoClient(f"mongodb://{CONFIG['mongo']['host']}:{CONFIG['mongo']['port']}/")
mongo_db = mongo_client[CONFIG['mongo']['database']]
mongo_collection = mongo_db[CONFIG['mongo']['collection']]

# Prepare data to insert into MongoDB
# Here, we are inserting the analysis results
mongo_collection.insert_one(data_analysis)

# If you want to insert all the MySQL rows into MongoDB:
mongo_collection.insert_many([{"column1": row[0], "column2": row[1]} for row in results])

# Close MongoDB connection
mongo_client.close()