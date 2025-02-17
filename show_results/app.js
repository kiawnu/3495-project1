const express = require("express");
require('dotenv').config();
const bodyParser = require("body-parser");

const app = express();
const PORT = 3100;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));


// const db = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   port: 3306,
// });


// // Connect to MySQL
// function connectWithRetry() {
//   db.connect((err) => {
//     if (err) {
//       console.error('Error connecting to MySQL:', err.message);
//       console.log('Retrying in 5 seconds...');
//       setTimeout(connectWithRetry, 5000);
//     } else {
//       console.log('Connected to MySQL as ID', db.threadId);
//     }
//   });
// }

// connectWithRetry();



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

  const today = new Date();
  const [hours, minutes] = time.split(":");
  today.setHours(hours, minutes, 0, 0);

  const arrivalDateTime = today.toISOString().slice(0, 19).replace('T', ' ');

  const sql = `
    INSERT INTO trains (train_type, train_line, arrival_time, passengers_onb)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [trainType, trainLine, arrivalDateTime, passengers], (err, results) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.send("An error occurred while inserting data.");
    }

  res.send(`
    <h2>Train Data Updated</h2>
    <p><strong>Train Type:</strong> ${trainType}</p>
    <p><strong>Train Line:</strong> ${trainLine}</p>
    <p><strong>Time:</strong> ${time}</p>
    <p><strong>Number of Passengers:</strong> ${passengers}</p>
    <a href="/">Go Back</a>nd module '/app/server.js'" means that Docker can't
  `);
});

});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
