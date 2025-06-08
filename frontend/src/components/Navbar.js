import React from 'react';

export default function Navbar(props) {
    return (
        <nav className={`navbar navbar-expand-lg navbar-${props.mode} bg-${props.mode}`} 
            style={{
                boxShadow: props.mode === 'dark' 
                    ? '0 2px 10px rgba(0, 0, 0, 0.3)' 
                    : '0 2px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: props.mode === 'dark' ? '#0b0b15' : '#f9f7f2',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderBottom: props.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(0, 0, 0, 0.1)'
            }}>
            <div className="container-fluid">
                <a className="navbar-brand" href="/" mode={props.mode==='light'?'dark':'light'}>
                    <i className="fas fa-text-width me-2"></i>
                    {props.title}
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="/edit">
                                <i className="fas fa-edit me-1"></i>
                                Edit
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/blogs">
                                <i className="fas fa-blog me-1"></i>
                                Blogs
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/about">
                                <i className="fas fa-info-circle me-1"></i>
                                About
                            </a>
                        </li>
                    </ul>
                    
                    <div className="d-flex align-items-center">
                        <div className={`form-check form-switch text-${props.mode==='light'?'dark':'light'}`}>
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                onClick={props.toggleMode} 
                                role="switch" 
                                id="flexSwitchCheckDefault" 
                            />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                <i className={`fas fa-${props.mode === 'light' ? 'moon' : 'sun'} me-1`}></i>
                                {props.mode === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </label>
                        </div>
                    </div>
                </div> 
            </div>
        </nav>
    );
}