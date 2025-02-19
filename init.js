
db = db.getSiblingDB('admin');

db.createUser({
  user: "root",
  pwd: "password123",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase"]
});

db = db.getSiblingDB('transport_stats'); // Create or switch to database
db.createCollection('train_stats'); // Just creates the collection without data

db.train_stats.insertOne({
    date: new Date(), // Current date
    passenger_count_avg: 25000,
    peak_traffic_time: "18:00",
    most_used_line: "Red Line",
    num_cargo_trains: 120,
    num_passenger_trains: 450
});

db = db.getSiblingDB('admin');

db.createUser({
  user: "dev1",
  pwd: "dev123",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }, {role:"dbOwner", db:"transport_stats"}]
});

print("train_stats collection created successfully!");
