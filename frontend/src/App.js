import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar.js';
import TextSpace from './components/textt.js';
import About from './components/About.js';
import Alert from './components/Alert.js';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

function App() {
 

  const [ mode, setMode] = useState('light');
  const [ alert, setAlert] = useState(null);
  
  const showAlert = (message, type)=>{
    setAlert({
      msg: message,
      type: type
    })

    setTimeout(()=>{
      setAlert(null);
    }, 1500);
  }

  const toggleMode = ()=>{
    if(mode==='light'){
      setMode('dark');
      document.body.style.background = '#0b0b15';
      document.body.style.color = 'white';
      showAlert("You've switched to dark mode", "success");
    }

    else{
      setMode('light')
      document.body.style.background = '#f9f7f2';
      document.body.style.color = '#272f52';
      showAlert("You've switched to light mode", "success");
    }
  }
  // let mStyle={
  //   documnet.body.style.backgroundColor= mode === 'dark' ? '#0b0b15' : '#f9f7f2',
  //   document.body.style.color = mode === 'dark' ? 'white' : 'black'
  // }

  const router = createBrowserRouter([
    {
      path: '/', 
      element:<><TextSpace title="Enter text" Text="Enter text here" mode ={mode} /></> 
    },
    {
      path: '/about',
      element: <About mode = {mode} />
    }
  ])
  
  return (
    <>    
    <Navbar title="Textify" mode={mode} toggleMode={toggleMode}/>
    <div className='cont my-4 mx-5'>
      <Alert alert = {alert} />
    </div>
    <div className = "container my-4 style">
      <RouterProvider router={router} />   
    </div>
    
    </>
  );
}

export default App;

