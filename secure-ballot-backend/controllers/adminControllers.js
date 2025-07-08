const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminModel.js');
const Vote = require('../models/voteModel.js');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretadminjwtkey';

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    console.log('Admin login attempt:', { email, password });
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '6h' });

    console.log('Admin login successful:', { email });
    res.json({ success: true, token, message: 'Login successful' });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//Results controller

const getResults = async (req, res) => {
  try {
    const votes = await Vote.find({});
    const results = {};

    for (let vote of votes) {
      const selections = vote.message;
      for (let position in selections) {
        const candidate = selections[position];
        if (!results[position]) results[position] = {};
        results[position][candidate] = (results[position][candidate] || 0) + 1;
      }
    }

    res.json({ results });
  } catch (err) {
    console.error("Error generating results:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { loginAdmin, getResults };
