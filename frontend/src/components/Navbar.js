import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar(props) {
    const navbarRef = useRef(null);
    const { user, logout } = useAuth();

    const navLinkStyle = {
        color: props.mode === 'dark' ? '#fff' : '#272f52',
        fontWeight: '500',
        padding: '0.5rem 1rem',
        borderRadius: '12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        window.location.href = '/';
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                const navbarCollapse = document.getElementById('navbarSupportedContent');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const toggleButton = navbarRef.current.querySelector('.navbar-toggler');
                    if (toggleButton) {
                        toggleButton.click();
                    }
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <nav className={`navbar navbar-expand-lg enhanced-navbar ${props.mode === 'dark' ? 'dark' : ''}`} 
            ref={navbarRef}
            style={{
                boxShadow: props.mode === 'dark' 
                    ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
                backgroundColor: props.mode === 'dark' ? 'rgba(11, 11, 21, 0.4)' : 'rgba(249, 247, 242, 0.4)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: props.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.08)' 
                    : '1px solid rgba(0, 0, 0, 0.08)',
                margin: '1rem',
                borderRadius: '20px',
                color: props.mode === 'dark' ? '#fff' : '#272f52',
                padding: '1rem 2rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
            }}>
            <div className="container-fluid">
                <a className="navbar-brand" href="/" style={{ 
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '1.4rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    display: 'inline-block',
                    color: props.mode === 'dark' ? '#ffb347' : '#ff9800',
                    textShadow: props.mode === 'dark' 
                        ? '0 2px 8px rgba(255, 179, 71, 0.3)' 
                        : '0 2px 8px rgba(255, 152, 0, 0.3)',
                }}>
                    <i className="fas fa-text-width me-2" style={{ 
                        color: props.mode === 'dark' ? '#f06292' : '#f06292',
                        transition: 'all 0.3s ease',
                    }}></i>
                    {props.title}
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link nav-link-enhanced" href="/edit" style={{ 
                                color: props.mode === 'dark' ? '#fff' : '#272f52',
                                fontWeight: '500',
                                padding: '0.5rem 1rem',
                                borderRadius: '12px',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                            }}>
                                <i className="fas fa-edit me-2"></i>
                                Edit
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link nav-link-enhanced" href="/blogs" style={{ 
                                color: props.mode === 'dark' ? '#fff' : '#272f52',
                                fontWeight: '500',
                                padding: '0.5rem 1rem',
                                borderRadius: '12px',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                            }}>
                                <i className="fas fa-blog me-2"></i>
                                Blogs
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link nav-link-enhanced" href="/about" style={{ 
                                color: props.mode === 'dark' ? '#fff' : '#272f52',
                                fontWeight: '500',
                                padding: '0.5rem 1rem',
                                borderRadius: '12px',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                            }}>
                                <i className="fas fa-info-circle me-2"></i>
                                About
                            </a>
                        </li>
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link nav-link-enhanced" href="/profile" style={navLinkStyle}>
                                        <i className="fas fa-user-circle me-2"></i>
                                        {(user.name && user.name.split(' ')[0]) || 'Profile'}
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link nav-link-enhanced" href="/" onClick={handleLogout} style={navLinkStyle}>
                                        <i className="fas fa-sign-out-alt me-2"></i>
                                        Logout
                                    </a>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <a className="nav-link nav-link-enhanced" href="/login" style={navLinkStyle}>
                                    <i className="fas fa-sign-in-alt me-2"></i>
                                    Login
                                </a>
                            </li>
                        )}
                    </ul>
                    
                    <div className="d-flex align-items-center">
                        <div 
                            className={`form-check form-switch text-${props.mode==='light'?'dark':'light'}`}
                            onClick={props.toggleMode}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '16px',
                                background: props.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.05)' 
                                    : 'rgba(0, 0, 0, 0.05)',
                                border: props.mode === 'dark' 
                                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                                    : '1px solid rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                userSelect: 'none',
                                minHeight: '48px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            onMouseDown={e => {
                                e.currentTarget.style.transform = 'scale(0.95)';
                                e.currentTarget.style.background = props.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.1)' 
                                    : 'rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseUp={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.background = props.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.05)' 
                                    : 'rgba(0, 0, 0, 0.05)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.background = props.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.05)' 
                                    : 'rgba(0, 0, 0, 0.05)';
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = props.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.08)' 
                                    : 'rgba(0, 0, 0, 0.08)';
                                e.currentTarget.style.boxShadow = props.mode === 'dark' 
                                    ? '0 4px 16px rgba(255, 179, 71, 0.1)' 
                                    : '0 4px 16px rgba(255, 152, 0, 0.1)';
                            }}
                        >
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                role="switch"
                                readOnly
                                checked={props.mode === 'dark'}
                                style={{
                                    background: props.mode === 'dark' 
                                        ? 'linear-gradient(135deg, #ffb347, #f06292)' 
                                        : 'linear-gradient(135deg, #ff9800, #f06292)',
                                    border: 'none',
                                    boxShadow: props.mode === 'dark' 
                                        ? '0 4px 12px rgba(255, 179, 71, 0.3)' 
                                        : '0 4px 12px rgba(255, 152, 0, 0.3)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    animation: 'pulse 2s ease-in-out infinite',
                                    cursor: 'pointer',
                                    pointerEvents: 'none',
                                    marginRight: '0.75rem',
                                }}
                            />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault" style={{ 
                                color: props.mode === 'dark' ? '#fff' : '#272f52',
                                fontWeight: '500',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                margin: 0,
                            }}>
                                <i className={`fas fa-${props.mode === 'light' ? 'moon' : 'sun'} me-2`} style={{
                                    background: props.mode === 'dark' 
                                        ? 'linear-gradient(135deg, #ffb347, #f06292)' 
                                        : 'linear-gradient(135deg, #ff9800, #f06292)',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                    color: 'transparent',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    animation: 'pulse 2s ease-in-out infinite',
                                }}></i>
                                {props.mode === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}