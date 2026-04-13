console.log("RUNNING FILE:", __filename);

const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const app = express();
const PORT = 3000;
// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost:3306",
    user: "root",
    password: "2711",
    database: "league_standard"
});
console.log("Attempting MySQL connection...");

db.connect(err => {
    if (err) {
        console.error("MySQL connection error:", err);
        return;
    }
    console.log("Connected to MySQL (league_standard)");
});
// Test route
app.get("/api/test", (req, res) => {
    res.json({ message: "League Standard backend is running!" });
});
// Serve homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


