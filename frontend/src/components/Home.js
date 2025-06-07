import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaBookOpen, FaInfoCircle, FaArrowRight, FaRegStar, FaPlus } from 'react-icons/fa';

export default function Home(props) {
  const navigate = useNavigate();
  const isDark = props.mode === 'dark';
  return (
    <div style={{
      minHeight: '2vh',
      width: '100%',
      
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      {/* Logo/Icon Container (spins) */}
      <div style={{
        marginTop: '2.5rem',
        marginBottom: '1.5rem',
        position: 'relative',
        display: 'inline-block',
        fontSize: '4.5rem', // Increased base font size for larger icon
        lineHeight: 1,
        width: '1.8em', // Adjusted width of spinning container to be smaller overall
        height: '1.8em', // Adjusted height of spinning container to be smaller overall
        animation: 'spin 4s linear infinite',
      }}>
        {/* Main Star - Outlined and Centered */}
        <FaRegStar style={{
          color: isDark ? '#ffb347' : '#ff9800',
          filter: isDark ? 'drop-shadow(0 2px 8px #232336)' : 'drop-shadow(0 2px 8px rgba(255,179,71,0.5))',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          fontSize: '1em', // Inherits from parent, will be 4.5rem
        }} />

        {/* Top-Right Sparkle */}
        <FaPlus style={{
          position: 'absolute',
          top: '-0.1em',
          right: '0.6em',
          fontSize: '0.5em',
          color: isDark ? '#ffb347' : '#ff9800',
          filter: isDark ? 'drop-shadow(0 1px 4px #232336)' : 'drop-shadow(0 1px 4px rgba(255,179,71,0.3))',
          zIndex: 1,
        }} />

        {/* Bottom-Left Yellow Dot */}
        <div style={{
          position: 'absolute',
          bottom: '-0.1em',
          left: '0.5em',
          width: '0.3em',
          height: '0.3em',
          borderRadius: '50%',
          backgroundColor: isDark ? '#ffe082' : '#ffd700',
          filter: isDark ? 'drop-shadow(0 1px 4px #232336)' : 'drop-shadow(0 1px 4px rgba(255,215,0,0.3))',
          zIndex: 1,
        }} />

        {/* Second plus sign (optional, but in image) */}
        <FaPlus style={{
          position: 'absolute',
          top: '-0.1em',
          left: '0.7em',
          fontSize: '0.3em',
          opacity: 0.8,
          color: isDark ? '#ffb347' : '#ff9800',
          filter: isDark ? 'drop-shadow(0 1px 4px #232336)' : 'drop-shadow(0 1px 4px rgba(255,179,71,0.3))',
          zIndex: 1,
        }} />
      </div>
      {/* Heading */}
      <h1 style={{
        fontWeight: 900,
        fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
        textAlign: 'center',
        margin: 0,
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
      }}>
        <span style={{ color: isDark ? '#ffb347' : '#ff9800', display: 'inline-block' }}>Write Freely<span style={{ color: isDark ? '#ffb347' : '#ff9800', fontSize: '1.2em' }}>.</span></span><br />
        <span style={{ color: isDark ? '#f06292' : '#f06292', display: 'inline-block' }}>Edit Smartly<span style={{ color: isDark ? '#f06292' : '#f06292', fontSize: '1.2em' }}>.</span></span>
      </h1>
      {/* Subheading */}
      <div style={{
        marginTop: '2rem',
        marginBottom: '2.5rem',
        marginLeft:'1.5rem',
        marginRight:'1.5rem',
        textAlign: 'center',
        color: isDark ? '#f7e8cb' : '#2d2d38',
        fontSize: '1.25rem',
        fontWeight: 500,
        maxWidth: '600px',
        lineHeight: 1.5,
      }}>
        Transform your writing experience with our powerful text editor and discover amazing content from our vibrant community
      </div>
      {/* Buttons Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        justifyContent: 'center',
        marginBottom: '3.5rem',
      }}>
        <button
          onClick={() => navigate('/edit')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '1.2rem 2.2rem',
            fontSize: '1.25rem',
            fontWeight: 700,
            border: 'none',
            borderRadius: '20px',
            background: isDark
              ? 'linear-gradient(90deg, #ffb347 0%, #ff9800 100%)'
              : 'linear-gradient(90deg, #ffb347 0%, #ff9800 100%)',
            color: isDark ? '#232336' : '#fff',
            boxShadow: isDark
              ? '0 6px 24px rgba(255, 179, 71, 0.10), 0 1.5px 4px rgba(0,0,0,0.18)'
              : '0 6px 24px rgba(255, 179, 71, 0.13), 0 1.5px 4px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            transition: 'transform 0.18s, box-shadow 0.18s, filter 0.18s',
            outline: 'none',
            letterSpacing: '0.04em',
            textTransform: 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
            e.currentTarget.style.boxShadow = isDark
              ? '0 12px 32px rgba(255, 179, 71, 0.18), 0 2px 8px rgba(0,0,0,0.22)'
              : '0 12px 32px rgba(255, 179, 71, 0.22), 0 2px 8px rgba(0,0,0,0.10)';
            e.currentTarget.style.filter = 'brightness(1.08)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = isDark
              ? '0 6px 24px rgba(255, 179, 71, 0.10), 0 1.5px 4px rgba(0,0,0,0.18)'
              : '0 6px 24px rgba(255, 179, 71, 0.13), 0 1.5px 4px rgba(0,0,0,0.08)';
            e.currentTarget.style.filter = 'none';
          }}
        >
          <FaPen style={{ fontSize: '1.3em' }} /> Edit Text <FaArrowRight style={{ fontSize: '1.1em' }} />
        </button>
        <button
          onClick={() => navigate('/blogs')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '1.2rem 2.2rem',
            fontSize: '1.25rem',
            fontWeight: 700,
            border: 'none',
            borderRadius: '20px',
            background: isDark
              ? 'linear-gradient(90deg, #f06292 0%, #f8b195 100%)'
              : 'linear-gradient(90deg, #f06292 0%, #f8b195 100%)',
            color: isDark ? '#232336' : '#fff',
            boxShadow: isDark
              ? '0 6px 24px rgba(246, 114, 128, 0.10), 0 1.5px 4px rgba(0,0,0,0.18)'
              : '0 6px 24px rgba(246, 114, 128, 0.13), 0 1.5px 4px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            transition: 'transform 0.18s, box-shadow 0.18s, filter 0.18s',
            outline: 'none',
            letterSpacing: '0.04em',
            textTransform: 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
            e.currentTarget.style.boxShadow = isDark
              ? '0 12px 32px rgba(246, 114, 128, 0.18), 0 2px 8px rgba(0,0,0,0.22)'
              : '0 12px 32px rgba(246, 114, 128, 0.22), 0 2px 8px rgba(0,0,0,0.10)';
            e.currentTarget.style.filter = 'brightness(1.08)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = isDark
              ? '0 6px 24px rgba(246, 114, 128, 0.10), 0 1.5px 4px rgba(0,0,0,0.18)'
              : '0 6px 24px rgba(246, 114, 128, 0.13), 0 1.5px 4px rgba(0,0,0,0.08)';
            e.currentTarget.style.filter = 'none';
          }}
        >
          <FaBookOpen style={{ fontSize: '1.3em' }} /> Explore Blogs <FaArrowRight style={{ fontSize: '1.1em' }} />
        </button>
        <button
          onClick={() => navigate('/about')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '1.2rem 2.2rem',
            fontSize: '1.25rem',
            fontWeight: 700,
            border: 'none',
            borderRadius: '20px',
            background: isDark
              ? 'linear-gradient(90deg, #ffe082 0%, #ffb347 100%)'
              : 'linear-gradient(90deg, #ffecb3 0%, #ffb347 100%)',
            color: isDark ? '#232336' : '#b47b00',
            boxShadow: isDark
              ? '0 6px 24px rgba(255, 224, 130, 0.10), 0 1.5px 4px rgba(0,0,0,0.18)'
              : '0 6px 24px rgba(255, 236, 179, 0.13), 0 1.5px 4px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            transition: 'transform 0.18s, box-shadow 0.18s, filter 0.18s',
            outline: 'none',
            letterSpacing: '0.04em',
            textTransform: 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
            e.currentTarget.style.boxShadow = isDark
              ? '0 12px 32px rgba(255, 224, 130, 0.18), 0 2px 8px rgba(0,0,0,0.22)'
              : '0 12px 32px rgba(255, 236, 179, 0.22), 0 2px 8px rgba(0,0,0,0.10)';
            e.currentTarget.style.filter = 'brightness(1.08)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = isDark
              ? '0 6px 24px rgba(255, 224, 130, 0.10), 0 1.5px 4px rgba(0,0,0,0.18)'
              : '0 6px 24px rgba(255, 236, 179, 0.13), 0 1.5px 4px rgba(0,0,0,0.08)';
            e.currentTarget.style.filter = 'none';
          }}
        >
          <FaInfoCircle style={{ fontSize: '1.3em' }} /> About <FaArrowRight style={{ fontSize: '1.1em' }} />
        </button>
      </div>
    </div>
  );
} 