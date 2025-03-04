// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const {User} = require('../models/index');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Create JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1d'
  });
};

// @route   POST /api/auth/login
// @desc    User login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', email);

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ 
      where: { email }
    });
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log('User found:', user.email);
    console.log('Stored password hash:', user.password);
    console.log('Entered password:', password);

    // Check if user is active
    if (user.status !== 'Active') {
      return res.status(401).json({ success: false, message: 'User account is inactive' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create token
    const token = generateToken(user.id); // Use user.id instead of user._id

    // Create a user object without the password
    const userResponse = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      type: user.type,
      status: user.status
    };

    res.status(200).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    // Sequelize syntax for findByPk
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;