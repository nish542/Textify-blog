import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useAuth } from '../context/AuthContext';

// API Base URL - Change this to switch between local and production
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5001/api'
  : 'https://textify-blog.onrender.com/api';

export default function Profile(props) {
  useScrollToTop();
  const navigate = useNavigate();
  const { user, token, loading, logout } = useAuth();

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const isDark = props.mode === 'dark';

  // Not logged in → send to the login page.
  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [loading, user, navigate]);

  const fetchMyPosts = useCallback(async () => {
    if (!token) return;
    setPostsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/blogs/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load your posts');
      setPosts(data.blogs);
    } catch (err) {
      setError(err.message || 'Failed to load your posts.');
    } finally {
      setPostsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user) fetchMyPosts();
  }, [user, fetchMyPosts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete post');
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete post.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  if (loading || !user) return null; // redirecting or waiting on auth

  const cardBg = isDark ? 'rgba(36, 38, 56, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const textColor = isDark ? '#ececf1' : '#1f2333';
  const mutedColor = isDark ? '#a1a1ad' : '#6b7280';

  return (
    <div className="container py-4" style={{ maxWidth: '820px' }}>
      {/* Profile header */}
      <div
        className="card border-0 shadow-lg mb-4 p-4 d-flex flex-row align-items-center gap-3"
        style={{ borderRadius: '20px', backgroundColor: cardBg, color: textColor }}
      >
        {user.picture && (
          <img
            src={user.picture}
            alt={user.name}
            referrerPolicy="no-referrer"
            style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <div className="flex-grow-1">
          <h3 className="fw-bold mb-1">{user.name}</h3>
          <div style={{ color: mutedColor }}>
            <i className="fas fa-envelope me-2"></i>{user.email}
          </div>
        </div>
        <button className="btn btn-outline-danger" onClick={() => { logout(); navigate('/'); }}>
          <i className="fas fa-sign-out-alt me-1"></i> Logout
        </button>
      </div>

      {/* My Posts */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="fw-bold mb-0" style={{ color: textColor }}>
          <i className="fas fa-file-alt me-2"></i>My Posts
        </h4>
        <span style={{ color: mutedColor, fontSize: '0.9rem' }}>{posts.length} total</span>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>{error}
        </div>
      )}

      {postsLoading ? (
        <div className="text-center py-5" style={{ color: mutedColor }}>
          <i className="fas fa-spinner fa-spin me-2"></i>Loading your posts…
        </div>
      ) : posts.length === 0 ? (
        <div
          className="card border-0 shadow-sm text-center p-5"
          style={{ borderRadius: '16px', backgroundColor: cardBg, color: mutedColor }}
        >
          You haven’t published any posts yet.
          <div className="mt-3">
            <button className="btn btn-primary" onClick={() => navigate('/blogs')}>
              <i className="fas fa-pen me-1"></i> Write your first blog
            </button>
          </div>
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="card border-0 shadow-sm mb-3 p-3"
            style={{ borderRadius: '16px', backgroundColor: cardBg, color: textColor }}
          >
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h5 className="fw-bold mb-0">{post.title}</h5>
                  {post.isAnonymous ? (
                    <span className="badge bg-secondary">
                      <i className="fas fa-user-secret me-1"></i>Anonymous
                    </span>
                  ) : (
                    <span className="badge bg-success">
                      <i className="fas fa-user me-1"></i>Public
                    </span>
                  )}
                </div>
                <p className="mb-1" style={{ color: mutedColor, whiteSpace: 'pre-wrap' }}>
                  {post.content.length > 160 ? `${post.content.slice(0, 160)}…` : post.content}
                </p>
                <small style={{ color: mutedColor }}>
                  <i className="fas fa-clock me-1"></i>{formatDate(post.createdAt)}
                </small>
              </div>
              <button
                className="btn btn-sm btn-outline-danger"
                disabled={deletingId === post._id}
                onClick={() => handleDelete(post._id)}
                title="Delete post"
              >
                <i className={`fas ${deletingId === post._id ? 'fa-spinner fa-spin' : 'fa-trash'}`}></i>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
