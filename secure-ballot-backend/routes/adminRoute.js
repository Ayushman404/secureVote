const express = require('express');
const { verifyAdmin } = require('../middlewares/adminAuth.js');
const { loginAdmin }  = require('../controllers/adminControllers.js');
const VotingStatus = require('../models/elecStateModel.js'); 
const { getResults } = require('../controllers/adminControllers.js');
const validateAdminLogin = require("../middlewares/validateAdminLogin.js");
const limiter = require('../middlewares/rateLimiter.js');

const adminRouter = express.Router();
// const { toggleRegistration, toggleVoting } = require('../controllers/adminController.js');

adminRouter.post('/login', limiter, validateAdminLogin, loginAdmin);

adminRouter.post("/toggle-registration", verifyAdmin, async (req, res) => {
  const { status } = req.body; // true or false
  let current = await VotingStatus.findOne() || new VotingStatus();
  current.isRegistrationOpen = !status;
  await current.save();
  res.json({ success: true });
});

adminRouter.post("/toggle-voting", verifyAdmin, async (req, res) => {
  const { status } = req.body;
  let current = await VotingStatus.findOne() || new VotingStatus();
  current.isVotingOpen = !status;
  await current.save();
  res.json({ success: true });
});

adminRouter.get('/status', limiter, async (req, res) => {
    try {
        const status = await VotingStatus.findOne();
        res.json(status);
    } catch (error) {
        console.error('Error fetching voting status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

adminRouter.get('/results', verifyAdmin, getResults);



module.exports = adminRouter;
