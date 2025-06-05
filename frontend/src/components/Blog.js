import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://textify-blog.onrender.com/api';

export default function Blog(props) {
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
      container.className = `container py-4 ${props.mode === 'dark' ? 'app-container dark' : 'app-container light'}`;
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

  return (
    <div className={`container py-4 ${props.mode === 'dark' ? 'app-container dark' : 'app-container light'}`}>
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
                    backgroundColor: props.mode === 'dark' ? '#2a2a3a' : 'white',
                    border: '2px solid rgba(233, 236, 239, 0.5)',
                    borderRadius: '10px',
                    color: props.mode === 'dark' ? '#f5e6d3' : '#212529',
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
                    backgroundColor: props.mode === 'dark' ? '#2a2a3a' : 'white',
                    border: '2px solid rgba(233, 236, 239, 0.5)',
                    borderRadius: '10px',
                    color: props.mode === 'dark' ? '#f5e6d3' : '#212529',
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
                    backgroundColor: props.mode === 'dark' ? '#2a2a3a' : 'white',
                    border: '2px solid rgba(233, 236, 239, 0.5)',
                    borderRadius: '10px',
                    color: props.mode === 'dark' ? '#f5e6d3' : '#212529',
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
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {blogs.map(blog => (
            <div key={blog._id} className="col">
              <div className="card h-100 shadow-sm border-0 blog-card" style={{
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                borderRadius: '15px',
                overflow: 'hidden',
                backgroundColor: props.mode === 'dark' ? '#23233d' : 'white'
              }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title text-primary mb-0" style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      lineHeight: '1.4'
                    }}>
                      {blog.title}
                    </h5>
                  </div>
                  <p className="card-text mb-4" style={{
                    color: props.mode === 'dark' ? '#e0e0e0' : '#4a4a4a',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '0.95rem',
                    lineHeight: '1.6'
                  }}>
                    {blog.content}
                  </p>
                </div>
                <div className="card-footer bg-transparent border-0 p-4 pt-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-2" style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#007bff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        {blog.author.charAt(0).toUpperCase()}
                      </div>
                      <small className="text-muted" style={{
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        color: props.mode === 'dark' ? 'white' : '#6c757d'
                      }}>
                        {blog.author}
                      </small>
                    </div>
                    <small className="text-muted" style={{
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      color: props.mode === 'dark' ? '#f7f5f5' : '#6c757d'
                    }}>
                      <i className="fas fa-clock me-1"></i>
                      {formatDate(blog.createdAt)}
                    </small>
                  </div>
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
    background-color: #0b0b15;
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