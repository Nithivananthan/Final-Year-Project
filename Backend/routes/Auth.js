const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1. Define Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  avatar: { type: String },
  googleId: { type: String },
  isProfileComplete: { type: Boolean, default: false }, 
  skills: [String],
  createdAt: { type: Date, default: Date.now }
});

// 2. Define Model (Capital 'U' is the standard convention)
const User = mongoose.model('User', UserSchema);

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists. Please login." });

    // Create new user instance
    const newUser = new User({ email, password });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    
    await newUser.save();

    // Create Token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token, 
      user: { id: newUser._id, email: newUser.email, isProfileComplete: false } 
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Registration failed" });
  }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) return res.status(400).json({ msg: "Account not found. Please register." });

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

    const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token, 
      user: { id: foundUser._id, email: foundUser.email, isProfileComplete: foundUser.isProfileComplete } 
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Login error" });
  }
});

// --- GOOGLE ROUTE ---
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const { email, name, picture, sub } = ticket.getPayload();

    let foundUser = await User.findOne({ email });
    if (!foundUser) {
      foundUser = new User({ email, name, avatar: picture, googleId: sub });
      await foundUser.save();
    }

    const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: foundUser._id, email: foundUser.email, isProfileComplete: foundUser.isProfileComplete } });
  } catch (err) {
    console.error("Google Error:", err);
    res.status(400).json({ msg: "Google verification failed" });
  }
});

module.exports = router;