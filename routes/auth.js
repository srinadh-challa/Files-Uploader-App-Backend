// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel'); 
const router = express.Router();
const { register } = require('../controllers/authController');
const authController = require('../controllers/authController');

// const SECRET = 'your_secret_key'; // move this to .env in real app
router.post('/register', register);

// Login route
router.post('/login', authController.login);

module.exports = router;
