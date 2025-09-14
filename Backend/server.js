const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5001;
const saltRounds = 10;

// Middleware
app.use(cors()); // allow all origins for now
app.use(express.json()); // parse JSON bodies

// MySQL connection via socket
const connection = mysql.createConnection({
  user: 'root',
  password: '@dityAsingh',
  database: 'civicsync',
  socketPath: '/tmp/mysql.sock'
});

connection.connect(err => {
  if (err) return console.error('❌ MySQL connection failed:', err);
  console.log('✅ MySQL connected via socket!');
});

// Signup route
app.post('/signup', async (req, res) => {
  const { f_name, l_name, email, username, password } = req.body;

  if (!f_name || !l_name || !email || !username || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const checkQuery = 'SELECT * FROM users WHERE email = ? OR name = ? LIMIT 1';
    connection.query(checkQuery, [email, username], async (err, results) => {
      if (err) return res.status(500).json({ msg: 'Database error', error: err });

      if (results.length > 0) {
        return res.status(409).json({ msg: 'User with this email or username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const fullName = `${f_name} ${l_name}`;

      // Insert new user
      const insertQuery = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)';
      connection.query(insertQuery, [email, hashedPassword, fullName], (err, result) => {
        if (err) return res.status(500).json({ msg: 'Database insert error', error: err });

        res.json({ msg: 'Signup successful! You can now log in.' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  connection.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ msg: 'Database error', error: err });

    if (results.length === 0) return res.status(401).json({ msg: 'Invalid credentials' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ msg: 'Invalid credentials' });

    res.json({ msg: 'Login successful', user });
  });
});

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));