import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar.js';
import TextSpace from './components/textt.js';
import About from './components/About.js';
import Blog from './components/Blog.js';
import Alert from './components/Alert.js';
import Home from './components/Home';
import { Analytics } from "@vercel/analytics/react";
import {createBrowserRouter, RouterProvider, useLocation} from 'react-router-dom';

// Create a wrapper component to handle scroll restoration
function ScrollToTopWrapper({ children }) {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
}

function App() {
  const [mode, setMode] = useState(() => {
    // Get the saved mode from localStorage, default to 'light' if not found
    return localStorage.getItem('mode') || 'light';
  });
  const [alert, setAlert] = useState(null);
  
  // Apply the mode when component mounts
  useEffect(() => {
    applyMode(mode);
  }, [mode]);

  const applyMode = (newMode) => {
    if(newMode === 'dark') {
      document.body.style.background = '#0b0b15';
      document.body.style.color = 'white';
    } else {
      document.body.style.background = '#f9f7f2';
      document.body.style.color = '#272f52';
    }
  };
  
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    });

    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('mode', newMode);
    showAlert(`You've switched to ${newMode} mode`, "success");
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <ScrollToTopWrapper><Home mode={mode} /></ScrollToTopWrapper>
    },
    {
      path: '/edit',
      element: <ScrollToTopWrapper><TextSpace title="Enter text" Text="Enter text here" mode={mode} showAlert={showAlert} /></ScrollToTopWrapper>
    },
    {
      path: '/about',
      element: <ScrollToTopWrapper><About mode={mode} /></ScrollToTopWrapper>
    },
    {
      path: '/blogs',
      element: <ScrollToTopWrapper><Blog mode={mode} showAlert={showAlert} /></ScrollToTopWrapper>
    }
  ]);
  
  return (
    <div className={`app-container ${mode}`} style={{ minHeight: '100vh', position: 'relative' }}>
      <Analytics />
      {/* Abstract background shapes for the whole app */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: 'max(-60px, -10vw)',
          left: 'max(-60px, -10vw)',
          width: 'min(180px, 40vw)',
          height: 'min(180px, 40vw)',
          background: 'radial-gradient(circle, #ffe5d0 60%, #fff0 100%)',
          borderRadius: '50%',
          opacity: mode === 'dark' ? 0.2 : 0.7,
        }} />
        <div style={{
          position: 'absolute',
          bottom: 'max(-80px, -10vw)',
          left: 'max(-40px, -10vw)',
          width: 'min(120px, 30vw)',
          height: 'min(120px, 30vw)',
          background: 'radial-gradient(circle, #ffd6d6 60%, #fff0 100%)',
          borderRadius: '50%',
          opacity: mode === 'dark' ? 0.15 : 0.6,
        }} />
        <div style={{
          position: 'absolute',
          top: '40%',
          right: 'max(-60px, -10vw)',
          width: 'min(140px, 30vw)',
          height: 'min(140px, 30vw)',
          background: 'radial-gradient(circle, #f7e6c4 60%, #fff0 100%)',
          borderRadius: '50%',
          opacity: mode === 'dark' ? 0.18 : 0.7,
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: 'min(80px, 18vw)',
          height: 'min(80px, 18vw)',
          background: 'radial-gradient(circle, #ffe5d0 60%, #fff0 100%)',
          borderRadius: '50%',
          opacity: mode === 'dark' ? 0.12 : 0.5,
        }} />
      </div>

      {/* Fixed navbar at the top */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Navbar title="Textify" mode={mode} toggleMode={toggleMode}/>
        <div className='cont mx-5'>
          <Alert alert={alert} />
        </div>
      </div>

      {/* Main content with padding for fixed navbar */}
      <div style={{ 
        paddingTop: '70px', // Adjust this value based on your navbar height
        position: 'relative',
        zIndex: 1
      }}>
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;