
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { validateEmail, validatePassword, sanitizeInput } = require('../middleware/validation');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register a new user
router.post('/signup', authLimiter, async (req, res) => {
  try {
    let { email, password, displayName } = req.body;
    
    // Sanitize inputs
    email = sanitizeInput(email);
    displayName = sanitizeInput(displayName);
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: emailValidation.message 
      });
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: passwordValidation.message 
      });
    }

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

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
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
router.post('/login', authLimiter, async (req, res) => {
  try {
    let { email, password } = req.body;
    
    // Sanitize inputs
    email = sanitizeInput(email);
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

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

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
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
router.post('/reset-password', resetLimiter, async (req, res) => {
  try {
    let { email } = req.body;
    
    // Sanitize input
    email = sanitizeInput(email);
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: emailValidation.message 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return res.status(200).json({ 
        success: true, 
        message: 'If your email is registered, you will receive a reset link' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Save token to database with expiration time (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // In a real application, you'd send an email with the reset link
    // For this example, we'll simulate success
    
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

// Create an endpoint to verify token and reset password
router.post('/reset-password/confirm', resetLimiter, async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Validate inputs
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required'
      });
    }
    
    // Validate new password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: passwordValidation.message 
      });
    }
    
    // Find user with this token and check expiration
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update user password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during password reset confirmation' 
    });
  }
});

module.exports = router;
