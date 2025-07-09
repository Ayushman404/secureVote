const express = require('express');


const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

require('dotenv').config();

const authRouter = express.Router();

const googleVoterModel = require('../models/googleVoterModel.js');

const limiter = require('../middlewares/rateLimiter.js');



authRouter.post('/me', async (req, res) => {
  const { email } = req.body;
  console.log('email received:', email);
  if (!email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {

    const user = await googleVoterModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ name: user.name, email: user.email, picture: user.picture, publicKey: user.publicKey, message: 'User fetched successfully' });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})


//Google Auth
authRouter.post('/google', limiter, async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    // Check if user already exists
    let user = await googleVoterModel.findOne({ email });

    if (!user) {
      // Create user if not found
      user = new googleVoterModel({ name, email, picture });
      await user.save();
    } else {
      console.log('Existing user found:', user);
    }

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        picture: user.picture,
        publicKey: user.publicKey,
      }
    });

  } catch (error) {
    console.error('Google token verification failed:', error.message);
    res.status(401).json({ success: false, message: 'Invalid Google token' });
  }
});

authRouter.post('/setPublicKey', async (req, res) => {
  const { email, publicKey } = req.body;

  // 🔍 Basic input validation
  if (!email || !publicKey) {
    return res.status(400).json({ message: 'Email and publicKey are required.' });
  }

  try {
    // 🔎 Find the user
    const user = await googleVoterModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 🚫 Prevent overwriting if publicKey already exists
    if (user.publicKey) {
      return res.status(400).json({ message: 'Public key already exists for this user.' });
    }

    // ✅ Set and save the public key
    user.publicKey = publicKey;
    await user.save();

    return res.status(200).json({ success: true, message: 'Public key set successfully.' });

  } catch (err) {
    console.error('Error in setPublicKey:', err.message);
    return res.status(500).json({ message: 'Server error while setting public key.' });
  }
});

module.exports = authRouter;

