const express = require('express');
const {listVoters} = require('../controllers/voterController.js');
const voterModel = require('../models/voterModel.js');
const limiter = require('../middlewares/rateLimiter.js');

const voterRouter = express.Router();

voterRouter.post("/ring", limiter, async (req, res) => {
  const { publicKey } = req.body;
  const ringSize = 7;

  try {
    const sampled = await voterModel.aggregate([
      { $match: { publicKey: { $ne: publicKey } } },
      { $sample: { size: ringSize - 1 } },
      { $project: { publicKey: 1, _id: 0 } },
    ]);

    // Add the real signer to the ring
    const fullRing = [...sampled.map(v => v.publicKey), publicKey];
    // Shuffle to hide signer index
    const shuffledRing = fullRing.sort(() => Math.random() - 0.5);

    res.json({ ring: shuffledRing });
  } catch (err) {
    console.error("Ring sampling error:", err);
    res.status(500).json({ message: "Failed to build ring" });
  }
});

voterRouter.get("/list", limiter,  listVoters);


module.exports = voterRouter;