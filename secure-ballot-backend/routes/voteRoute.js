const express = require("express");
const router = express.Router();
const { verifySignature } = require("../utils/verifyUser.js");
const voteModel = require("../models/voteModel.js");
const limiter = require("../middlewares/rateLimiter.js");


router.post("/verify",limiter, async (req, res) => {
  try {
    const { message, ring, signature } = req.body;

    if (!message || !ring || !signature) {
      return res.status(400).json({ valid: false, error: "Missing vote data" });
    }

    // Ensure message is a string (stringify if it's an object)
    const messageString = typeof message === "string" ? message : JSON.stringify(message);

    const isValid = verifySignature(messageString, ring, signature);

    if (!isValid) {
      return res.status(400).json({ valid: false, error: "Invalid signature" });
    }

    const y0 = signature.y0;

    //checking if tag already exist
    const existing = await voteModel.findOne({ y0 });

    if(existing){
        return res.status(403).json({ valid: false, error: "Duplicate Vote detected (linked)"});
    }

    //Storing Vote:
    await voteModel.create({
      y0,
      message: JSON.parse(message), // Store the original message object
      timestamp: new Date(),
    });

    return res.json({ valid: true, message: "Signature verified successfully - Vote recorded successfully" });
  } catch (err) {
    console.error("🔴 Verification error:", err);
    return res.status(500).json({ valid: false, error: "Server error during verification" });
  }
});

module.exports = router;
