import React, { useState } from 'react';
import axios from 'axios';

// Configure axios defaults
axios.defaults.timeout = 5000; // 5 second timeout
axios.defaults.baseURL = 'http://localhost:8003';
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
          });
        
        console.log('Login response:', response.data);
        if (response.data.access_token) {
          localStorage.setItem('token', response.data.access_token);
          onLogin(response.data.access_token);
          setShowModal(false);
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
            setFormData(prev => ({
              ...prev,
              password: ''
            }));
            // Switch to login view after a short delay
            setTimeout(() => {
              setIsLogin(true);
            }, 2000);
          }
        } catch (registrationError) {
          console.error('Registration error details:', {
            message: registrationError.message,
            code: registrationError.code,
            response: registrationError.response,
            request: registrationError.request
          });
          
          if (registrationError.code === 'ECONNABORTED') {
            setError('Request timed out. Please check if the server is running.');
          } else if (registrationError.code === 'ECONNREFUSED') {
            setError('Cannot connect to the server. Please make sure the backend is running on port 8001.');
          } else if (registrationError.response?.data?.detail) {
            setError(registrationError.response.data.detail);
          } else if (registrationError.message) {
            setError(`Registration failed: ${registrationError.message}`);
          } else {
            setError('Registration failed. Please try again.');
          }
        }
      }
    } catch (err) {
      console.error('Login error:', {
        message: err.message,
        code: err.code,
        response: err.response,
        request: err.request
      });
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please check if the server is running.');
      } else if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to the server. Please make sure the backend is running on port 8001.');
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.message) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setError('');
    setSuccess('');
    setFormData({
      username: '',
      password: '',
      email: ''
    });
  };

  return (
    <>
      <button 
        className={`btn btn-outline-${mode === 'light' ? 'primary' : 'light'} ms-2`}
        onClick={() => setShowModal(true)}
      >
        {localStorage.getItem('token') ? 'Profile' : 'Login'}
      </button>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content" style={{
              backgroundColor: mode === 'dark' ? '#22262b' : 'white',
              color: mode === 'dark' ? 'white' : 'black'
            }}>
              <div className="modal-header">
                <h5 className="modal-title">{isLogin ? 'Login' : 'Register'}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleModalClose}
                  style={{ filter: mode === 'dark' ? 'invert(1)' : 'none' }}
                ></button>
              </div>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    {success}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      style={{
                        backgroundColor: mode === 'dark' ? '#2c3034' : 'white',
                        color: mode === 'dark' ? 'white' : 'black',
                        border: '1px solid #ced4da'
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{
                        backgroundColor: mode === 'dark' ? '#2c3034' : 'white',
                        color: mode === 'dark' ? 'white' : 'black',
                        border: '1px solid #ced4da'
                      }}
                    />
                  </div>
                  {!isLogin && (
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                          backgroundColor: mode === 'dark' ? '#2c3034' : 'white',
                          color: mode === 'dark' ? 'white' : 'black',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isLoading || success}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {isLogin ? 'Logging in...' : 'Registering...'}
                        </>
                      ) : (
                        isLogin ? 'Login' : 'Register'
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setSuccess('');
                        setFormData(prev => ({
                          ...prev,
                          password: ''
                        }));
                      }}
                      disabled={isLoading || success}
                    >
                      {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal-backdrop show"></div>
      )}
    </>
  );
} 