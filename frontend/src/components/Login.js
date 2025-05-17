import React, { useState } from 'react';
import axios from 'axios';

// Configure axios defaults
axios.defaults.timeout = 5000; // 5 second timeout
axios.defaults.baseURL = 'https://textify-kai4.onrender.com'; // Changed to match FastAPI default port
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// Add request interceptor for logging
axios.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

// Add response interceptor for logging
axios.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Response Error:', {
      message: error.message,
      code: error.code,
      response: error.response,
      request: error.request
    });
    return Promise.reject(error);
  }
);

export default function Login({ mode, onLogin }) {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting to login with username:', formData.username);
        const response = await axios.post('/auth/token', 
          new URLSearchParams({
            'username': formData.username,
            'password': formData.password
          }), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        console.log('Login response:', response.data);
        if (response.data.access_token) {
          const token = response.data.access_token;
          localStorage.setItem('token', token);
          
          // Set token for all subsequent requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user profile
          try {
            const userProfile = await fetchUserProfile(token);
            console.log('User profile:', userProfile);
            onLogin(token, userProfile);
            setShowModal(false);
          } catch (profileError) {
            console.error('Error fetching profile after login:', profileError);
            // Still consider login successful even if profile fetch fails
            onLogin(token);
            setShowModal(false);
          }
        } else {
          setError('Invalid response from server');
        }
      } else {
        // Registration
        console.log('Attempting to register with:', { 
          username: formData.username, 
          email: formData.email 
        });
        
        try {
          const response = await axios.post('/auth/register', {
            username: formData.username,
            password: formData.password,
            email: formData.email
          });
          
          console.log('Registration response:', response.data);
          if (response.data) {
            setSuccess('Registration successful! Please login with your credentials.');
            // Keep username and email, clear password
            setFormData(prev => ({ ...prev, password: '' }));
            // Switch to login view after a short delay
            setTimeout(() => {
              setIsLogin(true);
            }, 2000);
          }
        } catch (registrationError) {
          handleError(registrationError, 'Registration failed');
        }
      }
    } catch (err) {
      handleError(err, 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (err, defaultMessage) => {
    console.error(`${defaultMessage} error:`, {
      message: err.message,
      code: err.code,
      response: err.response,
      request: err.request
    });
    
    if (err.code === 'ECONNABORTED') {
      setError('Request timed out. Please check if the server is running.');
    } else if (err.code === 'ECONNREFUSED') {
      setError('Cannot connect to the server. Please make sure the backend is running.');
    } else if (err.response?.data?.detail) {
      setError(err.response.data.detail);
    } else if (err.message) {
      setError(`An error occurred: ${err.message}`);
    } else {
      setError(`${defaultMessage}. Please try again.`);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setError('');
    setSuccess('');
    setFormData({ username: '', password: '', email: '' });
  };

  return (
    <>
      {/* Your UI components here */}
      <button 
        onClick={() => setShowModal(true)}
        className="login-button"
      >
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </button>
      
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
              </button>
            </form>
            
            <div className="toggle-form">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                  }}
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
