const mysql = require('mysql2');

// Create a connection for Windows (no socketPath, use host + port)
const connection = mysql.createConnection({
  host: 'localhost',        // MySQL server host
  port: 5001,               // default MySQL port
  user: 'root',             // your MySQL username
  password: 'Arjun@10112004', // replace with your MySQL root password
  database: 'civicsync'     // replace with your DB name
});

// Connect
connection.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
  } else {
    console.log('✅ MySQL connected on Windows!');
  }
});

// Example: test query
connection.query('SELECT NOW() AS currentTime', (err, results) => {
  if (err) throw err;
  console.log('Current time from MySQL:', results[0].currentTime);
  connection.end();
});
