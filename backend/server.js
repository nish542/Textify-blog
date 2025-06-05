const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// CORS middleware
app.use(cors({
  origin: ['https://textify-blog.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rate limiting for blog posts
const blogPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 blog posts per windowMs
  message: { error: 'Too many blog posts. Please try again later.' }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  author: {
    type: String,
    default: 'Anonymous',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.model('Blog', blogSchema);

// GET /api/blogs - Get all blog posts with pagination
app.get('/api/blogs', async (req, res) => {
  try {
    console.log('Fetching blogs with params:', req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments();
    const totalPages = Math.ceil(total / limit);

    console.log(`Found ${blogs.length} blogs, total: ${total}, pages: ${totalPages}`);
    res.json({
      blogs,
      currentPage: page,
      totalPages,
      total
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// GET /api/blogs/stats - Get blog statistics
app.get('/api/blogs/stats', async (req, res) => {
  try {
    console.log('Fetching blog stats');
    const total = await Blog.countDocuments();
    const recent = await Blog.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    console.log(`Stats - Total: ${total}, Recent: ${recent}`);
    res.json({ total, recent });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// POST /api/blogs - Create a new blog post
app.post('/api/blogs', blogPostLimiter, async (req, res) => {
  try {
    console.log('Received blog post request:', req.body);
    const { title, content, author } = req.body;

    // Validation
    if (!title || !content) {
      console.log('Validation failed: Missing title or content');
      return res.status(400).json({ error: 'Title and content are required' });
    }

    if (title.length > 200) {
      console.log('Validation failed: Title too long');
      return res.status(400).json({ error: 'Title must be less than 200 characters' });
    }

    if (content.length > 5000) {
      console.log('Validation failed: Content too long');
      return res.status(400).json({ error: 'Content must be less than 5000 characters' });
    }

    // Create new blog
    const newBlog = new Blog({
      title: title.trim(),
      content: content.trim(),
      author: author?.trim() || 'Anonymous'
    });

    console.log('Attempting to save blog:', newBlog);
    await newBlog.save();
    console.log('Blog saved successfully');

    res.status(201).json({
      message: 'Blog post created successfully',
      blog: {
        id: newBlog._id,
        title: newBlog.title,
        content: newBlog.content,
        author: newBlog.author,
        createdAt: newBlog.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ 
      error: 'Failed to create blog post',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for: ${['https://textify-blog.vercel.app', 'http://localhost:3000'].join(', ')}`);
});

module.exports = app;