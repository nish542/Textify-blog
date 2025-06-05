import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar.js';
import TextSpace from './components/textt.js';
import About from './components/About.js';
import Blog from './components/Blog.js';
import Alert from './components/Alert.js';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

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
      element: <TextSpace title="Enter text" Text="Enter text here" mode={mode} showAlert={showAlert} /> 
    },
    {
      path: '/about',
      element: <About mode={mode} />
    },
    {
      path: '/blogs',
      element: <Blog mode={mode} showAlert={showAlert} />
    }
  ]);
  
  return (
    <div className={`app-container ${mode}`}>
      <Navbar title="Textify" mode={mode} toggleMode={toggleMode}/>
      <div className='cont my-4 mx-5'>
        <Alert alert={alert} />
      </div>
      <div className="container my-4">
        <RouterProvider router={router} />   
      </div>
    </div>
  );
}

export default App;