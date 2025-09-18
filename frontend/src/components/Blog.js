import React, { useState, useEffect } from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';

// API Base URL - Change this to switch between local and production
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5001/api' 
  : 'https://textify-blog.onrender.com/api';

export default function Blog(props) {
  useScrollToTop();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, recent: 0 });

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Reply state
  const [replyFormData, setReplyFormData] = useState({
    content: '',
    author: ''
  });
  const [replyingTo, setReplyingTo] = useState(null);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});

  // Fetch blogs
  const fetchBlogs = async (page = 1) => {
    try {
      setLoading(true);
      console.log('Fetching blogs from:', `${API_BASE_URL}/blogs?page=${page}&limit=10`);
      const response = await fetch(`${API_BASE_URL}/blogs?page=${page}&limit=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch blogs');
      }
      
      const data = await response.json();
      console.log('Received blogs data:', data);
      setBlogs(data.blogs);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      console.log('Fetching stats from:', `${API_BASE_URL}/blogs/stats`);
      const response = await fetch(`${API_BASE_URL}/blogs/stats`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch stats');
      }
      
      const data = await response.json();
      console.log('Received stats data:', data);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchStats();
  }, []);

  // Add effect to handle mode changes
  useEffect(() => {
    const container = document.querySelector('.container');
    if (container) {
      container.className = `container py-4`;
    }
  }, [props.mode]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setSubmitError('Title and content are required');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      console.log('Submitting blog post:', formData);
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          author: formData.author.trim() || 'Anonymous'
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to create blog post');
      }

      // Reset form and refresh blogs
      setFormData({ title: '', content: '', author: '' });
      setShowForm(false);
      await fetchBlogs(1);
      await fetchStats();
      
      // Show success message
      alert('Blog post created successfully!');
      
    } catch (err) {
      console.error('Error creating blog:', err);
      setSubmitError(err.message || 'Failed to create blog post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle reply submission
  const handleReplySubmit = async (e, blogId) => {
    e.preventDefault();
    
    if (!replyFormData.content.trim()) {
      setReplyError('Reply content is required');
      return;
    }

    setSubmittingReply(true);
    setReplyError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          content: replyFormData.content.trim(),
          author: replyFormData.author.trim() || 'Anonymous'
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add reply');
      }
      
      // Reset form and refresh blogs
      setReplyFormData({ content: '', author: '' });
      setReplyingTo(null);
      await fetchBlogs(currentPage);
      
    } catch (err) {
      console.error('Error adding reply:', err);
      setReplyError(err.message || 'Failed to add reply. Please try again.');
    } finally {
      setSubmittingReply(false);
    }
  };

  // Handle reply form changes
  const handleReplyInputChange = (e) => {
    const { name, value } = e.target;
    setReplyFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle replies visibility
  const toggleReplies = (blogId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [blogId]: !prev[blogId]
    }));
  };

  return (
    <div className={`container py-4 `} >
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="display-5 fw-bold text-primary mb-3">Community Blogs</h2>
        <p className="mb-4" style={{
          color: props.mode === 'dark' ? '#f5e6d3' : '#6c757d',
          fontSize: '1.1rem'
        }}>
          Share your thoughts with the world. All posts are automatically removed after 10 days.
        </p>
        
        {/* Stats */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body py-3">
                <h5 className="card-title text-primary mb-1">{stats.total}</h5>
                <small className="text-muted">Total Posts</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body py-3">
                <h5 className="card-title text-success mb-1">{stats.recent}</h5>
                <small className="text-muted">Recent (24h)</small>
              </div>
            </div>
          </div>
        </div>

        {/* Create Blog Button */}
        <button
          className="btn btn-primary btn-lg"
          onClick={() => setShowForm(!showForm)}
          style={{ transition: 'all 0.3s ease' }}
        >
          <i className="fas fa-plus me-2"></i>
          {showForm ? 'Cancel' : 'Create New Blog'}
        </button>
      </div>

      {/* Blog Form */}
      {showForm && (
        <div className="card shadow-lg border-0 mb-5">
          <div className="card-header bg-primary text-white py-3">
            <h4 className="mb-0">
              <i className="fas fa-edit me-2"></i>
              Create New Blog Post
            </h4>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              {submitError && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {submitError}
                </div>
              )}
              
              <div className="mb-3">
                <label htmlFor="author" className="form-label" style={{
                  color: props.mode === 'dark' ? '#282842' : '#212529'
                }}>
                  <i className="fas fa-user me-1"></i>
                  Author (Optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Anonymous"
                  maxLength={50}
                  style={{
                    backgroundColor: props.mode === 'dark' ? 'rgb(204, 204, 236)' : 'white',
                    border: '2px solid rgba(233, 236, 239, 0.5)',
                    borderRadius: '10px',
                    color: props.mode === 'dark' ? 'black' : '#212529',
                    '::placeholder': {
                      color: props.mode === 'dark' ? '#a0a0a0' : '#6c757d'
                    }
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="title" className="form-label" style={{
                  color: props.mode === 'dark' ? '#282842' : '#212529'
                }}>
                  <i className="fas fa-heading me-1"></i>
                  Title *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter your blog title..."
                  required
                  maxLength={200}
                  style={{
                    backgroundColor: props.mode === 'dark' ? 'rgb(204, 204, 236)' : 'white',
                    border: '2px solid rgba(233, 236, 239, 0.5)',
                    borderRadius: '10px',
                    color: props.mode === 'dark' ? 'black' : '#212529',
                    '::placeholder': {
                      color: props.mode === 'dark' ? '#a0a0a0' : '#6c757d'
                    }
                  }}
                />
                <small className="text-muted" style={{
                  color: props.mode === 'dark' ? '#a0a0a0' : '#6c757d'
                }}>
                  {formData.title.length}/200 characters
                </small>
              </div>

              <div className="mb-4">
                <label htmlFor="content" className="form-label" style={{
                  color: props.mode === 'dark' ? '#282842' : '#212529'
                }}>
                  <i className="fas fa-align-left me-1"></i>
                  Content *
                </label>
                <textarea
                  className="form-control"
                  id="content"
                  name="content"
                  rows="8"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your blog content here..."
                  required
                  maxLength={5000}
                  style={{
                    backgroundColor: props.mode === 'dark' ? 'rgb(204, 204, 236)' : 'white',
                    border: '2px solid rgba(233, 236, 239, 0.5)',
                    borderRadius: '10px',
                    color: props.mode === 'dark' ? 'black' : '#212529',
                    '::placeholder': {
                      color: props.mode === 'dark' ? '#a0a0a0' : '#6c757d'
                    }
                  }}
                />
                <small className="text-muted" style={{
                  color: props.mode === 'dark' ? '#a0a0a0' : '#6c757d'
                }}>
                  {formData.content.length}/5000 characters
                </small>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={submitting}
                >
                  <i className="fas fa-paper-plane me-1"></i>
                  {submitting ? 'Publishing...' : 'Publish Blog'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-newspaper fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">No blogs yet</h4>
          <p className="text-muted">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="row g-4">
          {blogs.map(blog => (
            <div key={blog._id} className="col-12 col-md-6 col-lg-4">
              <div 
                className="card border-0"
                style={{
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  backgroundColor: props.mode === 'dark' ? '#ccccec' : 'rgb(223, 213, 192)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }}
              >
                {blog.replies && blog.replies.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    backgroundColor: '#0d6efd',
                    color: 'white',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 1
                  }}>
                    {blog.replies.length}
                  </div>
                )}
                <div className="card-body p-4" style={{
                  transition: 'all 0.3s ease',
                  backgroundColor: props.mode === 'dark' ? '#ccccec' : 'rgb(237, 230, 216)',
                  borderRadius: '20px'
                }}>
                  <h3 className="card-title mb-3">{blog.title}</h3>
                  <p className="card-text mb-3">{blog.content}</p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <small className="text-muted">
                      <i className="fas fa-user me-1"></i>
                      {blog.author}
                    </small>
                    <small className="text-muted">
                      <i className="fas fa-clock me-1"></i>
                      {formatDate(blog.createdAt)}
                    </small>
                  </div>
                  
                  {/* Comment Icon and Reply Button */}
                  <div className="d-flex gap-2 align-items-center">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => toggleReplies(blog._id)}
                      style={{
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className="fas fa-comments"></i>
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => setReplyingTo(replyingTo === blog._id ? null : blog._id)}
                      style={{
                        backgroundColor: replyingTo === blog._id ? '#dc3545' : '#0d6efd',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '8px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        fontWeight: '500'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                        e.currentTarget.style.backgroundColor = replyingTo === blog._id ? '#c82333' : '#0b5ed7';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        e.currentTarget.style.backgroundColor = replyingTo === blog._id ? '#dc3545' : '#0d6efd';
                      }}
                    >
                      <i className={`fas ${replyingTo === blog._id ? 'fa-times' : 'fa-reply'}`} style={{ fontSize: '0.9rem' }}></i>
                      {replyingTo === blog._id ? 'Cancel Reply' : 'Reply'}
                    </button>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === blog._id && (
                    <div className="mt-3">
                      <form onSubmit={(e) => handleReplySubmit(e, blog._id)}>
                        {replyError && (
                          <div className="alert alert-danger" role="alert">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            {replyError}
                          </div>
                        )}
                        
                        <div className="mb-2">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="author"
                            value={replyFormData.author}
                            onChange={handleReplyInputChange}
                            placeholder="Your name (optional)"
                            maxLength={50}
                          />
                        </div>
                        <div className="mb-2">
                          <textarea
                            className="form-control form-control-sm"
                            name="content"
                            value={replyFormData.content}
                            onChange={handleReplyInputChange}
                            placeholder="Write your reply..."
                            rows="2"
                            maxLength={1000}
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm"
                          disabled={submittingReply}
                        >
                          {submittingReply ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Posting...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane me-1"></i>
                              Post Reply
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Replies List */}
                  {blog.replies && blog.replies.length > 0 && expandedReplies[blog._id] && (
                    <div className="mt-3">
                      <h6 className="mb-2">
                        <i className="fas fa-comments me-1"></i>
                        Replies ({blog.replies.length})
                      </h6>
                      <div className="replies-list">
                        {blog.replies.map((reply, index) => (
                          <div key={index} className="reply-item p-2 border-start border-2 border-primary ms-3 mb-2">
                            <p className="mb-1">{reply.content}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                <i className="fas fa-user me-1"></i>
                                {reply.author}
                              </small>
                              <small className="text-muted">
                                <i className="fas fa-clock me-1"></i>
                                {formatDate(reply.createdAt)}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-5">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link border-0"
                onClick={() => fetchBlogs(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  backgroundColor: 'transparent',
                  color: props.mode === 'dark' ? '#e0e0e0' : '#4a4a4a',
                  padding: '0.5rem 1rem',
                  margin: '0 0.25rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button
                  className="page-link border-0"
                  onClick={() => fetchBlogs(index + 1)}
                  style={{
                    backgroundColor: currentPage === index + 1 ? '#007bff' : 'transparent',
                    color: currentPage === index + 1 ? 'white' : (props.mode === 'dark' ? '#e0e0e0' : '#4a4a4a'),
                    padding: '0.5rem 1rem',
                    margin: '0 0.25rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link border-0"
                onClick={() => fetchBlogs(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  backgroundColor: 'transparent',
                  color: props.mode === 'dark' ? '#e0e0e0' : '#4a4a4a',
                  padding: '0.5rem 1rem',
                  margin: '0 0.25rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

// Add this CSS to your component's style section or in your CSS file
const styles = `
  .blog-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
  }

  .page-link:hover {
    background-color: rgba(0,123,255,0.1) !important;
  }

  .page-item.active .page-link {
    box-shadow: 0 2px 5px rgba(0,123,255,0.3);
  }

  .app-container.dark {
    background-color: #19192c;
    color: white;
  }

  .app-container.light {
    background-color: #f9f7f2;
    color: #272f52;
  }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);