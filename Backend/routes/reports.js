const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- DATABASE CONNECTION ---
const connection = mysql.createConnection({
  user: 'root',
  password: '@dityAsingh',
  database: 'civicsync',
  socketPath: '/tmp/mysql.sock'
});

// --- MULTER CONFIGURATION ---
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, 'reportImages-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Only images and videos are allowed!');
    }
  }
}).array('reportImages', 5);

// @route   GET /api/reports
// @desc    Get all reports with filtering
router.get('/', (req, res) => {
  let query = 'SELECT * FROM reports ORDER BY created_at DESC';
  // Note: Filtering logic can be added back here if needed
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ msg: 'Database error', error: err });
    res.json(results);
  });
});

// @route   POST /api/reports
// @desc    Create a new report with multiple images
router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }

    const { category, name, phone, location, description, latitude, longitude, map_url } = req.body;
    
    const imageUrl = req.files && req.files.length > 0 
      ? req.files.map(file => `uploads/${file.filename}`).join(',') // Use relative path
      : null;

    if (!category || !name || !phone || !location || !description) {
      return res.status(400).json({ msg: 'All required fields were not provided.' });
    }

    const insertQuery = 'INSERT INTO reports (category, name, phone, location, description, latitude, longitude, map_url, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    connection.query(insertQuery, [category, name, phone, location, description, latitude, longitude, map_url, imageUrl], (err, result) => {
      if (err) {
        console.error("Database insert error:", err);
        return res.status(500).json({ msg: 'Database insert error', error: err });
      }
      res.status(201).json({ msg: 'Report submitted successfully!', reportId: result.insertId });
    });
  });
});

// --- ADDED FOR DETAIL & COMMENT FEATURES ---

// @route   GET /api/reports/:id
// @desc    Get a single report by its ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM reports WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ msg: 'Database error', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ msg: 'Report not found' });
    }
    res.json(results[0]);
  });
});

// @route   GET /api/reports/:id/comments
// @desc    Get all comments for a specific report
router.get('/:id/comments', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM comments WHERE report_id = ? ORDER BY created_at DESC';
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ msg: 'Database error' });
    res.json(results);
  });
});

// @route   POST /api/reports/:id/comments
// @desc    Add a new comment to a report
router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const { userName, commentText } = req.body;

  if (!userName || !commentText) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  const query = 'INSERT INTO comments (report_id, user_name, comment_text) VALUES (?, ?, ?)';
  connection.query(query, [id, userName, commentText], (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database error' });
    res.status(201).json({ msg: 'Comment added successfully' });
  });
});

module.exports = router;