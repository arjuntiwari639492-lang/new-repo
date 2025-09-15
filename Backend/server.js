const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5001;
const saltRounds = 10;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const connection = mysql.createConnection({
  user: 'root',
  password: '@dityAsingh',
  database: 'civicsync',
  socketPath: '/tmp/mysql.sock'
});

connection.connect(err => {
  if (err) return console.error('❌ MySQL connection failed:', err);
  console.log('✅ MySQL connected via socket!');

  // Helper function to add a column only if it doesn't exist
  const addColumnIfNotExists = (tableName, columnName, columnDefinition) => {
    const checkColumnQuery = `
      SELECT * FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'civicsync' AND TABLE_NAME = ? AND COLUMN_NAME = ?
    `;
    connection.query(checkColumnQuery, [tableName, columnName], (err, results) => {
      if (err) {
        console.error(`Error checking for column ${columnName}:`, err);
        return;
      }
      if (results.length === 0) {
        const addColumnQuery = `ALTER TABLE ?? ADD COLUMN ?? ${columnDefinition}`;
        connection.query(addColumnQuery, [tableName, columnName], (addErr) => {
          if (addErr) {
            console.error(`Error adding column ${columnName}:`, addErr);
          } else {
            console.log(`Column ${columnName} added to ${tableName} table.`);
          }
        });
      }
    });
  };

  // Update reports table safely
  addColumnIfNotExists('reports', 'latitude', 'DECIMAL(10, 8)');
  addColumnIfNotExists('reports', 'longitude', 'DECIMAL(11, 8)');
  addColumnIfNotExists('reports', 'map_url', 'VARCHAR(2048)');

});

// Create reports table if it doesn't exist
const createReportsTable = `
  CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    status VARCHAR(255) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;
connection.query(createReportsTable, (err, results) => {
  if (err) {
    console.error('Error creating reports table:', err);
    return;
  }
  console.log('Reports table is ready.');
});


// Signup route
app.post('/signup', async (req, res) => {
  const { f_name, l_name, email, username, password } = req.body;

  if (!f_name || !l_name || !email || !username || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const checkQuery = 'SELECT * FROM users WHERE email = ? OR name = ? LIMIT 1';
    connection.query(checkQuery, [email, username], async (err, results) => {
      if (err) return res.status(500).json({ msg: 'Database error', error: err });

      if (results.length > 0) {
        return res.status(409).json({ msg: 'User with this email or username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const fullName = `${f_name} ${l_name}`;

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


// --- Report Routes ---

// Create a new report
app.post('/api/reports', (req, res) => {
  const { category, name, phone, location, description, latitude, longitude, map_url } = req.body;

  if (!category || !name || !phone || !location || !description) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  const insertQuery = 'INSERT INTO reports (category, name, phone, location, description, latitude, longitude, map_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(insertQuery, [category, name, phone, location, description, latitude, longitude, map_url], (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database insert error', error: err });
    res.status(201).json({ msg: 'Report submitted successfully!', reportId: result.insertId });
  });
});

// Get reports with filtering
app.get('/api/reports', (req, res) => {
  let query = 'SELECT * FROM reports';
  const params = [];
  const conditions = [];

  const { category, status, startDate, endDate } = req.query;

  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }
  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  if (startDate) {
    conditions.push('created_at >= ?');
    params.push(startDate);
  }
  if (endDate) {
    conditions.push('created_at <= ?');
    params.push(endDate);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  connection.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ msg: 'Database error', error: err });
    res.json(results);
  });
});


// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));