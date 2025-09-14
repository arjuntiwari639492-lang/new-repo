const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');

// @route   POST api/reports
// @desc    Create a new civic issue report
router.post('/', auth, async (req, res) => {
  const { title, category, description, location } = req.body;

  try {
    const newReport = new Report({
      user: req.user.id,
      title,
      category,
      description,
      location,
    });

    const report = await newReport.save();
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/reports
// @desc    Get all reports submitted by the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
