// routes/users.js
const express = require('express');
const { User } = require('../models/index'); // Updated import
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(protect);

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Editor only)
router.get('/', authorize('Editor'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Sequelize way to exclude password
    });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users
// @desc    Create new user
// @access  Private (Editor only)
router.post('/', authorize('Editor'), async (req, res) => {
  try {
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Create user with request body data and temporary password
    const user = await User.create({
      ...req.body,
      password: tempPassword
    });

    // Get user data without password
    const userData = user.toJSON();
    delete userData.password;

    // In a real production app, you would send an email with the temporary password
    // to the user here, using a service like Nodemailer

    res.status(201).json({
      success: true,
      data: userData,
      tempPassword // Only included for demo purposes
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Editor only)
router.get('/:id', authorize('Editor'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { // Sequelize findByPk
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
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Editor only)
router.put('/:id', authorize('Editor'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Don't allow password updates through this endpoint
    if (req.body.password) {
      delete req.body.password;
    }

    // Update user with Sequelize
    await user.update(req.body);

    // Fetch updated user without password
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;