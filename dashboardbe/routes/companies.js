// routes/companies.js
const express = require('express');
const { Company } = require('../models/index');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All company routes require authentication
router.use(protect);

// @route   GET /api/companies
// @desc    Get all companies
// @access  Private (All users)
router.get('/', async (req, res) => {
  try {
    const companies = await Company.findAll();
    
    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/companies
// @desc    Create new company
// @access  Private (Editor only)
router.post('/', authorize('Editor'), async (req, res) => {
  try {
    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/companies/:id
// @desc    Get company by ID
// @access  Private (All users)
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/companies/:id
// @desc    Update company
// @access  Private (Editor only)
router.put('/:id', authorize('Editor'), async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Update company
    await company.update(req.body);

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;