const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { correctGrammar, translate } = require('./grammar');
require('dotenv').config();

const app = express();

// CORS middleware
app.use(cors({
  origin: ['https://textify-blog.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Add pre-flight OPTIONS handler
app.options('*', cors());

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
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is not set');
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'textify'
  })
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Database Name:', mongoose.connection.name);  // <--- Important
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code
    });
  });

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
    default: Date.now,
    expires: 864000
  },
  replies: [{
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
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
  }]
});
  
const Blog = mongoose.model('Blog', blogSchema, 'TextifyBlogs');

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

// POST /api/blogs/:id/replies - Add a reply to a blog post
app.post('/api/blogs/:id/replies', async (req, res) => {
  try {
    console.log('Received reply request for blog:', req.params.id);
    console.log('Reply data:', req.body);
    
    const { content, author } = req.body;
    const blogId = req.params.id;

    if (!content) {
      console.log('Validation failed: Missing reply content');
      return res.status(400).json({ error: 'Reply content is required' });
    }

    if (content.length > 1000) {
      console.log('Validation failed: Reply too long');
      return res.status(400).json({ error: 'Reply must be less than 1000 characters' });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      console.log('Blog not found:', blogId);
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const reply = {
      content: content.trim(),
      author: author?.trim() || 'Anonymous',
      createdAt: new Date()
    };

    console.log('Adding reply to blog:', reply);
    blog.replies.push(reply);
    await blog.save();
    console.log('Reply added successfully');

    res.status(201).json({
      message: 'Reply added successfully',
      reply: reply
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

// GET /api/blogs/:id/replies - Get all replies for a blog post
app.get('/api/blogs/:id/replies', async (req, res) => {
  try {
    console.log('Fetching replies for blog:', req.params.id);
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      console.log('Blog not found:', req.params.id);
      return res.status(404).json({ error: 'Blog post not found' });
    }

    console.log(`Found ${blog.replies.length} replies`);
    res.json(blog.replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
});

// Rate limiting for grammar correction (protects the GitHub Models quota)
const grammarLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 corrections per windowMs
  message: { error: 'Too many grammar-correction requests. Please try again later.' }
});

// POST /api/correct-grammar - Correct grammar via GitHub Models (gpt-4o-mini)
app.post('/api/correct-grammar', grammarLimiter, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (text.length > 2000) {
      return res.status(400).json({ error: 'Text must be less than 2000 characters' });
    }

    const correctedText = await correctGrammar(text.trim());
    res.json({ correctedText });
  } catch (error) {
    // Log only the message (never the full error object, which can include headers)
    console.error('Grammar correction error:', error.message);
    if (error.status === 429) {
      return res.status(429).json({ error: 'Grammar service is busy (daily/rate limit reached). Please try again later.' });
    }
    res.status(500).json({ error: 'Grammar correction failed. Please try again.' });
  }
});

// POST /api/translate - Translate text via GitHub Models (gpt-4o-mini)
app.post('/api/translate', grammarLimiter, async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!targetLanguage || !targetLanguage.trim()) {
      return res.status(400).json({ error: 'Target language is required' });
    }

    if (text.length > 2000) {
      return res.status(400).json({ error: 'Text must be less than 2000 characters' });
    }

    const translatedText = await translate(text.trim(), targetLanguage.trim());
    res.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error.message);
    if (error.status === 429) {
      return res.status(429).json({ error: 'Translation service is busy (daily/rate limit reached). Please try again later.' });
    }
    res.status(500).json({ error: 'Translation failed. Please try again.' });
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

  if (!process.env.GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN is not set — grammar correction will fail until it is configured.');
  }
});

module.exports = app;