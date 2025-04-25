// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
// const path = require('path');
const User = require('../models/userModel'); // Assuming you have a User model defined
// Register user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if the user already exists by username or email
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Username or email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,  // Hash the password before saving
      });
  
      // Save the new user to the database
      await newUser.save();
  
      res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).json({ success: false, error: 'Error registering user' });
    }
  };
  

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
    //   const user = await User.findOne({ username });
      const user = await User.findOne({ email }); // ✅ now matches the frontend

      if (!user) {
        return res.status(400).json({ success: false, error: 'User not found' });
      }
  
    //   const isMatch = await bcrypt.compare(password, user.password);
    //   if (!isMatch) {
    //     return res.status(401).json({ success: false, error: 'Invalid password' });
    //   }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.json({ success: true, token });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, error: 'Login failed' });
    }
  };
