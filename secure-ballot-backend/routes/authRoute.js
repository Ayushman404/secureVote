const express = require('express');
const {addUser} = require('../controllers/authController.js');
const validateRegister = require('../middlewares/validateRegister.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authRouter = express.Router();
const {register, login} = require('../controllers/authController.js');
const voterModel = require('../models/voterModel.js');
const limiter = require('../middlewares/rateLimiter.js');

authRouter.post('/register', limiter, validateRegister, addUser);


//checking for existing user
authRouter.post("/check", limiter, async (req, res) => {
  const { email } = req.body;
  const user = await voterModel.findOne({ email });
  return res.json({ alreadyRegistered: !!user });
});

authRouter.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token received:', token);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    console.log('Decoded token:', decoded);
    //get the user from the database but not their password
    if (!decoded || !decoded.email) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const user = await voterModel.findOne({ email: decoded.email }, 'name email publicKey');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ name: user.name, email: user.email, publicKey: user.publicKey, message: 'User fetched successfully' });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

module.exports = authRouter;

