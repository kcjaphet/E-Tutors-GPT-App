
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      displayName,
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        uid: user._id, // For compatibility with previous Firebase uid
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        uid: user._id, // For compatibility with previous Firebase uid
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Reset password request
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return res.status(200).json({ 
        success: true, 
        message: 'If your email is registered, you will receive a reset link' 
      });
    }

    // In a real application, you would:
    // 1. Generate a reset token
    // 2. Save it to the user record with an expiration
    // 3. Send an email with the reset link
    
    // For now, we'll just simulate success
    res.status(200).json({
      success: true,
      message: 'If your email is registered, you will receive a reset link'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during password reset request' 
    });
  }
});

module.exports = router;
