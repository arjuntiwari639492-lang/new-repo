const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// MySQL connection via socket
const connection = mysql.createConnection({
  user: 'root',
  password: '@dityAsingh',
  database: 'civicsync',
  socketPath: '/tmp/mysql.sock'
});

// @route   GET api/reports
// @desc    Get all reports with optional filtering
router.get('/', async (req, res) => {
  try {
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

    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    connection.query(query, params, (err, results) => {
      if (err) return res.status(500).json({ msg: 'Database error', error: err });
      res.json(results);
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/reports
// @desc    Create a new civic issue report
router.post('/', async (req, res) => {
  const { category, name, phone, location, description } = req.body;

  if (!category || !name || !phone || !location || !description) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const insertQuery = 'INSERT INTO reports (category, name, phone, location, description) VALUES (?, ?, ?, ?, ?)';
    connection.query(insertQuery, [category, name, phone, location, description], (err, result) => {
      if (err) return res.status(500).json({ msg: 'Database insert error', error: err });

      res.status(201).json({ msg: 'Report submitted successfully!', reportId: result.insertId });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;