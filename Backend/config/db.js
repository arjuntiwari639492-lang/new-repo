const mysql = require('mysql2');

// Create a connection using the socket
const connection = mysql.createConnection({
  user: 'root',
  password: '@dityAsingh',   // replace with your MySQL root password
  database: 'civicsync',   // replace with your DB name
  socketPath: '/tmp/mysql.sock' // important on macOS
});

// Connect
connection.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
  } else {
    console.log('✅ MySQL connected via socket!');
  }
});

// Example: test query
connection.query('SELECT NOW() AS currentTime', (err, results) => {
  if (err) throw err;
  console.log('Current time from MySQL:', results[0].currentTime);
  connection.end();
});