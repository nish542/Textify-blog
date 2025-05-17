import React, { useState } from 'react';
import Login from './Login';

export default function Navbar(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    const handleLogin = (token) => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };
    
    return (
        <nav className={`navbar navbar-expand-lg navbar-${props.mode} bg-${props.mode}`}>
            <div className="container-fluid">
                <a className="navbar-brand" href="/" mode={props.mode==='light'?'dark':'light'}>{props.title}</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/about">About</a>
                        </li>
                    </ul>
                    
                    <div className="d-flex align-items-center">
                        <div className={`form-check form-switch text-${props.mode==='light'?'dark':'light'} me-3`}>
                            <input className="form-check-input" type="checkbox" onClick={props.toggleMode} role="switch" id="flexSwitchCheckDefault" />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Enable Dark Mode</label>
                        </div>
                        
                        {isLoggedIn ? (
                            <button 
                                className={`btn btn-outline-${props.mode === 'light' ? 'primary' : 'light'}`}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        ) : (
                            <Login mode={props.mode} onLogin={handleLogin} />
                        )}
                    </div>
                </div> 
            </div>
        </nav>
    );
}

