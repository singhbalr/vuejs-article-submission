// routes/articles.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Article, User, Company } = require('../models/index');
const { protect, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with original extension
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Accept only image files
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed'));
};

// Set up multer upload
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// All article routes require authentication
router.use(protect);

// @route   GET /api/articles
// @desc    Get all articles
// @access  Private (All users)
router.get('/', async (req, res) => {
  try {
    // Get query parameters for filtering
    const { status, writer } = req.query;
    let whereClause = {};
    
    // Add filters if provided
    if (status) whereClause.status = status;
    if (writer) whereClause.writerId = writer;
    
    // For writers, only show their own articles or published articles
    if (req.user.type === 'Writer') {
      whereClause = {
        [Op.or]: [
          { writerId: req.user.id },
          { status: 'Published' }
        ],
        ...whereClause
      };
    }

    // Fetch articles with associations
    const articles = await Article.findAll({
      where: whereClause,
      include: [
        { 
          model: User, 
          as: 'writer',
          attributes: ['id', 'firstname', 'lastname'] 
        },
        { 
          model: User, 
          as: 'editor',
          attributes: ['id', 'firstname', 'lastname'] 
        },
        { 
          model: Company, 
          as: 'company',
          attributes: ['id', 'name', 'logo'] 
        }
      ],
      order: [['date', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/articles
// @desc    Create new article
// @access  Private (All users)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('POST /api/articles - Request received');
    console.log('Files:', req.files || 'No files array');
    console.log('File:', req.file || 'No file object');
    console.log('Body:', req.body);
    
    // Check if an image was uploaded
    if (!req.file) {
      console.log('No image file was uploaded');
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    console.log('File received:', req.file);
    console.log('Request body:', req.body);

    // Create article object from request body
    const articleData = {
      ...req.body,
      image: `/uploads/${req.file.filename}`,
      writerId: req.user.id,
      status: 'For Edit' // Always set to 'For Edit' on creation
    };

    // Create article
    const article = await Article.create(articleData);

    // Fetch the article with associations
    const newArticle = await Article.findByPk(article.id, {
      include: [
        { 
          model: User, 
          as: 'writer',
          attributes: ['id', 'firstname', 'lastname'] 
        },
        { 
          model: Company, 
          as: 'company',
          attributes: ['id', 'name', 'logo'] 
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: newArticle
    });
  } catch (error) {
    // Remove uploaded file if article creation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error creating article:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/articles/:id
// @desc    Get article by ID
// @access  Private (All users)
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [
        { 
          model: User, 
          as: 'writer',
          attributes: ['id', 'firstname', 'lastname'] 
        },
        { 
          model: User, 
          as: 'editor',
          attributes: ['id', 'firstname', 'lastname'] 
        },
        { 
          model: Company, 
          as: 'company',
          attributes: ['id', 'name', 'logo'] 
        }
      ]
    });
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Check if user has access to this article
    if (req.user.type === 'Writer' && 
        article.writerId !== req.user.id && 
        article.status !== 'Published') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/articles/:id
// @desc    Update article
// @access  Private (Writers can update their own unpublished articles, Editors can update any article)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    let article = await Article.findByPk(req.params.id);
    
    if (!article) {
      // Remove uploaded file if article doesn't exist
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Check if user has permission to update this article
    if (req.user.type === 'Writer') {
      // Writers can only update their own unpublished articles
      if (article.writerId !== req.user.id) {
        // Remove uploaded file if permission denied
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(403).json({ success: false, message: 'Not authorized to update this article' });
      }

      if (article.status === 'Published') {
        // Remove uploaded file if article is published
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(403).json({ success: false, message: 'Cannot update a published article' });
      }
    }

    // Prepare update data
    const updateData = { ...req.body };
    
    // Add image if uploaded
    if (req.file) {
      // Delete old image if it exists
      if (article.image && article.image.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', article.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Check if editor is publishing the article
    if (req.user.type === 'Editor' && req.body.status === 'Published') {
      updateData.editorId = req.user.id;
      updateData.status = 'Published';
    }

    // Update article
    await article.update(updateData);

    // Fetch updated article with associations
    const updatedArticle = await Article.findByPk(article.id, {
      include: [
        { 
          model: User, 
          as: 'writer',
          attributes: ['id', 'firstname', 'lastname'] 
        },
        { 
          model: User, 
          as: 'editor',
          attributes: ['id', 'firstname', 'lastname'] 
        },
        { 
          model: Company, 
          as: 'company',
          attributes: ['id', 'name', 'logo'] 
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: updatedArticle
    });
  } catch (error) {
    // Remove uploaded file if update fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error updating article:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;