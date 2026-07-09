// Styles for the EditText page (src/components/editText.js).
//
// These are inline-style objects and event handlers extracted from the
// component. Values that depend on the light/dark `mode` (or other state) are
// exported as functions; static ones as plain objects.

// --- Heading / description ---------------------------------------------------

export const description = (mode) => ({
  color: mode === 'dark' ? '#f5e6d3' : '#6c757d',
  fontSize: '1.1rem',
  marginBottom: '2rem',
});

// --- Textarea ----------------------------------------------------------------

export const textarea = (mode, hasText) => ({
  backgroundColor: mode === 'dark' ? 'rgb(213 213 228)' : 'rgba(255, 255, 255, 0.7)',
  border: '2px solid rgba(233, 236, 239, 0.5)',
  borderRadius: '10px',
  transition: 'all 0.3s ease',
  color: 'black',
  backdropFilter: 'blur(5px)',
  transform: 'scale(1)',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  animation: hasText ? 'pulse 0.5s ease-in-out' : 'none',
});

export const onTextareaFocus = (e) => {
  e.currentTarget.style.transform = 'scale(1.01)';
  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
  e.currentTarget.style.borderColor = 'rgba(13, 110, 253, 0.5)';
};

export const onTextareaBlur = (e) => {
  e.currentTarget.style.transform = 'scale(1)';
  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
  e.currentTarget.style.borderColor = 'rgba(233, 236, 239, 0.5)';
};

export const pulseKeyframes = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.01); }
    100% { transform: scale(1); }
  }
`;

// --- Buttons -----------------------------------------------------------------

const buttonBase = {
  border: 'none',
  borderRadius: '12px',
  color: 'white',
  fontWeight: '600',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  transform: 'translateY(0)',
};

// Per-button color/shadow config. `variant` keys are used across buttonStyle(),
// onButtonHover(), and onButtonOut() so a button's look stays in sync.
export const buttonVariants = {
  uppercase: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    shadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    shadowHover: '0 6px 16px rgba(102, 126, 234, 0.4)',
  },
  lowercase: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    shadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    shadowHover: '0 6px 16px rgba(102, 126, 234, 0.4)',
  },
  removeSpaces: {
    background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
    shadow: '0 4px 12px rgba(108, 117, 125, 0.3)',
    shadowHover: '0 6px 16px rgba(108, 117, 125, 0.4)',
  },
  clear: {
    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
    shadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
    shadowHover: '0 6px 16px rgba(220, 53, 69, 0.4)',
  },
  grammar: {
    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    shadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
    shadowHover: '0 6px 16px rgba(40, 167, 69, 0.4)',
  },
  translate: {
    background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
    shadow: '0 4px 12px rgba(23, 162, 184, 0.3)',
    shadowHover: '0 6px 16px rgba(23, 162, 184, 0.4)',
    minWidth: '150px',
  },
};

export const buttonStyle = (variant) => {
  const v = buttonVariants[variant];
  return {
    ...buttonBase,
    background: v.background,
    boxShadow: v.shadow,
    ...(v.minWidth ? { minWidth: v.minWidth } : {}),
  };
};

export const onButtonHover = (variant) => (e) => {
  if (!e.currentTarget.disabled) {
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = buttonVariants[variant].shadowHover;
  }
};

export const onButtonOut = (variant) => (e) => {
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = buttonVariants[variant].shadow;
};

// Shimmer sweep overlay used inside every button.
export const shimmer = {
  position: 'absolute',
  top: 0,
  left: '-100%',
  width: '100%',
  height: '100%',
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
  transition: 'left 0.5s',
};

export const onShimmerOver = (e) => {
  e.target.style.left = '100%';
};

// --- Translation dropdown ----------------------------------------------------

export const languageSelect = (mode) => ({
  backgroundColor: mode === 'dark' ? 'rgb(204, 204, 236)' : 'rgba(255, 255, 255, 0.7)',
  border: '2px solid rgba(233, 236, 239, 0.5)',
  borderRadius: '10px',
  transition: 'all 0.3s ease',
  color: mode === 'dark' ? '#4e4e59' : 'black',
  backdropFilter: 'blur(5px)',
});

// --- Result cards ------------------------------------------------------------

export const cardText = { minHeight: '100px' };

export const correctedText = (mode) => ({
  minHeight: '100px',
  whiteSpace: 'pre-wrap',
  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(248, 249, 250, 0.1)',
  padding: '15px',
  borderRadius: '10px',
  backdropFilter: 'blur(5px)',
  color: mode === 'dark' ? 'black' : 'black',
});
