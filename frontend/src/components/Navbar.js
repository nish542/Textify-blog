import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/navbarStyles.css';

const LINKS = [
  { href: '/edit', label: 'Write' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/about', label: 'About' },
];

export default function Navbar(props) {
  const { user, logout } = useAuth();
  const navRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = props.mode === 'dark';
  // Navbar renders outside the Router, so react-router hooks aren't available;
  // navigation is full-page (<a href>), so pathname is current on each load.
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isActive = (href) => path === href;

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    window.location.href = '/';
  };

  // Close the dropdown and mobile menu when clicking outside the navbar.
  useEffect(() => {
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setProfileOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const firstName = (user && user.name && user.name.split(' ')[0]) || 'Profile';

  return (
    <nav className={`tf-navbar${isDark ? ' dark' : ''}`} ref={navRef}>
      <div className="tf-navbar__inner">
        {/* Left: brand */}
        <a className="tf-brand" href="/">
          <i className="fas fa-text-width"></i>
          {props.title}
        </a>

        {/* Center: nav links */}
        <ul className="tf-nav">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a className={`tf-nav-link${isActive(l.href) ? ' active' : ''}`} href={l.href}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: theme toggle + profile/login + hamburger */}
        <div className="tf-actions">
          <button
            className="tf-theme-btn"
            onClick={props.toggleMode}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            <i className={`fas fa-${isDark ? 'sun' : 'moon'}`}></i>
          </button>

          {user ? (
            <div className={`tf-profile${profileOpen ? ' open' : ''}`}>
              <button
                className="tf-profile__trigger"
                onClick={() => setProfileOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={profileOpen}
              >
                {user.picture ? (
                  <img className="tf-avatar" src={user.picture} alt={firstName} referrerPolicy="no-referrer" />
                ) : (
                  <span className="tf-avatar"><i className="fas fa-user"></i></span>
                )}
                <span className="tf-profile__name">{firstName}</span>
                <i className="fas fa-chevron-down tf-caret"></i>
              </button>

              <div className={`tf-dropdown${profileOpen ? ' open' : ''}`} role="menu">
                <div className="tf-dropdown__header">
                  <div className="name">{user.name}</div>
                  <div className="email">{user.email}</div>
                </div>
                <div className="tf-dropdown__divider" />
                <a className="tf-dropdown__item" href="/profile" role="menuitem">
                  <i className="fas fa-user"></i> Profile
                </a>
                <a className="tf-dropdown__item" href="/profile" role="menuitem">
                  <i className="fas fa-file-alt"></i> My Posts
                </a>
                <div className="tf-dropdown__divider" />
                <a
                  className="tf-dropdown__item tf-dropdown__item--danger"
                  href="/"
                  onClick={handleLogout}
                  role="menuitem"
                >
                  <i className="fas fa-sign-out-alt"></i> Logout
                </a>
              </div>
            </div>
          ) : (
            <a className="tf-login-btn" href="/login">
              <i className="fas fa-sign-in-alt"></i> Login
            </a>
          )}

          <button
            className="tf-hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <i className={`fas fa-${menuOpen ? 'times' : 'bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile menu (nav links) */}
      <div className={`tf-mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="tf-mobile-menu__inner">
          {LINKS.map((l) => (
            <a
              key={l.href}
              className={`tf-mobile-link${isActive(l.href) ? ' active' : ''}`}
              href={l.href}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
