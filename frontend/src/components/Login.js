import React, { useState } from 'react';
import axios from 'axios';

// Configure axios defaults
const api = axios.create({
  baseURL: '/',  // Use relative URL
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor for logging
api.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

// Add response interceptor for logging
api.interceptors.response.use(
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
      const response = await api.get('/user/profile', {
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
        const response = await api.post('/auth/token', 
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
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
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
          const response = await api.post('/auth/register', {
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
      <button 
        onClick={() => setShowModal(true)}
        className={`btn btn-outline-${mode === 'light' ? 'primary' : 'light'}`}
      >
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
      
      {showModal && (
        <div className="modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: mode === 'light' ? 'white' : '#22262b',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            position: 'relative',
            color: mode === 'light' ? 'black' : 'white'
          }}>
            <span className="close" onClick={handleModalClose} style={{
              position: 'absolute',
              right: '20px',
              top: '10px',
              fontSize: '24px',
              cursor: 'pointer',
              color: mode === 'light' ? 'black' : 'white'
            }}>&times;</span>
            <h2 style={{ marginBottom: '20px' }}>{isLogin ? 'Login' : 'Create Account'}</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: mode === 'light' ? 'white' : '#2c3034',
                    color: mode === 'light' ? 'black' : 'white',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
              
              {!isLogin && (
                <div className="form-group mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required={!isLogin}
                    style={{
                      backgroundColor: mode === 'light' ? 'white' : '#2c3034',
                      color: mode === 'light' ? 'black' : 'white',
                      border: '1px solid #ced4da'
                    }}
                  />
                </div>
              )}
              
              <div className="form-group mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: mode === 'light' ? 'white' : '#2c3034',
                    color: mode === 'light' ? 'black' : 'white',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
              
              <button 
                type="submit" 
                className={`btn btn-${mode === 'light' ? 'primary' : 'light'} w-100`}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
              </button>
            </form>
            
            <div className="toggle-form mt-3 text-center">
              <p className="mb-0">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button"
                  className="btn btn-link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                  }}
                  style={{ color: mode === 'light' ? '#0d6efd' : '#fff' }}
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
