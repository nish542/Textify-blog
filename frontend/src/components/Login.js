import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useAuth } from '../context/AuthContext';

export default function Login(props) {
  useScrollToTop();
  const navigate = useNavigate();
  const { user, loading, loginWithGoogle } = useAuth();
  const [error, setError] = useState(null);

  const isDark = props.mode === 'dark';
  const hasClientId = !!process.env.REACT_APP_GOOGLE_CLIENT_ID;

  // Already signed in → go to the profile.
  useEffect(() => {
    if (!loading && user) navigate('/profile', { replace: true });
  }, [loading, user, navigate]);

  const handleSuccess = async (credentialResponse) => {
    setError(null);
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(err.message || 'Sign-in failed. Please try again.');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '480px' }}>
      <div
        className="card border-0 shadow-lg text-center p-4 p-md-5"
        style={{
          borderRadius: '20px',
          backgroundColor: isDark ? 'rgba(36, 38, 56, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          color: isDark ? '#ececf1' : '#1f2333',
        }}
      >
        <h2 className="fw-bold mb-2">Welcome to Textify</h2>
        <p className="mb-4" style={{ color: isDark ? '#a1a1ad' : '#6b7280' }}>
          Sign in with Google to write and manage your blog posts.
        </p>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>{error}
          </div>
        )}

        {hasClientId ? (
          <div className="d-flex justify-content-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => setError('Google sign-in failed. Please try again.')}
              theme={isDark ? 'filled_black' : 'outline'}
              shape="pill"
              size="large"
            />
          </div>
        ) : (
          <div className="alert alert-warning mb-0" role="alert">
            Google sign-in isn’t configured yet. Set <code>REACT_APP_GOOGLE_CLIENT_ID</code> in the frontend environment.
          </div>
        )}

        <p className="mt-4 mb-0" style={{ fontSize: '0.85rem', color: isDark ? '#a1a1ad' : '#6b7280' }}>
          You can still read blogs and use the text tools without signing in.
        </p>
      </div>
    </div>
  );
}
