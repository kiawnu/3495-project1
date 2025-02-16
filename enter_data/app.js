const express = require("express");
const mysql = require('mysql2');
require('dotenv').config();
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + db.threadId);
});


// Serve a simple form
app.get("/", (req, res) => {
  res.send(`
    <h2>Train Data</h2>
    <form action="/submit" method="POST">
      <label for="trainType">Train Type:</label>
      <input type="text" id="trainType" name="trainType" required><br><br>

      <label for="trainLine">Train Line:</label>
      <input type="text" id="trainLine" name="trainLine" required><br><br>

      <label for="time">Time:</label>
      <input type="time" id="time" name="time" required><br><br>

      <label for="passengers">Number of Passengers:</label>
      <input type="number" id="passengers" name="passengers" required><br><br>

      <button type="submit">Submit</button>
    </form>
  `);
});

// Handle form submission
app.post("/submit", (req, res) => {
  const { trainType, trainLine, time, passengers } = req.body;
  res.send(`
    <h2>Train Data Updated</h2>
    <p><strong>Train Type:</strong> ${trainType}</p>
    <p><strong>Train Line:</strong> ${trainLine}</p>
    <p><strong>Time:</strong> ${time}</p>
    <p><strong>Number of Passengers:</strong> ${passengers}</p>
    <a href="/">Go Back</a>nd module '/app/server.js'" means that Docker can't
  `);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
