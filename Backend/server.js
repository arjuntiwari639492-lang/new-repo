const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5001;
const saltRounds = 10;

// --- MULTER CONFIGURATION ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function(req, file, cb){
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
      return cb(null, true);
    } else {
      cb('Error: Only images and videos are allowed!');
    }
  }
}).array('reportImages', 5);

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// --- MYSQL CONNECTION ---
const connection = mysql.createConnection({
  user: 'root',
  password: '@dityAsingh',
  database: 'civicsync',
  socketPath: '/tmp/mysql.sock'
});

connection.connect(err => {
  if (err) return console.error('❌ MySQL connection failed:', err);
  console.log('✅ MySQL connected via socket!');

  const addColumnIfNotExists = (tableName, columnName, columnDefinition) => {
    const checkColumnQuery = `
      SELECT * FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'civicsync' AND TABLE_NAME = ? AND COLUMN_NAME = ?
    `;
    connection.query(checkColumnQuery, [tableName, columnName], (err, results) => {
      if (err) return;
      if (results.length === 0) {
        const addColumnQuery = `ALTER TABLE ?? ADD COLUMN ?? ${columnDefinition}`;
        connection.query(addColumnQuery, [tableName, columnName]);
      }
    });
  };

  addColumnIfNotExists('reports', 'latitude', 'DECIMAL(10, 8)');
  addColumnIfNotExists('reports', 'longitude', 'DECIMAL(11, 8)');
  addColumnIfNotExists('reports', 'map_url', 'VARCHAR(2048)');
  addColumnIfNotExists('reports', 'image_url', 'VARCHAR(1024)');
});

// --- DATABASE TABLE SETUP ---
const createReportsTable = `
  CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    status VARCHAR(255) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    map_url VARCHAR(2048),
    image_url VARCHAR(1024)
  )
`;
connection.query(createReportsTable, (err) => {
    if (err) console.error("Error creating reports table:", err);
    else console.log("Reports table is ready.");
});

const createCommentsTable = `
  CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
  )
`;
connection.query(createCommentsTable, (err) => {
  if (err) console.error("Error creating comments table:", err);
  else console.log("Comments table is ready.");
});


// --- AUTH ROUTES ---
app.post('/signup', async (req, res) => {
  const { f_name, l_name, email, username, password } = req.body;
  if (!f_name || !l_name || !email || !username || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }
  try {
    const checkQuery = 'SELECT * FROM users WHERE email = ? OR name = ? LIMIT 1';
    connection.query(checkQuery, [email, username], async (err, results) => {
      if (err) return res.status(500).json({ msg: 'Database error', error: err });
      if (results.length > 0) return res.status(409).json({ msg: 'User with this email or username already exists' });
      
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

// --- REPORT ROUTES ---
app.post('/api/reports', (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ msg: err });
    const { category, name, phone, location, description, latitude, longitude, map_url } = req.body;
    const imageUrl = req.files && req.files.length > 0 ? req.files.map(file => `uploads/${file.filename}`).join(',') : null;
    if (!category || !name || !phone || !location || !description) {
      return res.status(400).json({ msg: 'All required fields were not provided.' });
    }
    const insertQuery = 'INSERT INTO reports (category, name, phone, location, description, latitude, longitude, map_url, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(insertQuery, [category, name, phone, location, description, latitude, longitude, map_url, imageUrl], (err, result) => {
      if (err) return res.status(500).json({ msg: 'Database insert error', error: err });
      res.status(201).json({ msg: 'Report submitted successfully!', reportId: result.insertId });
    });
  });
});

app.get('/api/reports', (req, res) => {
  let query = 'SELECT * FROM reports';
  const params = [];
  const conditions = [];
  const { category, status, startDate, endDate } = req.query;
  if (category) { conditions.push('category = ?'); params.push(category); }
  if (status) { conditions.push('status = ?'); params.push(status); }
  if (startDate) { conditions.push('created_at >= ?'); params.push(startDate); }
  if (endDate) { conditions.push('created_at <= ?'); params.push(endDate); }
  if (conditions.length > 0) { query += ' WHERE ' + conditions.join(' AND '); }
  query += ' ORDER BY created_at DESC';
  connection.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ msg: 'Database error', error: err });
    res.json(results);
  });
});

// --- ROUTES FOR SINGLE REPORT & COMMENTS ---
app.get('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM reports WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ msg: 'Database error', error: err });
    if (results.length === 0) return res.status(404).json({ msg: 'Report not found' });
    res.json(results[0]);
  });
});

app.get('/api/reports/:id/comments', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM comments WHERE report_id = ? ORDER BY created_at DESC';
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ msg: 'Database error' });
    res.json(results);
  });
});

app.post('/api/reports/:id/comments', (req, res) => {
  const { id } = req.params;
  const { userName, commentText } = req.body;
  if (!userName || !commentText) {
    return res.status(400).json({ msg: 'Username and comment text are required' });
  }
  const query = 'INSERT INTO comments (report_id, user_name, comment_text) VALUES (?, ?, ?)';
  connection.query(query, [id, userName, commentText], (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database error' });
    res.status(201).json({ msg: 'Comment added successfully' });
  });
});

// --- START SERVER ---
app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));