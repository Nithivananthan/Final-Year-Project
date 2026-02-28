const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library'); // ✅ FIXED: Added import
const authMiddleware = require('../middleware/authmiddleware');

// ✅ FIXED: Initialize the Google Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  avatar: { type: String }, // Added for Google Profile Picture
  roadmap: {
    targetDomain: String,
    missingSkills: [String],
    roadmapData: [
      { month: Number, goal: String, action: String, isCompleted: { type: Boolean, default: false } }
    ]
  }
});

// Use existing model if defined, otherwise create it
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// --- GOOGLE LOGIN ROUTE ---
router.post('/google', async (req, res) => {
  const { credential } = req.body;

  try {
    // 1. Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { email, name, picture } = ticket.getPayload();

    // 2. Find or Create User
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        avatar: picture,
      });
      await user.save();
    }

    // 3. Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, roadmap: user.roadmap } 
    });

  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(400).json({ msg: "Google verification failed" });
  }
});

// --- GET ME ---
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).send("Server Error"); }
});

// --- REGISTER ---
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Exists" });
    
    user = new User({ email, password, name: name || email.split('@')[0] });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, name: user.name } });
  } catch (err) { res.status(500).send("Error"); }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "No User" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong Pass" });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, name: user.name, roadmap: user.roadmap } });
  } catch (err) { res.status(500).send("Error"); }
});

module.exports = router;