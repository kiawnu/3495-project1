const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = 3300;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "transport_stats";

let db;

// Connect to MongoDB with retry logic
async function connectWithRetry() {
  try {
    const client = new MongoClient(MONGO_URI,{ useNewUrlParser: true });
    await client.connect();
    db = client.db(DB_NAME);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    console.log("Retrying in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();

// Serve the stats in a simple table
app.get("/", async (req, res) => {
  try {
    const stats = await db.collection("train_stats").find().sort({_id: -1}).limit(1).toArray();
    if (!stats) {
      return res.send("No statistics available");
    }
    const recentStats = stats[0]
    res.send(`
      <h2>Train Statistics</h2>
      <table border="1" cellpadding="5">
        <tr><th>Passenger Count Avg</th><td>${recentStats.passenger_count_avg}</td></tr>
        <tr><th>Peak Traffic Time</th><td>${recentStats.peak_traffic_time}</td></tr>
        <tr><th>Most Used Line</th><td>${recentStats.most_used_line}</td></tr>
        <tr><th>Number of Cargo Trains</th><td>${recentStats.num_cargo_trains}</td></tr>
        <tr><th>Number of Passenger Trains</th><td>${recentStats.num_passenger_trains}</td></tr>
      </table>
    `);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.send("An error occurred while fetching data.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
