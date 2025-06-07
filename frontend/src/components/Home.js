import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '1rem',
    }}>
      <main style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '550px',
        padding: '2rem',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        textAlign: 'center',
        margin: '1rem',
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 800,
          color: '#19192c',
          margin: 0,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}>
          Write Freely.<br />Edit Smartly.
        </h1>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          width: '100%',
        }}>
          <button
            onClick={() => navigate('/edit')}
            style={{
              width: '100%',
              padding: '1.2rem',
              fontSize: '1.3rem',
              fontWeight: 700,
              border: 'none',
              borderRadius: '18px',
              background: 'linear-gradient(90deg, #ffb199 0%, #ffecd2 100%)',
              color: '#19192c',
              boxShadow: '0 4px 16px rgba(255, 188, 153, 0.15)',
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
              outline: 'none',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 188, 153, 0.25)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 188, 153, 0.15)';
            }}
            aria-label="Edit Text"
          >
            Edit Text
          </button>
          <button
            onClick={() => navigate('/blogs')}
            style={{
              width: '100%',
              padding: '1.2rem',
              fontSize: '1.3rem',
              fontWeight: 700,
              border: 'none',
              borderRadius: '18px',
              background: 'linear-gradient(90deg, #f7e8d0 0%, #f7cac9 100%)',
              color: '#19192c',
              boxShadow: '0 4px 16px rgba(247, 202, 201, 0.15)',
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
              outline: 'none',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(247, 202, 201, 0.25)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(247, 202, 201, 0.15)';
            }}
            aria-label="Explore Blogs"
          >
            Explore Blogs
          </button>
          <button
            onClick={() => navigate('/about')}
            style={{
              width: '100%',
              padding: '1.2rem',
              fontSize: '1.3rem',
              fontWeight: 700,
              border: 'none',
              borderRadius: '18px',
              background: 'linear-gradient(90deg, #ffe5d0 0%, #ffd6d6 100%)',
              color: '#19192c',
              boxShadow: '0 4px 16px rgba(255, 229, 208, 0.15)',
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
              outline: 'none',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 229, 208, 0.25)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 229, 208, 0.15)';
            }}
            aria-label="About"
          >
            About
          </button>
        </div>
      </main>
    </div>
  );
} 