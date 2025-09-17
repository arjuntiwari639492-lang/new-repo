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
const audioDir = path.join(uploadsDir, 'audio');
const imagesDir = path.join(uploadsDir, 'images');

// Ensure upload directories exist
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir);
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'reportImages') {
            cb(null, imagesDir);
        } else if (file.fieldname === 'voice_note') {
            cb(null, audioDir);
        } else {
            cb(new Error('Invalid fieldname'), null);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 20000000 },
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'reportImages') {
            const imageTypes = /jpeg|jpg|png|gif/;
            const extname = imageTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = imageTypes.test(file.mimetype);
            if (mimetype && extname) {
                return cb(null, true);
            } else {
                return cb(new Error('Only image files are allowed!'));
            }
        } else if (file.fieldname === 'voice_note') {
            const audioTypes = /webm|mp3|wav|ogg|mpeg/;
            const extname = audioTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = audioTypes.test(file.mimetype);
            if (mimetype && extname) {
                return cb(null, true);
            } else {
                return cb(new Error('Only audio files are allowed!'));
            }
        }
        cb(new Error('Invalid file type!'));
    }
}).fields([
    { name: 'reportImages', maxCount: 5 },
    { name: 'voice_note', maxCount: 1 }
]);

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// --- MYSQL CONNECTION ---
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Arjun@10112004',
    database: 'civicsync'
});

connection.connect(err => {
    if (err) return console.error('❌ MySQL connection failed:', err);
    console.log('✅ MySQL connected!');
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

// --- UPDATED REPORT ROUTES ---
app.post('/api/reports', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error("Multer upload error:", err);
            return res.status(400).json({ msg: 'File upload failed: ' + err.message });
        }
        const { category, name, phone, location, description, latitude, longitude, map_url, details } = req.body;
        if (!category || !name || !phone || !location || !description) {
            if (req.files) {
                if (req.files.reportImages) req.files.reportImages.forEach(file => fs.unlinkSync(file.path));
                if (req.files.voice_note) fs.unlinkSync(req.files.voice_note[0].path);
            }
            return res.status(400).json({ msg: 'All required text fields were not provided.' });
        }
        const imageFiles = req.files['reportImages'] || [];
        const voiceNoteFile = req.files['voice_note'] ? req.files.voice_note[0] : null;
        const imageUrls = imageFiles.map(file => `/uploads/images/${file.filename}`);
        const voiceNoteUrl = voiceNoteFile ? `/uploads/audio/${voiceNoteFile.filename}` : null;
        
        const insertQuery = `INSERT INTO reports (
            category, name, phone, location, description, latitude, longitude, map_url, details, image_urls, voice_note_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        connection.query(insertQuery, [
            category,
            name,
            phone,
            location,
            description,
            latitude,
            longitude,
            map_url,
            details,
            JSON.stringify(imageUrls),
            voiceNoteUrl
        ], (err, result) => {
            if (err) {
                console.error('Database insert error:', err);
                return res.status(500).json({ msg: 'Database insert error', error: err.sqlMessage || err });
            }
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
    const query = 'SELECT *, image_urls, voice_note_url FROM reports WHERE id = ?';
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