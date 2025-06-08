import React from 'react';

export default function Navbar(props) {
    return (
        <nav className={`navbar navbar-expand-lg`} 
            style={{
                boxShadow: props.mode === 'dark' 
                    ? '0 2px 10px rgba(0, 0, 0, 0.3)' 
                    : '0 2px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: props.mode === 'dark' ? 'rgba(11, 11, 21, 0.5)' : 'rgba(249, 247, 242, 0.5)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderBottom: props.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(0, 0, 0, 0.1)',
                margin: '1rem',
                borderRadius: '16px',
                color: props.mode === 'dark' ? '#fff' : '#272f52'
            }}>
            <div className="container-fluid">
                <a className="navbar-brand" href="/" style={{ color: props.mode === 'dark' ? '#fff' : '#272f52' }}>
                    <i className="fas fa-text-width me-2"></i>
                    {props.title}
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="/edit" style={{ color: props.mode === 'dark' ? '#fff' : '#272f52' }}>
                                <i className="fas fa-edit me-1"></i>
                                Edit
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/blogs" style={{ color: props.mode === 'dark' ? '#fff' : '#272f52' }}>
                                <i className="fas fa-blog me-1"></i>
                                Blogs
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/about" style={{ color: props.mode === 'dark' ? '#fff' : '#272f52' }}>
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
                            />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault" style={{ color: props.mode === 'dark' ? '#fff' : '#272f52' }}>
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