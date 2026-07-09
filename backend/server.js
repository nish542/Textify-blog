const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { correctGrammar, translate } = require('./grammar');
const { verifyGoogleToken, signToken, verifyToken } = require('./auth');
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
  // Internal link to the author's account. Present on every account-created
  // post (including anonymous ones); never exposed by the public API.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isAnonymous: {
    type: Boolean,
    default: false
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

// User Schema
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  picture: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema, 'TextifyUsers');

// Public shape of a blog post. NEVER exposes `user`, so the author of an
// anonymous post can't be discovered by inspecting the API response.
const sanitizeBlog = (blog) => ({
  _id: blog._id,
  title: blog.title,
  content: blog.content,
  author: blog.author, // already 'Anonymous' for anonymous posts
  isAnonymous: blog.isAnonymous,
  createdAt: blog.createdAt,
  replies: blog.replies
});

// Require a valid app JWT; attaches the user document as req.user.
const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const payload = verifyToken(token);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
};

// Rate limiting for auth (prevents sign-in abuse)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { error: 'Too many authentication attempts. Please try again later.' }
});

// POST /api/auth/google - Verify a Google credential, upsert the user, issue a JWT
app.post('/api/auth/google', authLimiter, async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Missing Google credential' });
    }

    const payload = await verifyGoogleToken(credential);

    // Upsert by Google's stable user id (`sub`); refresh name/email/picture.
    const user = await User.findOneAndUpdate(
      { googleId: payload.sub },
      {
        googleId: payload.sub,
        name: payload.name || 'User',
        email: payload.email,
        picture: payload.picture
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, picture: user.picture }
    });
  } catch (error) {
    console.error('Google auth error:', error.message);
    res.status(401).json({ error: 'Google authentication failed' });
  }
});

// GET /api/auth/me - Return the current user's profile
app.get('/api/auth/me', requireAuth, (req, res) => {
  const u = req.user;
  res.json({ user: { id: u._id, name: u.name, email: u.email, picture: u.picture } });
});

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
      blogs: blogs.map(sanitizeBlog), // strips `user`; keeps anonymous posts anonymous
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

// POST /api/blogs - Create a new blog post (must be logged in)
app.post('/api/blogs', requireAuth, blogPostLimiter, async (req, res) => {
  try {
    const { title, content, isAnonymous } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    if (title.length > 200) {
      return res.status(400).json({ error: 'Title must be less than 200 characters' });
    }

    if (content.length > 5000) {
      return res.status(400).json({ error: 'Content must be less than 5000 characters' });
    }

    const anonymous = !!isAnonymous;

    // Identity always comes from the authenticated account — the client cannot
    // supply an author. Anonymous posts still link to the user internally.
    const newBlog = new Blog({
      title: title.trim(),
      content: content.trim(),
      author: anonymous ? 'Anonymous' : req.user.name,
      user: req.user._id,
      isAnonymous: anonymous
    });

    await newBlog.save();

    res.status(201).json({
      message: 'Blog post created successfully',
      blog: sanitizeBlog(newBlog)
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// GET /api/blogs/mine - All posts by the logged-in user (public + anonymous)
app.get('/api/blogs/mine', requireAuth, async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user._id }).sort({ createdAt: -1 });
    // Owner sees everything, including the isAnonymous flag on their own posts.
    res.json({ blogs });
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ error: 'Failed to fetch your posts' });
  }
});

// DELETE /api/blogs/:id - Delete own post
app.delete('/api/blogs/:id', requireAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    if (!blog.user || blog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }
    await blog.deleteOne();
    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
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
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.warn('⚠️  GOOGLE_CLIENT_ID is not set — Google sign-in will fail until it is configured.');
  }
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET is not set — auth tokens cannot be issued/verified.');
  }
});

module.exports = app;